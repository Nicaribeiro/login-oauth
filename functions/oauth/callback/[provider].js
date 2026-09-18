import { generateRandomToken, sha256Base64Url } from "../../_shared/crypto.js";
import { isValidProvider, PROVIDERS } from "../../_shared/providers.js";
import {
  getCookie,
  clearTransactionCookie,
  buildSessionCookie,
} from "../../_shared/cookies.js";
import { validateGoogleIdToken } from "../../_shared/oidc.js";

export async function onRequestGet(context) {
  const { request, params, env } = context;
  const provider = params.provider;

  if (!isValidProvider(provider)) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // 1. Recusar error ou ausência de code/state
  if (error || !code || !state) {
    return new Response("Falha na autenticação", { status: 400 });
  }

  // 2. Exigir o cookie de transação
  const transactionToken = getCookie(request, "__Host-oauth-tx");
  if (!transactionToken) {
    return new Response("Transação ausente", { status: 400 });
  }

  // 3. Calcular o resumo e localizar a transação não expirada
  const idHash = await sha256Base64Url(transactionToken);
  const now = Math.floor(Date.now() / 1000);

  const transaction = await env.DB.prepare(
    `SELECT * FROM oauth_transactions WHERE id_hash = ? AND expires_at > ?`
  )
    .bind(idHash, now)
    .first();

  if (!transaction) {
    return new Response("Transação inválida ou expirada", { status: 400 });
  }

  // 4. Comparar o resumo de state
  const stateHash = await sha256Base64Url(state);
  if (stateHash !== transaction.state_hash) {
    return new Response("State inválido", { status: 400 });
  }

  // 5. Apagar a transação antes de concluir (evita reutilização)
  await env.DB.prepare(`DELETE FROM oauth_transactions WHERE id_hash = ?`)
    .bind(idHash)
    .run();

  const redirectUri = `${env.PUBLIC_BASE_URL}/oauth/callback/${provider}`;
  let issuer, subject, email, displayName;

  try {
    if (provider === "google") {
      // 6. Trocar o código pelo id_token
      const tokenResponse = await fetch(PROVIDERS.google.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          code,
          code_verifier: transaction.code_verifier,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Falha ao trocar o código com o Google");
      }
      const tokenData = await tokenResponse.json();

      // 7. Validar o id_token
      const payload = await validateGoogleIdToken(tokenData.id_token, {
        expectedNonce: transaction.nonce,
        googleClientId: env.GOOGLE_CLIENT_ID,
        issuer: PROVIDERS.google.issuer,
        discoveryDocumentUrl: PROVIDERS.google.discoveryDocument,
      });

      issuer = PROVIDERS.google.issuer;
      subject = payload.sub;
      email = payload.email || null;
      displayName = payload.name || null;
    } else {
      // GitHub: trocar o código pelo access_token
      const tokenResponse = await fetch(PROVIDERS.github.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          code_verifier: transaction.code_verifier,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Falha ao trocar o código com o GitHub");
      }
      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token || !/bearer/i.test(tokenData.token_type || "")) {
        throw new Error("Resposta de token do GitHub inválida");
      }

      // Consultar o perfil autenticado
      const userResponse = await fetch(PROVIDERS.github.userEndpoint, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
          "User-Agent": "login-oauth-lab",
        },
      });

      if (userResponse.status !== 200) {
        throw new Error("Falha ao consultar /user no GitHub");
      }
      const userData = await userResponse.json();

      issuer = PROVIDERS.github.issuer;
      subject = String(userData.id);
      email = userData.email || null;
      displayName = userData.name || userData.login || null;

      // Revogar a autorização concedida (DELETE /applications/{client_id}/grant)
      const basicAuth = btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`);
      const revokeResponse = await fetch(
        PROVIDERS.github.revokeEndpoint(env.GITHUB_CLIENT_ID),
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
            "User-Agent": "login-oauth-lab",
          },
          body: JSON.stringify({ access_token: tokenData.access_token }),
        }
      );

      if (revokeResponse.status !== 204) {
        throw new Error("Falha ao revogar a autorização do GitHub");
      }
    }
  } catch (err) {
    return new Response("Falha na validação da identidade", { status: 400 });
  }

  // 8. Criar uma sessão opaca
  const sessionToken = generateRandomToken();
  const sessionIdHash = await sha256Base64Url(sessionToken);
  const sessionExpiresAt = now + 28800; // 8 horas

  await env.DB.prepare(
    `INSERT INTO sessions (id_hash, issuer, subject, email, display_name, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(sessionIdHash, issuer, subject, email, displayName, sessionExpiresAt, now)
    .run();

  // 9 e 10. Limpar o cookie temporário, criar o cookie de sessão e redirecionar
  const headers = new Headers();
  headers.append("Set-Cookie", clearTransactionCookie());
  headers.append("Set-Cookie", buildSessionCookie(sessionToken));
  headers.set("Location", env.PUBLIC_BASE_URL);
  headers.set("Cache-Control", "no-store");

  return new Response(null, { status: 302, headers });
}
