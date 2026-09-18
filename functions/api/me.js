import { getCookie } from "../_shared/cookies.js";
import { sha256Base64Url } from "../_shared/crypto.js";

export async function onRequestGet(context) {
  const { request, env } = context;

  const sessionToken = getCookie(request, "__Host-session");
  if (!sessionToken) {
    return new Response("Não autenticado", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const sessionIdHash = await sha256Base64Url(sessionToken);
  const now = Math.floor(Date.now() / 1000);

  const session = await env.DB.prepare(
    `SELECT * FROM sessions WHERE id_hash = ? AND expires_at > ?`
  )
    .bind(sessionIdHash, now)
    .first();

  if (!session) {
    return new Response("Não autenticado", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return Response.json(
    {
      email: session.email,
      displayName: session.display_name,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
