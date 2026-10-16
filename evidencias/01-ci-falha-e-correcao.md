# Tarefa 1 - SQL inválido e correção

PR de teste: https://github.com/Nicaribeiro/login-oauth/pull/2

Ramificação: `teste-ci-migracao`.

## Falha proposital

Commit: `bde8ebee6f4e45153e907eeb56060bc9f3bde978`.

A migração `0002_teste_ci.sql` continha `CREAT TABLE teste_ci (id INTEGER PRIMARY KEY);`.

- CI no push, reprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818796419
- CI no PR, reprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818809085

Trecho real do log:

```text
Aplicando migrations/0001_estrutura_inicial.sql
Aplicando migrations/0002_teste_ci.sql
Parse error near line 1: near "CREAT": syntax error
  CREAT TABLE teste_ci (id INTEGER PRIMARY KEY);
```

## Correção na mesma ramificação

Commit: `2ece2fbdc2614b528001fbfadaa914d4ecbd4681`.

O comando foi corrigido para `CREATE TABLE teste_ci (id INTEGER PRIMARY KEY);`.

- CI no PR, aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818860101
- CI no push, aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38818854279

Os testes de busca de segredos, migrações SQLite e HTMLHint passaram.

Testar a migração em SQLite permite detectar erros de sintaxe e estrutura antes de aplicar mudanças no banco D1 remoto.

## Limites desta evidência

O PR continua em rascunho e não foi mesclado. A tabela teste_ci pertence somente à demonstração; não é a migração de adição de coluna da Tarefa 4. A recusa de merge por status obrigatório ainda não foi comprovada: a proteção da main depende da habilitação do recurso no repositório.

Os links acima são as evidências de execução exigidas pelo enunciado. Prints ainda pendentes de acesso da Nicoly ao navegador.
