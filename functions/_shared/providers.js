// Configurações fixas de cada provedor OAuth

export const PROVIDERS = {
  google: {
    // Endpoint de autorização do Google (para onde mandamos o navegador)
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    // Endpoint de troca do código pelo token
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    // Documento de descoberta OIDC (para achar o JWKS)
    discoveryDocument: "https://accounts.google.com/.well-known/openid-configuration",
    // Emissor esperado no id_token
    issuer: "https://accounts.google.com",
    scope: "openid email profile",
  },
  github: {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    userEndpoint: "https://api.github.com/user",
    revokeEndpoint: (clientId) =>
      `https://api.github.com/applications/${clientId}/grant`,
    issuer: "https://github.com",
  },
};

// Confere se o provedor pedido é válido (só aceita google ou github)
export function isValidProvider(provider) {
  return provider === "google" || provider === "github";
}
