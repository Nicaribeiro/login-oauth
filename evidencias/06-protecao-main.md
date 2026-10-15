# Tarefa 2 - Proteção da main

Regra `Proteção da main` (ID 25203077): ativa, alvo `refs/heads/main`, PR obrigatório, zero aprovações exigidas e check obrigatório `verificar` da integração GitHub Actions.

PR de demonstração: https://github.com/Nicaribeiro/login-oauth/pull/2

## Antes da correção

Commit `63d6b11645f272dcb254362ca0958ca053314943`: SQL inválido. A API retornou `mergeable_state: blocked`, com `draft: false`. Os checks `verificar` de push e pull_request estavam reprovados e marcados como Required na tela.

- Run reprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820011100
- [Print dos checks obrigatórios reprovados](04-pr-ci-bloqueado.jpg).

## Depois da correção

Commit `21fa3ae9f1f555f3fc46a391b480933e62f6a616`, na mesma ramificação: `CREATE TABLE` corrigido. Os dois checks obrigatórios passaram. A API passou de `blocked` para `unstable`: o CI deixou de bloquear, mas a revisão de IA adicional ainda falha por integração e não é obrigatória na regra.

- Run aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820097514
- [Print dos checks obrigatórios aprovados](05-pr-ci-corrigido.jpg).

O navegador está na conta Beatrys-lira, sem permissão de escrita neste repositório. Por isso os prints comprovam os checks e seu estado Required, mas não mostram um botão de merge operacional para a proprietária. Não foi tentado merge.

## Ainda pendente

A saída real de `git push` direto na main recusado precisa ser registrada com autenticação da proprietária. Uma recusa de API não substitui essa evidência exigida pelo enunciado.
