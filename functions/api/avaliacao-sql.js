export async function onRequestGet({ request, env }) {
  if (env.AVALIACAO_SQL !== "habilitado") {
    return new Response("Not found", { status: 404 });
  }

  const nome = new URL(request.url).searchParams.get("aluno") || "";
  const resultado = await env.DB.prepare(
    "SELECT id, aluno, conteudo FROM notas WHERE aluno = ?"
  ).bind(nome).all();

  return Response.json(resultado.results, {
    headers: { "Cache-Control": "no-store" },
  });
}
