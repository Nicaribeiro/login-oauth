// Gera 32 bytes aleatórios e devolve como Base64URL (43 caracteres, sem padding)
export function generateRandomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

// Converte um ArrayBuffer/Uint8Array para Base64URL sem preenchimento
function base64UrlEncode(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Calcula o SHA-256 de uma string e devolve como Base64URL (usado para "resumos")
export async function sha256Base64Url(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(hashBuffer));
}

// Calcula o code_challenge (S256) a partir do code_verifier, para o PKCE
export async function computeCodeChallenge(codeVerifier) {
  return sha256Base64Url(codeVerifier);
}
