# Merge sem alteração de migrations/

PR documental mesclado: https://github.com/Nicaribeiro/login-oauth/pull/5

Commit de merge: `bf9af8e7258f30daf66d4f0f4a93d92bafccb78f`.

O PR alterou somente `evidencias/13-migracao-d1.md`. O workflow migrar está limitado a push na main e paths: ['migrations/**'].

## Execuções observadas para o merge

A consulta à API de Actions com head_sha desse commit retornou duas execuções de CI e nenhuma de migrar (consulta atualizada em 16/10/2026):

| Workflow | Run | Resultado |
| --- | --- | --- |
| ci | https://github.com/Nicaribeiro/login-oauth/actions/runs/38828283145 | success |
| ci | https://github.com/Nicaribeiro/login-oauth/actions/runs/38828366185 | success |

Nenhuma execução de migrar foi criada para esse SHA. No histórico filtrado por branch:main event:push, o commit documental aparece somente com CI; o commit anterior `11fec3a` aparece com CI e migrar.

[Print do histórico de todos os workflows na main](16-merge-sem-migracoes.jpg).

Consulta reproduzível: https://api.github.com/repos/Nicaribeiro/login-oauth/actions/runs?head_sha=bf9af8e7258f30daf66d4f0f4a93d92bafccb78f

Isso comprova que um merge sem alterações em migrations/ não aciona a migração remota.
