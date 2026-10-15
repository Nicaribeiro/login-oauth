# Login OAuth

Site com Cloudflare Pages Functions, D1 e autenticação com Google e GitHub.

## Preparação para a avaliação

1. No Cloudflare, identifique o banco já vinculado como `DB` ao projeto Pages. Preencha seu nome e UUID em `wrangler.toml`; não crie outro banco para substituir o existente. Confirme também o nome do projeto Pages no campo `name`.
2. Antes do merge, confira se as colunas das tabelas existentes correspondem a `migrations/0001_estrutura_inicial.sql`. O uso de `IF NOT EXISTS` mantém tabelas existentes, mas não corrige diferenças de esquema.
3. Ao adotar `wrangler.toml` no Pages, mantenha também as configurações públicas e bindings já usados no painel, inclusive `PUBLIC_BASE_URL`, `GOOGLE_CLIENT_ID` e `GITHUB_CLIENT_ID`. Os segredos OAuth continuam nas configurações protegidas do Pages. Não versione segredos.
4. Em Settings > Secrets and variables > Actions, cadastre `COPILOT_PAT` (Copilot Requests, validade de 7 dias), `CLOUDFLARE_API_TOKEN` (D1 Edit no banco correto) e `CLOUDFLARE_ACCOUNT_ID`.
5. Em Settings > Actions > General, permita Actions e a criação de comentários em PRs por GitHub Actions, se a configuração da conta exigir.
6. Em Settings > Rules > Rulesets ou Branches, proteja `main`: exija PR e o check `verificar`, incluindo administradores, sem bypass que invalide a demonstração de push recusado.

## Workflows

- `ci.yml`: todo push e PR para main; segredos, SQLite e HTMLHint.
- `revisao-ia.yml`: PRs internos abertos ou atualizados; revisão com `actions/ai-inference` e comentário no PR.
- `migrar.yml`: push na main com alterações em `migrations/`; aplica migrações remotas e mostra a estrutura de notas.

O enunciado menciona quatro workflows no contexto, mas especifica três arquivos YAML. A Tarefa 2 corresponde à proteção de branch, configurada no GitHub.

## Sequência das evidências

1. Publique a preparação, confirme o CI verde e habilite a proteção da main.
2. Em uma nova ramificação, acrescente uma migração com erro de sintaxe, abra um PR e registre a execução vermelha e o merge bloqueado. Corrija na mesma ramificação e registre a execução verde e o PR liberado.
3. Demonstre a recusa de push direto na main com a regra ativa.
4. Em uma ramificação de teste, altere uma consulta de uma Function para interpolar uma entrada e registre o comentário da IA. Corrija com parâmetros e `bind` na mesma ramificação. Não faça merge da versão vulnerável.
5. Remova temporariamente `pull-requests: write` no workflow dessa ramificação e registre a falha ao comentar. Restaure a permissão e avalie criticamente uma resposta real da IA.
6. Em um PR separado, crie `migrations/0002_adiciona_coluna.sql` com `ALTER TABLE notas ADD COLUMN titulo TEXT;`. Após o CI e a revisão, faça merge e registre o run de migração e o PRAGMA.
7. Faça outro PR sem alterar migrações e confirme que o merge não disparou `migrar`.
8. Complete `AVALIACAO.md` com os links reais e entregue sua versão final por PR.

As alterações de teste devem permanecer nas ramificações até serem corrigidas. Tokens não devem ser colados em código, comentários, logs ou documentação.
