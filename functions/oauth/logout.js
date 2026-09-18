import { getCookie, clearSessionCookie } from "../_shared/cookies.js";
import { sha256Base64Url } from "../_shared/crypto.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Aceitar somente POST (isso já é garantido pelo nome da função onRequestPost)

  // 2. Exigir um cabeçalho Origin exatamente igual a PUBLIC_BASE_URL
  const origin = request.headers.get("Origin");
  if (origin !== env.PUBLIC_BASE_URL) {
    return new Response("Origem inválida", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // 3. Remover a linha da sessão no D1 (se existir)
  const sessionToken = getCookie(request, "__Host-session");
  if (sessionToken) {
    const sessionIdHash = await sha256Base64Url(sessionToken);
    await env.DB.prepare(`DELETE FROM sessions WHERE id_hash = ?`)
      .bind(sessionIdHash)
      .run();
  }

  // 4. Expirar o cookie
  // 5. Responder com Cache-Control: no-store
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": clearSessionCookie(),
      "Cache-Control": "no-store",
    },
  });
}
