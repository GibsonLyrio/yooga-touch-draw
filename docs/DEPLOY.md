# Deploy na VPS

O build de produção usa `VITE_BASE_PATH=/yooga-touch-draw/` e é servido por
Nginx na porta `8000` do container. O Compose não publica portas no host: ele
conecta o serviço `yooga-touch-draw` à rede Docker externa `proxy`, onde o Caddy
já consegue alcançá-lo.

## Primeira instalação na VPS

```bash
git clone git@github.com:<owner>/yooga-touch-draw.git
cd yooga-touch-draw
docker compose up -d --build
docker exec yooga-touch-draw wget -qO- http://127.0.0.1:8000/healthz
```

Antes da primeira subida, a rede externa precisa existir (`docker network
inspect proxy`). Ela já é compartilhada pelos containers do Caddy e dos demais
sites na VPS.

## Rota no Caddy

Na VPS atual, o Caddy remove o prefixo antes de encaminhar ao container:

```caddyfile
redir /yooga-touch-draw /yooga-touch-draw/ 308

handle_path /yooga-touch-draw/* {
    reverse_proxy yooga-touch-draw:8000
}
```

O redirecionamento cobre a URL sem a barra final, que não corresponde ao
matcher `/*`. Valide e recarregue o Caddy somente depois de conferir o Caddyfile
existente:

```bash
caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## GitHub Actions

O workflow `CI` roda testes, typecheck, build e um smoke test da imagem. O
workflow `Deploy VPS` executa após CI bem-sucedida na `main` ou por disparo
manual. O deploy automático começa desabilitado: depois da primeira publicação
manual aprovada, crie a variável de repositório `ENABLE_VPS_DEPLOY=true`.

O workflow requer um environment do GitHub chamado `vps-tests` com estes secrets:

- `VPS_HOST`: IP ou hostname da VPS;
- `VPS_USER`: usuário SSH com acesso ao repositório e ao Docker;
- `VPS_SSH_KEY`: chave privada exclusiva para deploy;
- `VPS_KNOWN_HOSTS`: linha de host verificada (gere com `ssh-keyscan -H <host>`
  e confira a fingerprint antes de cadastrar);
- `VPS_DEPLOY_PATH`: caminho absoluto do clone na VPS.

O primeiro clone e a autorização da deploy key são etapas manuais. Recomenda-se
proteger o environment `vps-tests` com aprovação até o primeiro deploy ter sido
homologado.

## Segurança operacional

- Use uma chave SSH exclusiva para este deploy e limite-a ao acesso necessário.
- Cadastre a chave privada somente como secret; nunca em `.env`, arquivos do
  Compose, logs ou commits.
- Verifique manualmente a fingerprint antes de preencher `VPS_KNOWN_HOSTS`.
- Restrinja o usuário de deploy aos comandos e diretórios necessários.
- Trate qualquer variável `VITE_*` como pública, pois ela é incorporada ao
  bundle servido ao navegador.
- Proteja o environment com aprovação e limite quem pode alterar workflows e
  disparar deploys manuais.
- Em caso de exposição, revogue e substitua a credencial; apagar o arquivo em
  um commit posterior não elimina o valor do histórico Git.
