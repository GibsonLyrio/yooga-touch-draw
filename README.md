# Yooga Touch Draw

Editor visual de ambientes de restaurantes, inteiramente no navegador. Implementado com Vite, React, TypeScript estrito, SVG e CSS. O [PRD.md](./PRD.md) é a referência de produto.

## Executar

Requer Node.js 22.12+ e npm (ou uma versão posterior compatível com o Vite 7).

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

Para acessar por outro aparelho na mesma rede, abra `http://<IP-do-computador>:5173/`. O servidor de desenvolvimento já escuta em `0.0.0.0`; a geração de IDs funciona também em HTTP, usando `crypto.getRandomValues()` quando `crypto.randomUUID()` não está disponível.

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

O build gera `dist/`. O preview normalmente usa `http://localhost:4173`.

## Uso

1. Clique ou toque em um dos quatro elementos da biblioteca para inseri-lo.
2. Arraste o elemento para posicionar. Clique no fundo para desfazer a seleção.
3. Use o painel **Propriedades**, à direita no desktop e abaixo em telas menores, para girar em passos de 45°, ajustar tamanho entre 50% e 200% ou excluir. Mesas redondas não precisam de rotação.
4. **Limpar desenho** remove todos os elementos após confirmação.
5. **Exportar PNG** baixa `yooga-touch-draw.png`, com 2400 × 1600 pixels, fundo branco e sem grade ou seleção.

Os botões funcionam por teclado; os objetos podem ser selecionados com Tab e Enter/Espaço. As setas movem o objeto focalizado em 10 pixels; Shift + seta move em 1 pixel; Escape desfaz a seleção. O arraste usa Pointer Events com captura de ponteiro, tanto para mouse quanto para toque. **Como usar** abre as instruções do editor.

## Design system Yooga

A interface aplica o [design system documentado](docs/design-system/README.md): Poppins local, paleta semântica Yooga, biblioteca em cards, canvas e painel contextual, estados de feedback e diálogos acessíveis. O layout usa três áreas no desktop e se reorganiza em tablet e celular, sem criar destinos de navegação fictícios.

Os tokens de `docs/design-system/tokens.json` geram `src/styles/tokens.css` com `npm run tokens`. O build executa essa geração automaticamente; alterações de tokens durante desenvolvimento exigem executar o comando novamente. Tipografia em rem permite ampliação do texto. As fontes, a licença OFL e o símbolo oficial estão em `src/assets`, sem requisições externas durante o uso.

A adoção não acrescenta backend, persistência, zoom ou histórico de alterações. As geometrias e cores dos objetos exportados permanecem preservadas. Veja [escopo e validação da implementação](docs/design-system/IMPLEMENTATION.md).

## Estrutura

```text
src/
  components/
    DrawingCanvas.tsx       # SVG, seleção e Pointer Events
    ElementShape.tsx        # Formas compartilhadas pela biblioteca e cena
    SelectionControls.tsx   # Rotação, tamanho e exclusão
    Toolbar.tsx             # Inserção dos quatro tipos
  editor/
    types.ts                # Modelo de dados
    elements.ts             # Catálogo, dimensões e criação
    interactions.ts         # Coordenadas, limites, rotação e tamanho
    interactions.test.ts    # Testes de inserção e geometria
    export.ts               # Serialização SVG e rasterização PNG
  App.tsx                   # Estado da sessão e composição da interface
  main.tsx
  index.css
```

O estado é local ao React. A cena lógica mede 1200 × 800, independentemente da tela. A conversão de ponteiro usa a inversa de `getScreenCTM()`. As formas têm cores e contornos no próprio SVG, para preservar a aparência na exportação. A manipulação de DOM fica restrita às APIs de geometria/captura e à exportação de uma cópia da cena.

## Build estático e caminho base

`VITE_BASE_PATH` define o prefixo dos assets no momento do build. O padrão é `/`. Também é possível criar `.env.local` a partir de `.env.example`. Refaça o build ao mudar o prefixo.

**Vercel, na raiz:** preset Vite, comando `npm run build`, diretório de saída `dist`, variável `VITE_BASE_PATH=/`. Não há rotas de cliente nem necessidade de rewrites.

```bash
VITE_BASE_PATH=/ npm run build
```

**VPS, sob `/yooga-touch-draw/`:**

```bash
VITE_BASE_PATH=/yooga-touch-draw/ npm run build
VITE_BASE_PATH=/yooga-touch-draw/ npm run preview
```

Abra `http://localhost:4173/yooga-touch-draw/` para conferir. Para publicar posteriormente, sirva o conteúdo de `dist/` nesse prefixo. Exemplo de bloco Nginx a incorporar ao servidor existente (não aplicado por este projeto):

```nginx
# Conteúdo de dist/ em /var/www/yooga-touch-draw/
location = /yooga-touch-draw {
    return 301 /yooga-touch-draw/;
}
location /yooga-touch-draw/ {
    root /var/www;
    index index.html;
    try_files $uri $uri/ =404;
}
```

O repositório inclui uma imagem Nginx, `compose.yaml` e workflows de CI/CD. As instruções para integrar o container ao Caddy sem alterar as demais rotas estão em [docs/DEPLOY.md](docs/DEPLOY.md). Nenhum Docker, proxy ou serviço é necessário para desenvolver e validar o editor localmente.

## Limitações e validação manual

- Não há persistência: recarregar ou fechar a página perde o desenho. Exporte antes de sair.
- Sem desfazer/refazer, zoom, pan, rótulos ou medidas reais nesta etapa.
- O ajuste de tamanho é proporcional. Objetos podem se sobrepor; os mais recentes ficam acima dos anteriores.
- A cena inteira é exportada; não há recorte automático nem salvamento editável.
- Em telas pequenas, a cena é reduzida para caber na largura. Layouts densos exigem maior cuidado ao selecionar objetos.
- A publicação HTTPS e a homologação em aparelhos físicos dependem da etapa de deploy, ainda não executada.

Checklist manual: inserir múltiplas instâncias dos quatro tipos; selecionar e arrastar com mouse/toque até as bordas; girar e redimensionar uma mesa retangular; excluir; cancelar e confirmar a limpeza; exportar e verificar dimensões, fundo branco e ausência de controles; recarregar e verificar cena vazia. Repetir em Chromium, Firefox e Safari, desktop e celular, incluindo o build no subcaminho.

## Verificações da primeira entrega

- TypeScript estrito e builds para `/` e `/yooga-touch-draw/`: aprovados.
- Vitest: 18 testes aprovados de inserção, independência de instâncias, movimentação, limites, rotação e tamanho.
- Auditoria npm após atualização do Vitest: zero vulnerabilidades reportadas.
- Chromium com Playwright temporário, fora das dependências do projeto: fluxo de edição, confirmação/cancelamento de limpeza, seleção por teclado, recarga sem persistência e download nos dois builds aprovados.
- Toque emulado: inserção, arraste, exportação e alvo mínimo de seleção de 44 pixels aprovados. Sem rolagem horizontal em larguras de 320, 390, 640 e 768 pixels.
- PNG baixado validado em 2400 × 1600, com fundo branco, cores dos quatro elementos e sem pixels da grade ou seleção.
- Firefox, Safari, aparelhos físicos e publicação HTTPS ainda precisam de homologação.
