# Segurança

## Relatar uma vulnerabilidade

Não publique credenciais, dados pessoais, detalhes de exploração ou outras
informações sensíveis em uma issue.

Use o recurso **Report a vulnerability** na aba **Security** do repositório
para enviar um relato privado. Se esse recurso não estiver habilitado, entre
em contato de forma privada com o mantenedor pelo perfil do GitHub antes de
divulgar o problema.

Inclua, quando possível:

- descrição e impacto;
- passos mínimos para reprodução;
- versão, commit ou ambiente afetado;
- sugestão de correção, se houver.

## Escopo

O projeto é um frontend estático. Ele não possui autenticação, backend, banco
de dados ou telemetria e não envia o desenho a um serviço remoto. Questões em
dependências, workflows, container, configuração de deploy e tratamento local
dos desenhos também podem ser reportadas.

## Cuidados para mantenedores

- Nunca adicione arquivos `.env`, chaves SSH ou credenciais ao repositório.
- Use secrets e environments do GitHub Actions para valores de produção.
- Considere todo valor com prefixo `VITE_` público: o Vite o incorpora no
  JavaScript entregue ao navegador.
- Antes de publicar uma alteração, revise `git diff --cached` e o histórico do
  branch; remover um segredo apenas no commit seguinte não o remove do Git.
- Se um segredo for versionado, revogue-o primeiro e depois reescreva o
  histórico antes de publicar ou continuar usando o repositório.
