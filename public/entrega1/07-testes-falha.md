# Testes de falha

## Caso 1: retorno sem cookie temporário

**Preparação:** login iniciado em uma janela comum, URL de autorização copiada e aberta em uma janela anônima que não possui o cookie __Host-oauth-tx.

**Pedido enviado:** conclusão do login com Google na janela anônima, retornando para /oauth/callback/google sem o cookie de transação.

**Resultado esperado:** a rota de retorno recusa a resposta e não cria uma sessão.

**Resultado observado:** a rota respondeu "Transação ausente" e não criou nenhuma sessão, confirmando a recusa esperada.


## Caso 2: state alterado

**Preparação:** login com Google iniciado em uma janela comum, parando na tela "Escolha uma conta" sem concluir. A URL de autorização foi copiada da aba Network, um único caractere do parâmetro state foi alterado e a URL alterada foi aberta na mesma aba, com o cookie __Host-oauth-tx ainda presente.

**Pedido enviado:** após escolher a conta no Google, o navegador retornou para GET /oauth/callback/google com o state modificado e com o cookie de transação original.

**Resultado esperado:** a rota de retorno recusa a resposta antes de trocar o código.

**Resultado observado:** a rota respondeu "State inválido" com status 400 (visto na aba Network), recusando a resposta antes da troca do código.


## Caso 3: reutilização da transação

**Preparação:** login completo com Google realizado com sucesso; a requisição de retorno (callback) foi localizada na aba Network do navegador e sua URL copiada sem alterações.

**Pedido enviado:** a mesma URL de retorno foi reaberta em uma nova aba, sem qualquer modificação.

**Resultado esperado:** a transação já terá sido removida e a repetição deverá falhar.

**Resultado observado:** a rota respondeu "Transação ausente", confirmando que a reutilização foi recusada com sucesso.


## Caso 4: sessão expirada

**Preparação:** sessão de teste criada normalmente através de login com Google; no console do banco D1, a expiração de todas as sessões foi forçada com UPDATE sessions SET expires_at = 0.

**Pedido enviado:** recarregamento da página (F5), que consulta /api/me automaticamente.

**Resultado esperado:** /api/me deverá responder 401.

**Resultado observado:** a página voltou a mostrar "Nenhuma sessão neste navegador", confirmando que a sessão expirada não foi mais aceita.


## Caso 5: origem inválida na saída

**Preparação:** sessão válida aberta em login-oauth.pages.dev através de login com Google; em uma aba separada com outra origem (example.com), foi executado no console do navegador um fetch para /oauth/logout com credentials: "include".

**Pedido enviado:** POST para https://login-oauth.pages.dev/oauth/logout, originado a partir de example.com.

**Resultado esperado:** a rota deverá recusar a operação; a sessão original deve permanecer válida.

**Resultado observado:** ao voltar para a aba de login-oauth.pages.dev, a sessão continuou válida ("Sessão de [REMOVIDO]"), confirmando que a rota recusou a operação vinda de outra origem.


## Caso 6: reutilização do cookie revogado

**Preparação:** sessão válida criada por login com Google; o valor do cookie __Host-session foi copiado antes do logout, usando as ferramentas de desenvolvedor do navegador.

**Pedido enviado:** após o logout, o valor antigo do cookie foi restaurado manualmente via console do navegador, e a página foi recarregada.

**Resultado esperado:** como a linha correspondente foi removida do D1, a resposta de /api/me deverá ser 401.

**Resultado observado:** o console mostrou que /api/me respondeu com status 401, e a página voltou a exibir "Nenhuma sessão neste navegador", confirmando que o cookie revogado não restaurou a sessão.
