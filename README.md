# Yooga Touch Draw

Editor visual e responsivo para organizar ambientes de restaurantes e exportar
a composição em PNG. A aplicação roda inteiramente no navegador, sem login,
backend, banco de dados, telemetria ou envio do desenho para serviços externos.

> O nome e os elementos visuais da Yooga são usados neste projeto. Antes de
> redistribuir ou publicar uma versão derivada, confira as permissões aplicáveis
> à marca e aos assets. Consulte também a seção [Licença](#licença).

## Funcionalidades

- cena SVG de 1200 × 800 px, adaptada para desktop e dispositivos móveis;
- cômodos redimensionáveis, nomeáveis e bloqueáveis;
- mesas, cadeiras e itens operacionais (impressora, computador, caixa,
  cozinha, bar, estoque e geladeira);
- seleção, arraste, rotação e redimensionamento por mouse, toque ou teclado;
- duplicação e copiar/colar;
- histórico local de até 100 estados, com desfazer e refazer;
- exportação PNG em 2400 × 1600 px, sem grade nem controles de edição;
- interface e diálogos acessíveis por teclado.

O estado existe somente na memória da aba. Recarregar ou fechar a página apaga
a composição; exporte o PNG antes de sair.

## Requisitos e execução local

- Node.js 22.12 ou posterior;
- npm compatível com o lockfile.

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. O
servidor de desenvolvimento escuta em `0.0.0.0`, portanto outro aparelho na
mesma rede pode acessar `http://<IP-do-computador>:5173/`.

## Comandos

```bash
npm test          # testes automatizados
npm run typecheck # validação TypeScript
npm run build     # tokens, typecheck e build de produção
npm run preview   # serve o conteúdo de dist/ localmente
npm run tokens    # regenera src/styles/tokens.css
```

## Como usar

1. Adicione um cômodo, móvel ou item operacional pela biblioteca.
2. Selecione e arraste o item; use a alça no canto para redimensioná-lo.
3. Ajuste nome, bloqueio, tamanho ou rotação no painel **Propriedades**.
4. Duplique um elemento pelo painel ou com `Ctrl+C`/`Ctrl+V`.
5. Use os botões de histórico, `Ctrl+Z` e `Ctrl+Shift+Z` para desfazer/refazer.
6. Exporte a composição com **Exportar PNG**.

Com um elemento focalizado, Enter ou Espaço seleciona, as setas movem 10 px,
Shift + seta move 1 px e Escape remove a seleção. No macOS, os atalhos também
aceitam Command.

## Estrutura

```text
src/
  components/       interface, canvas, formas, diálogos e propriedades
  editor/           modelo, catálogo, geometria e exportação
  assets/           símbolo e fontes locais
  styles/           tokens CSS gerados
docs/design-system/ especificação e referências do design system
deploy/             configuração Nginx do container
```

O [PRD](PRD.md) registra o escopo original do produto. A documentação do
[design system](docs/design-system/README.md) explica os tokens e decisões de
interface. Os tokens de `docs/design-system/tokens.json` geram
`src/styles/tokens.css`; não edite o arquivo gerado manualmente.

## Build e deploy

`VITE_BASE_PATH` define o prefixo público dos assets no build. O padrão é `/`.
Copie `.env.example` para `.env.local` apenas quando precisar de outra base;
arquivos locais de ambiente não devem ser versionados.

```bash
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/yooga-touch-draw/ npm run build
```

O resultado estático fica em `dist/`. Para Vercel, use o preset Vite, comando
`npm run build` e diretório `dist`. Para a imagem Docker e integração com
Nginx/Caddy, consulte [docs/DEPLOY.md](docs/DEPLOY.md).

Importante: variáveis `VITE_*` são incorporadas ao bundle do navegador e nunca
devem conter segredos.

## Privacidade e segurança

O editor não faz requisições para persistir a cena e não inclui analytics. As
fontes e imagens usadas em runtime são locais. Credenciais de deploy ficam nos
secrets do GitHub Actions, nunca em `.env.example` ou no código.

Para comunicar uma vulnerabilidade sem expô-la publicamente, siga a
[política de segurança](SECURITY.md).

## Limitações

- não há persistência, importação de arquivos, colaboração ou compartilhamento
  por link;
- o histórico é apenas da sessão atual;
- objetos podem se sobrepor e a exportação sempre inclui a cena inteira;
- Firefox, Safari e aparelhos físicos ainda requerem homologação contínua.

## Licença

Este repositório ainda não possui uma licença de software. Torná-lo público não
concede automaticamente permissão para copiar, modificar ou redistribuir o
código. Adicione uma licença compatível com a intenção do projeto antes de
aceitar contribuições ou incentivar reutilização.

A fonte Poppins é distribuída sob a SIL Open Font License; o aviso está em
[`src/assets/fonts/OFL.txt`](src/assets/fonts/OFL.txt).
