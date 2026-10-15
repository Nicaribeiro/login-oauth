# Evidências da avaliação

## Testes executados

| Teste | Resultado | Execução |
| --- | --- | --- |
| CI do PR: segredos, migrações SQLite e HTMLHint | Aprovado | https://github.com/Nicaribeiro/login-oauth/actions/runs/38817667940 |
| CI após configuração do banco D1 | Aprovado | https://github.com/Nicaribeiro/login-oauth/actions/runs/38818041876 |
| Revisão IA antes do cadastro do token | Falha na verificação de configuração | https://github.com/Nicaribeiro/login-oauth/actions/runs/38817668038 |
| Revisão IA após cadastro do token, tentativa 2 | Segredo presente; falha na ação de inferência | https://github.com/Nicaribeiro/login-oauth/actions/runs/38818041918/attempts/2 |

Trecho relevante do log da inferência: `API error: TypeError: Cannot use 'in' operator to search for 'choices' in OK`.

As falhas da revisão acima são de configuração/integração. Não substituem a falha SQL proposital da Tarefa 1 nem a falha por remoção de permissão da Tarefa 3.

## Capturas realizadas

- [CI reprovado com erro SQL](02-ci-sql-invalido.jpg).
- [CI aprovado após correção](03-ci-sql-corrigido.jpg).
- [Links, commits e trecho do log](01-ci-falha-e-correcao.md).

## Capturas ainda necessárias

- PR bloqueado pela proteção da main.
- Mesmo PR liberado após correção.
- Terminal com push direto recusado.
- Dois comentários reais da IA: consulta vulnerável e consulta corrigida.
- Log da falha ao comentar sem pull-requests: write.
- Migração remota concluída e PRAGMA com a coluna titulo.
- Merge sem mudança em migrations/ sem disparo de migrar.

Os dois primeiros prints foram capturados das telas reais do GitHub Actions. As demais capturas estão pendentes. O enunciado exige os links dos runs; capturas são complementares.

## Verificações locais

- Arquivos YAML e TOML analisados sem erro de sintaxe.
- Migração inicial aplicada em SQLite em memória.
- Reaplicação da migração preservou uma sessão de teste.
- SQL inválido produziu erro de sintaxe local; não é evidência de run vermelho.
- Adição futura da coluna titulo validada localmente; ainda não aplicada no D1 remoto.
- HTMLHint: 1 arquivo analisado, sem erros.
