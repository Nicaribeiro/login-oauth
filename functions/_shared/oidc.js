// Converte Base64URL para um ArrayBuffer de bytes
function base64UrlToBytes(base64url) {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Decodifica um segmento do JWT (header ou payload) de Base64URL para objeto JSON
function decodeJwtSegment(segment) {
  const bytes = base64UrlToBytes(segment);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

// Valida o id_token (JWT) do Google e devolve o payload se tudo estiver correto.
// Lança um erro (throw) se qualquer verificação falhar.
export async function validateGoogleIdToken(idToken, { expectedNonce, googleClientId, issuer, discoveryDocumentUrl }) {
  // 1. Separar as três partes do JWT
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("id_token com formato inválido");
  }
  const [headerB64, payloadB64, signatureB64] = parts;

  // 2. Decodificar o cabeçalho e exigir alg = RS256
  const header = decodeJwtSegment(headerB64);
  if (header.alg !== "RS256") {
    throw new Error("Algoritmo do id_token não suportado");
  }

  // 3. Obter o documento de descoberta OIDC
  const discoveryResponse = await fetch(discoveryDocumentUrl);
  if (!discoveryResponse.ok) {
    throw new Error("Não foi possível obter o documento de descoberta OIDC");
  }
  const discoveryDocument = await discoveryResponse.json();

  // 4. Obter o JWKS (conjunto de chaves públicas)
  const jwksResponse = await fetch(discoveryDocument.jwks_uri);
  if (!jwksResponse.ok) {
    throw new Error("Não foi possível obter o JWKS");
  }
  const jwks = await jwksResponse.json();

  // 5. Selecionar a chave pública pelo kid do cabeçalho
  const jwk = jwks.keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    throw new Error("Chave pública correspondente não encontrada no JWKS");
  }

  // 6. Importar a JWK como chave pública utilizável
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // 7. Verificar a assinatura
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToBytes(signatureB64);
  const isValid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    signedData
  );
  if (!isValid) {
    throw new Error("Assinatura do id_token inválida");
  }

  // 8. Validar iss, aud, exp, iat e nonce
  const payload = decodeJwtSegment(payloadB64);
  const now = Math.floor(Date.now() / 1000);

  if (payload.iss !== issuer && payload.iss !== `https://accounts.google.com`) {
    throw new Error("Emissor (iss) inválido");
  }
  if (payload.aud !== googleClientId) {
    throw new Error("Audiência (aud) inválida");
  }
  if (typeof payload.exp !== "number" || payload.exp < now) {
    throw new Error("id_token expirado");
  }
  if (typeof payload.iat !== "number" || payload.iat > now + 60) {
    throw new Error("id_token emitido no futuro");
  }
  if (payload.nonce !== expectedNonce) {
    throw new Error("Nonce inválido");
  }

  // Se chegou até aqui, o id_token é válido
  return payload; // contém sub, email, name, etc.
}
