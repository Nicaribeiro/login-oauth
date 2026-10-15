# Avaliação de GitHub Actions

## Situação da entrega

Em preparação. As evidências abaixo devem ser preenchidas com execuções reais; a criação dos arquivos não comprova a conclusão da avaliação.

## Tarefa 1 - CI

O workflow `ci.yml` verifica segredos versionados, aplica as migrações em SQLite local e valida o HTML. A busca imprime somente nomes de arquivos para não expor possíveis segredos no log.

Testar a migração em SQLite permite detectar erros de sintaxe e de estrutura antes de aplicar alterações no D1 remoto.

- Execução aprovada: https://github.com/Nicaribeiro/login-oauth/actions/runs/38817667940
- Execução com falha proposital: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818809085
- Linha do log: `Parse error near line 1: near "CREAT": syntax error`. Detalhes em [evidencias/01-ci-falha-e-correcao.md](evidencias/01-ci-falha-e-correcao.md).
- Execução após a correção: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818860101

## Tarefa 2 - Proteção da main

- Regra exigindo PR e o status `verificar`: pendente.
- PR com CI reprovado e merge bloqueado: pendente.
- Mesmo PR após a correção: pendente.
- Saída de `git push` direto recusado: pendente.

## Tarefa 3 - Revisão por IA

- PR com SQL vulnerável e comentário da IA: pendente.
- Correção com `prepare(...).bind(...)` e nova revisão: pendente.
- Execução sem `pull-requests: write` e erro de permissão: pendente.
- Restauração da permissão: pendente.
- Afirmação incorreta ou irrelevante da IA e explicação: pendente de uma revisão real.

## Tarefa 4 - Migração após o merge

- PR separado com `0002_adiciona_coluna.sql`: pendente.
- Execução de `migrar` após o merge: pendente.
- Saída de `PRAGMA table_info(notas)` com a nova coluna: pendente.
- Segundo merge sem modificar `migrations/`: pendente.
- Confirmação de que esse segundo merge não disparou `migrar`: pendente.

## Perguntas

### 1. Por que o CI roda duas vezes com PR aberto?

O push dispara uma execução na ramificação e também atualiza o PR, disparando o evento `pull_request`. A execução de PR testa o commit de merge simulado com a base; quando existem checks de push e de PR com o mesmo nome, ambos precisam passar para satisfazer o check obrigatório.

### 2. Por que forks não recebem COPILOT_PAT?

O código de um fork pode ter sido escrito por alguém sem permissão no repositório de destino, por isso os segredos não são disponibilizados a esse workflow. Isso impede que um PR altere comandos para roubar o token ou enviá-lo a um servidor externo.

### 3. Por que declarar permissions?

A declaração limita o `GITHUB_TOKEN` ao necessário: leitura do código e escrita de comentários no PR. Assim, o funcionamento não depende das permissões padrão do repositório e o token não recebe acesso desnecessário.

### 4. A IA substitui o status check?

Não. O CI executa verificações reproduzíveis, enquanto a IA pode produzir avaliações incorretas ou irrelevantes e seu comentário não exige a correção dos problemas encontrados. A conclusão deve ser complementada com o exemplo real observado na Tarefa 3, ainda pendente.
