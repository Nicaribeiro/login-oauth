# Push direto recusado

Execução: https://github.com/Nicaribeiro/login-oauth/actions/runs/38820633564

Workflow temporário na ramificação `teste-push-protegido`. O teste usou o GITHUB_TOKEN com contents: write, fez checkout da main e criou um commit vazio. Assim, a falha não veio da falta de permissão de escrita do token: o servidor recusou o push pelas regras da main. Nenhum arquivo da main foi alterado.

Saída real:

```text
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
remote: - Required status check "verificar" is expected.
! [remote rejected] HEAD -> main (push declined due to repository rule violations)
error: failed to push some refs to 'https://github.com/Nicaribeiro/login-oauth'
Push direto recusado pela regra de proteção da main.
```

[Print da execução](07-push-direto-recusado.jpg).
