# Revisão por IA e teste de permissão

PR: https://github.com/Nicaribeiro/login-oauth/pull/3

## Consulta vulnerável

Comentário: https://github.com/Nicaribeiro/login-oauth/pull/3#issuecomment-6204026550

Run aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820555223

A IA identificou a interpolação do parâmetro aluno no SQL e recomendou prepare(...).bind(nome).

[Print do primeiro comentário](09-ia-sql-vulneravel.jpg).

## Consulta corrigida

Commit `fba523fa6f5a9b64f40b00f53277115b5afbcc44`: consulta com placeholder `?` e `.bind(nome)`.

Comentário: https://github.com/Nicaribeiro/login-oauth/pull/3#issuecomment-6204057207

Run aprovado: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820781543

A nova revisão confirmou que a consulta usa prepare().bind() e não tem SQL por concatenação. Também apontou a falta de autenticação caso a rota de demonstração seja habilitada. Esse alerta é pertinente; a rota permanece desabilitada por padrão e não deve ser mesclada nem habilitada no ambiente público.

[Print do segundo comentário](10-ia-sql-corrigido.jpg).

## Falha de permissão

Commit `e77ff8209088b8ce8b61f6b88153d861808f4766`: remoção temporária de pull-requests: write somente na ramificação de teste.

Run: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820970380

A inferência terminou com sucesso, mas o step Comenta no PR falhou:

```text
GraphQL: Resource not accessible by integration (addComment)
Process completed with exit code 1.
```

A causa foi a ausência de permissão de escrita no PR para o GITHUB_TOKEN. A permissão foi restaurada no commit `6bd2ccaa973c9c6bafc6279d0f79b31be8658d2f`.

[Print do erro de permissão](11-ia-sem-permissao.jpg).

## Avaliação crítica de uma resposta real

No primeiro comentário, a IA encerrou com opções como “responda se deseja que eu o corrija” e “criar SECURITY-REVIEW.md e fazer commit”. Essas sugestões são irrelevantes para o papel desse workflow: ele gera uma revisão e publica um comentário, sem implementar respostas a esse menu ou executar correções. Um usuário poderia interpretar o texto como uma funcionalidade existente, por isso a resposta precisa ser lida criticamente; esse conteúdo não substitui o CI obrigatório.

## Ajuste necessário em relação ao esqueleto do PDF

A tag v1 disponível executou uma integração antiga e falhou antes da revisão. Foi usada a ação oficial actions/ai-inference fixada no commit `41caef41a74eb26f6d0c6b1e9941d691588e0b2b`, cujo código usa Copilot CLI. O modelo padrão gpt-4.1 não estava disponível, então model recebeu string vazia para usar o modelo disponível da conta. Os runs acima comprovam as revisões reais.
