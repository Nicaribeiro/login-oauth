import { generateRandomToken, sha256Base64Url, computeCodeChallenge } from "../../_shared/crypto.js";
import { isValidProvider, PROVIDERS } from "../../_shared/providers.js";
import { buildTransactionCookie } from "../../_shared/cookies.js";

export async function onRequestGet(context) {
  const { params, env } = context;
  const provider = params.provider;

  // 1. Aceitar somente google ou github
  if (!isValidProvider(provider)) {
    return new Response("Not found", { status: 404 });
  }

  // 2. Gerar valores aleatórios da transação
  const transactionToken = generateRandomToken(); // vai virar o cookie temporário
  const state = generateRandomToken();
  const codeVerifier = generateRandomToken();
  const nonce = provider === "google" ? generateRandomToken() : null;

  // Calcular os resumos que serão guardados no banco
  const idHash = await sha256Base64Url(transactionToken);
  const stateHash = await sha256Base64Url(state);

  // Transação expira em 10 minutos (600 segundos)
  const expiresAt = Math.floor(Date.now() / 1000) + 600;

  // 3. Gravar a transação no D1
  await env.DB.prepare(
    `INSERT INTO oauth_transactions (id_hash, provider, state_hash, nonce, code_verifier, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(idHash, provider, stateHash, nonce, codeVerifier, expiresAt)
    .run();

  // 4. Montar o pedido de autorização
  const codeChallenge = await computeCodeChallenge(codeVerifier);
  const redirectUri = `${env.PUBLIC_BASE_URL}/oauth/callback/${provider}`;

  const authUrl = new URL(PROVIDERS[provider].authorizationEndpoint);
  authUrl.searchParams.set(
    "client_id",
    provider === "google" ? env.GOOGLE_CLIENT_ID : env.GITHUB_CLIENT_ID
  );
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  if (provider === "google") {
    authUrl.searchParams.set("scope", PROVIDERS.google.scope);
    authUrl.searchParams.set("nonce", nonce);
  }
  // No GitHub, scope e nonce ficam de fora de propósito

  // 5. Responder com redirecionamento 302 e criar o cookie temporário
  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      "Set-Cookie": buildTransactionCookie(transactionToken),
      "Cache-Control": "no-store",
    },
  });
}
