# Evidências da avaliação

- [Tarefa 1: CI vermelho e verde, commits e log](01-ci-falha-e-correcao.md).
- [Print: SQL inválido](02-ci-sql-invalido.jpg).
- [Print: SQL corrigido](03-ci-sql-corrigido.jpg).
- [Tarefa 2: proteção da main](06-protecao-main.md).
- [Print: checks obrigatórios reprovados](04-pr-ci-bloqueado.jpg).
- [Print: checks obrigatórios aprovados](05-pr-ci-corrigido.jpg).
- [Push direto recusado: log e execução](08-push-direto-recusado.md).
- [Print: push recusado por GH013](07-push-direto-recusado.jpg).
- [Tarefa 3: duas revisões, permissão e crítica à IA](12-revisao-ia.md).
- [Print: revisão do SQL vulnerável](09-ia-sql-vulneravel.jpg).
- [Print: revisão após bind](10-ia-sql-corrigido.jpg).
- [Print: erro sem permissão de comentário](11-ia-sem-permissao.jpg).

## Pendente

A Tarefa 4 depende dos segredos CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID. O diagnóstico em https://github.com/Nicaribeiro/login-oauth/actions/runs/38820945011 confirmou que ambos estavam ausentes; nenhuma alteração remota foi aplicada nessa verificação.

Ainda faltam a migração 0002 por PR, sua confirmação remota por PRAGMA e o merge sem migrations/ sem disparar migrar. A entrega final deve conter os links reais dessas execuções.

O enunciado exige links dos runs; os prints são complementares e mostram telas reais do GitHub.
