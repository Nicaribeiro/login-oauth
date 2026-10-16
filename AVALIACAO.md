# Avaliação de GitHub Actions

## Situação da entrega

As quatro tarefas foram executadas. Os links abaixo apontam para runs reais, PRs e prints reunidos em evidencias/. Os PRs de teste foram encerrados sem merge; a preparação e a migração foram incorporadas à main.

## Tarefa 1 - CI

O workflow `ci.yml` verifica segredos versionados, aplica as migrações em SQLite local e valida o HTML. A busca imprime somente nomes de arquivos para não expor possíveis segredos no log.

Testar a migração em SQLite permite detectar erros de sintaxe e de estrutura antes de aplicar alterações no D1 remoto.

- Execução aprovada: https://github.com/Nicaribeiro/login-oauth/actions/runs/38817667940
- Execução com falha proposital: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818809085
- Linha do log: `Parse error near line 1: near "CREAT": syntax error`. Detalhes em [evidencias/01-ci-falha-e-correcao.md](evidencias/01-ci-falha-e-correcao.md).
- Execução após a correção: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818860101

## Tarefa 2 - Proteção da main

- Regra `Proteção da main`, ID 25203077: ativa para `main`, exigindo PR e o status `verificar`.
- PR com CI reprovado e estado `blocked`: https://github.com/Nicaribeiro/login-oauth/pull/2. Run: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820011100.
- Mesmo PR após a correção: checks obrigatórios aprovados em https://github.com/Nicaribeiro/login-oauth/actions/runs/38820097514. Prints e limites da evidência em [evidencias/06-protecao-main.md](evidencias/06-protecao-main.md).
- Saída real de `git push` recusado por GH013: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820633564. [Log e print](evidencias/08-push-direto-recusado.md).

Complemento da Tarefa 2: no [PR #9](https://github.com/Nicaribeiro/login-oauth/pull/9), o SQL inválido bloqueou o botão de merge e a correção na mesma branch liberou o botão, com todos os checks aprovados. [Print bloqueado](evidencias/18-pr-bloqueado-nota10.jpg) e [print liberado](evidencias/19-pr-liberado-nota10.jpg). O PR de demonstração foi encerrado sem merge.

## Tarefa 3 - Revisão por IA

- PR e comentário sobre SQL vulnerável: https://github.com/Nicaribeiro/login-oauth/pull/3#issuecomment-6204026550
- Correção e nova revisão: https://github.com/Nicaribeiro/login-oauth/pull/3#issuecomment-6204057207
- Falha sem `pull-requests: write`: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820970380. Erro: `GraphQL: Resource not accessible by integration (addComment)`.
- Permissão restaurada no commit `6bd2ccaa973c9c6bafc6279d0f79b31be8658d2f`; execução aprovada: https://github.com/Nicaribeiro/login-oauth/actions/runs/38821140086.
- A IA propôs um menu de correções e commits que o workflow não implementa. Esse conteúdo é irrelevante para uma revisão automática sem interação; não comprova uma funcionalidade de correção. [Comentários, análise e prints](evidencias/12-revisao-ia.md).

### Correção adicional: PDF no diff

O PR #7 incluiu um PDF que o Git interpretou como texto. Bytes NUL no prompt impediram a chamada ao Copilot CLI. O PR #8 marca PDFs como binários somente no checkout do job, preservando as alterações textuais e as permissões.

- Teste ao abrir PR: https://github.com/Nicaribeiro/login-oauth/actions/runs/38899434241
- Teste ao atualizar PR: https://github.com/Nicaribeiro/login-oauth/actions/runs/38899549149
- Comentário publicado: https://github.com/Nicaribeiro/login-oauth/pull/8#issuecomment-6215339584
- O PDF foi restaurado exatamente ao conteúdo original.

## Tarefa 4 - Migração após o merge

- PR separado com `0002_adiciona_coluna.sql`, mesclado: https://github.com/Nicaribeiro/login-oauth/pull/4
- Execução de `migrar` após o merge: https://github.com/Nicaribeiro/login-oauth/actions/runs/38828061519
- `PRAGMA table_info(notas)` confirmou `titulo TEXT`, cid 4, no step Confirma estrutura de notas do run acima. [Saída e print](evidencias/13-migracao-d1.md).
- Segundo merge sem modificar `migrations/`: https://github.com/Nicaribeiro/login-oauth/pull/5, commit `bf9af8e7258f30daf66d4f0f4a93d92bafccb78f`.
- O segundo merge disparou somente CI: https://github.com/Nicaribeiro/login-oauth/actions/runs/38828283145. A consulta de runs por esse SHA não contém `migrar`. [Prova e print](evidencias/17-filtro-paths.md).

## Bônus - Resumo das migrações por IA

Implementado em migrar.yml: log da aplicação, actions/ai-inference e publicação em `$GITHUB_STEP_SUMMARY`. Testes reais em SQLite isolado passaram e publicaram o resumo:
https://github.com/Nicaribeiro/login-oauth/actions/runs/38900393218 e
https://github.com/Nicaribeiro/login-oauth/actions/runs/38900535851.

[Print](evidencias/20-resumo-ia-sqlite.jpg) e [implementação, evidências e limites](evidencias/21-resumo-migracoes-ia.md). O novo step ainda não foi executado após uma nova migração D1 remota; não reivindicamos essa evidência. O bônus é opcional e a rubrica limita a nota total a 10.

## Estado desta atualização

As correções e evidências desta revisão estão no PR #8, ainda sujeito a aprovação e merge. Não houve alteração direta na main, relaxamento de proteção ou mudança nas rotas OAuth. Os dados e as migrações de produção não foram modificados pelos testes isolados.

## Perguntas

### 1. Por que o CI roda duas vezes com PR aberto?

O push dispara uma execução na ramificação e também atualiza o PR, disparando o evento `pull_request`. A execução de PR testa o commit de merge simulado com a base; quando existem checks de push e de PR com o mesmo nome, ambos precisam passar para satisfazer o check obrigatório.

### 2. Por que forks não recebem COPILOT_PAT?

O código de um fork pode ter sido escrito por alguém sem permissão no repositório de destino, por isso os segredos não são disponibilizados a esse workflow. Isso impede que um PR altere comandos para roubar o token ou enviá-lo a um servidor externo.

### 3. Por que declarar permissions?

A declaração limita o `GITHUB_TOKEN` ao necessário: leitura do código e escrita de comentários no PR. Assim, o funcionamento não depende das permissões padrão do repositório e o token não recebe acesso desnecessário.

### 4. A IA substitui o status check?

Não. O CI executa verificações reproduzíveis, enquanto a IA pode produzir avaliações incorretas ou irrelevantes e seu comentário não exige a correção dos problemas encontrados. Na Tarefa 3, a IA propôs um menu de correções e commits que o workflow não executa, mostrando que parte da resposta pode ser irrelevante mesmo quando identifica corretamente o SQL vulnerável.
