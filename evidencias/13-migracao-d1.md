# Migrações D1 após merge

## Preparação

PR #1: https://github.com/Nicaribeiro/login-oauth/pull/1

A migração 0001 foi aplicada no D1 remoto em https://github.com/Nicaribeiro/login-oauth/actions/runs/38828002508 após o merge `7843ce2c09318f26a62550480412f69a423ee517`.

O esquema das tabelas OAuth foi consultado previamente. A migração usa IF NOT EXISTS para preservar as tabelas existentes e cria notas.

## Adição da coluna

PR #4: https://github.com/Nicaribeiro/login-oauth/pull/4

Migração: `migrations/0002_adiciona_coluna.sql`.

```sql
ALTER TABLE notas ADD COLUMN titulo TEXT;
```

Merge: `11fec3a5003f238da19925f97d5f8da4f595477b`.

Execução aprovada: https://github.com/Nicaribeiro/login-oauth/actions/runs/38828061519

O step Aplica migrações no D1 remoto registrou 0002_adiciona_coluna.sql como aplicada. O step Confirma estrutura de notas executou `PRAGMA table_info(notas)` no banco remoto e retornou estas colunas:

| cid | name | type | notnull | dflt_value | pk |
| --- | --- | --- | --- | --- | --- |
| 0 | id | INTEGER | 0 | null | 1 |
| 1 | aluno | TEXT | 1 | null | 0 |
| 2 | conteudo | TEXT | 1 | '' | 0 |
| 3 | created_at | TEXT | 1 | CURRENT_TIMESTAMP | 0 |
| 4 | titulo | TEXT | 0 | null | 0 |

## Teste do filtro paths

Este arquivo documental é alterado sem tocar migrations/. O merge de seu PR será usado para comprovar que migrar não roda quando não existem mudanças em migrations/.
