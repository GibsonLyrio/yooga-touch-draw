# Deploy na VPS

O build de produção usa `VITE_BASE_PATH=/yooga-touch-draw/` e é servido por
Nginx no container. Por padrão, o Compose publica somente em
`127.0.0.1:4174`, evitando exposição direta à internet.

## Primeira instalação na VPS

```bash
git clone git@github.com:GibsonLyrio/yooga-touch-draw.git
cd yooga-touch-draw
docker compose up -d --build
curl --fail http://127.0.0.1:4174/healthz
```

Se a porta `4174` já estiver ocupada, defina `YOOGA_TOUCH_DRAW_PORT` no
ambiente do Compose.

## Rota no Caddy

Preservando o prefixo (recomendado):

```caddyfile
handle /yooga-touch-draw* {
    reverse_proxy 127.0.0.1:4174
}
```

O container também funciona com `handle_path`, caso a configuração atual já
remova o prefixo. Valide e recarregue o Caddy somente depois de conferir o
Caddyfile existente:

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
