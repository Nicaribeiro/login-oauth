# Resumo de migrações por IA

## Implementação

O workflow `migrar.yml` mantém o gatilho de push na main com filtro `migrations/**`, as permissões e o controle de concorrência. A aplicação remota usa pipefail e tee para capturar o log sem esconder erros do Wrangler. Após a confirmação do esquema, a ação oficial actions/ai-inference resume o log e o resultado é escrito em `$GITHUB_STEP_SUMMARY`.

O resumo é informativo: a aplicação e o PRAGMA continuam sendo a evidência determinística da migração. Usa-se COPILOT_PAT via secrets; valores de segredos não são incluídos no prompt.

## Teste executado sem alterar produção

- Execução: https://github.com/Nicaribeiro/login-oauth/actions/runs/38900393218
- Repetição após corrigir o SQL do PR de teste: https://github.com/Nicaribeiro/login-oauth/actions/runs/38900535851
- Banco: SQLite local isolado, com as migrações reais do repositório.
- A inferência terminou com sucesso e o resumo apareceu na página da execução.
- A resposta confirmou as migrações 0001 e 0002 e explicitou que não houve acesso ao D1 remoto.
- [Print do resumo publicado](20-resumo-ia-sqlite.jpg).

## Limite da validação

A migração D1 real já tem evidência em https://github.com/Nicaribeiro/login-oauth/actions/runs/38828061519. O novo step de resumo foi validado em SQLite isolado; ele ainda não foi executado dentro de uma nova migração remota após merge. Portanto, esta evidência não deve ser apresentada como bônus remoto integralmente concluído. O PR #8 deve ser aprovado e integrado antes de o novo step estar disponível na main. Não se deve criar migração fictícia em produção somente para obter pontos.
