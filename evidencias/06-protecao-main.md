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

Esses prints antigos foram complementados em 16/10/2026 pelo teste abaixo, com registro direto do botão de merge.

## Push direto recusado

A demonstração foi concluída com um git push real de commit vazio pelo GitHub Actions, recusado por GH013 e pelas regras de PR e check obrigatório. Veja [saída e execução](08-push-direto-recusado.md).

## Complemento: bloqueio e liberação no mesmo PR

PR temporário: https://github.com/Nicaribeiro/login-oauth/pull/9

- Branch: `validacao-entrega-nota10`.
- Commit com erro: `fc3d2eba494b12f6064fe4bddd451e7cb9980734`.
- CI de PR reprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38900400513
- Log: `Parse error near line 1: near "CREAT": syntax error`.
- A API confirmou `mergeable_state: blocked`; o navegador confirmou `Merge pull request` desabilitado.
- [Print do botão bloqueado](18-pr-bloqueado-nota10.jpg).
- Correção na mesma branch: `ee075f13aba4dbb5938a4057e81bdd5c99153dbb`, substituindo CREAT por CREATE.
- CI de PR aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38900539327
- CI de push aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38900535870
- [Print após a correção](19-pr-liberado-nota10.jpg).

O PR é exclusivamente de teste e não deve ser integrado. A migração de demonstração e o workflow de validação isolada não fazem parte da entrega do PR #8.

Na verificação final, a API confirmou `mergeable_state: clean` e o navegador confirmou o botão habilitado (`isEnabled: true`), após registrar o mesmo botão desabilitado antes da correção. O PR #9 foi encerrado sem merge após o teste.
