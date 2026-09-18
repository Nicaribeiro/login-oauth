// Lê o valor de um cookie específico a partir do cabeçalho Cookie da requisição
export function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split("=");
    if (cookieName === name) {
      return rest.join("=");
    }
  }
  return null;
}

// Monta o cabeçalho Set-Cookie para o cookie temporário de transação (login em andamento)
export function buildTransactionCookie(value) {
  return `__Host-oauth-tx=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
}

// Monta o cabeçalho Set-Cookie para apagar o cookie temporário de transação
export function clearTransactionCookie() {
  return `__Host-oauth-tx=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

// Monta o cabeçalho Set-Cookie para o cookie de sessão (usuário logado, dura 8 horas)
export function buildSessionCookie(value) {
  return `__Host-session=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`;
}

// Monta o cabeçalho Set-Cookie para apagar o cookie de sessão (usado no logout)
export function clearSessionCookie() {
  return `__Host-session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
