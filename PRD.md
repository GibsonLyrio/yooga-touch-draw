# PRD — Yooga Touch Draw

**Versão:** 0.3 (MVP — stack definida)  
**Status:** Escopo funcional inicial definido; pronto para implementação  
**Produto:** Yooga Touch Draw  
**Tipo:** Aplicação web de desenho e composição visual  
**Ambiente de demonstração:** `https://tests.gibsonlyrio.dev/yooga-touch-draw/`

## 1. Visão geral

Yooga Touch Draw é uma aplicação web leve, inspirada na simplicidade do Excalidraw, para criar representações visuais de ambientes de restaurantes. O usuário posiciona e organiza ícones ou formas simples em uma área de desenho e exporta o resultado como imagem.

O objetivo do MVP é **demonstrar a experiência de composição visual**, não construir um software CAD, um editor arquitetônico ou uma solução integrada ao produto Yooga.

A aplicação deve funcionar inteiramente no navegador, sem autenticação, banco de dados ou API própria. A aplicação será desenvolvida com **TypeScript, React e Vite**, gerando um frontend estático que poderá ser hospedado tanto na VPS atual quanto, futuramente, na Vercel.

## 2. Problema e oportunidade

Representar rapidamente a disposição de mesas e outros elementos de um restaurante deve ser uma tarefa simples e visual. Ferramentas de desenho genéricas podem exigir esforço desnecessário, enquanto soluções CAD são complexas demais para essa finalidade.

O MVP pretende validar se um editor focado em posicionar elementos predefinidos oferece uma experiência intuitiva para criar e compartilhar layouts ilustrativos.

## 3. Objetivos

1. Permitir a criação de um desenho simples por meio de ícones e formas predefinidas.
2. Tornar fácil selecionar, posicionar, mover e remover elementos.
3. Permitir exportar o resultado como PNG, sem depender de servidor.
4. Oferecer uma interface responsiva, utilizável em desktop e dispositivos com tela sensível ao toque.
5. Manter código e infraestrutura simples, portáveis e adequados a uma futura hospedagem na Vercel.
6. Produzir uma demonstração funcional com o mínimo de configuração operacional.

### 3.1 Não objetivos do MVP

- CAD, plantas técnicas, medidas reais, escala arquitetônica ou precisão dimensional.
- Modelagem 3D, simulação física ou cálculo de capacidade.
- Autenticação, contas, permissões, organizações ou colaboração em tempo real.
- Persistência em banco de dados ou sincronização na nuvem.
- Integração com APIs, PDV, comandas ou outros módulos da Yooga.
- Histórico de versões, compartilhamento por link ou publicação de projetos editáveis.
- Backend próprio, filas, serviços persistentes ou infraestrutura complexa.

## 4. Público e cenário de uso

**Público inicial:** pessoas que precisam representar visualmente, de forma rápida, a organização de um ambiente de restaurante, além dos avaliadores internos da apresentação do MVP.

**Fluxo principal:**

1. Acessar a página do editor.
2. Visualizar uma área de desenho inicialmente vazia.
3. Clicar ou tocar em um elemento da barra de ferramentas para adicioná-lo ao centro da área de desenho.
4. Arrastar o elemento inserido para a posição desejada.
5. Ajustar o desenho movendo ou removendo elementos.
6. Exportar a composição final como PNG.

Não deve ser necessário criar conta, preencher cadastro ou configurar um projeto antes de começar.

## 5. Escopo funcional do MVP

### RF-01 — Área de desenho

- Exibir uma área visual de trabalho claramente delimitada.
- Usar um sistema de coordenadas lógico independente da resolução da tela.
- Permitir a composição de múltiplos elementos na mesma cena.
- Apresentar fundo neutro; grade visual discreta é opcional e não deve ser exportada por padrão.

**Critério de aceite:** o usuário consegue abrir a aplicação e começar a compor uma cena imediatamente.

### RF-02 — Biblioteca inicial de elementos

- Disponibilizar uma pequena biblioteca de elementos simples e reconhecíveis.
- **Conjunto inicial obrigatório:** mesa redonda, mesa retangular, cadeira e parede/divisória simples.
- Representar os elementos com formas vetoriais ou ícones locais, sem depender de imagens externas durante o uso.
- A biblioteca deve ser fácil de expandir sem reescrever o editor.

**Critério de aceite:** o usuário consegue adicionar mesas redondas, mesas retangulares, cadeiras e paredes à área de desenho, inclusive múltiplas instâncias de cada tipo.

### RF-03 — Inserção e manipulação de elementos

- Clicar ou tocar no ícone da barra de ferramentas para criar uma instância no centro da área de desenho (ou em uma posição livre próxima, se o centro estiver ocupado).
- O elemento recém-criado deve ficar selecionado e pronto para ser arrastado; não exigir drag-and-drop a partir da barra de ferramentas.
- Selecionar um elemento com clique ou toque.
- Arrastar o elemento para reposicioná-lo.
- Remover o elemento selecionado por um controle visível.
- Permitir adicionar várias instâncias do mesmo tipo.
- Exibir feedback visual de seleção.

**Critério de aceite:** o usuário consegue criar, reposicionar e remover múltiplos elementos sem recarregar a página.

### RF-04 — Ajustes básicos

- Permitir rotação de elementos selecionados por um controle simples, quando fizer sentido para o tipo.
- Permitir redimensionamento básico de elementos, preservando uma experiência simples.
- Manter elementos dentro de limites razoáveis para evitar tamanhos inválidos.

**Critério de aceite:** o usuário consegue mudar orientação e tamanho de pelo menos uma mesa retangular.

### RF-05 — Exportação PNG

- Disponibilizar botão **Exportar PNG**.
- Gerar o arquivo inteiramente no navegador.
- Exportar somente o conteúdo do desenho, sem barras de ferramentas, alças de seleção ou outros controles da interface.
- Produzir imagem com dimensões e resolução suficientes para uma apresentação comum.
- Iniciar o download com nome de arquivo previsível, por exemplo `yooga-touch-draw.png`.

**Critério de aceite:** a imagem baixada corresponde à composição visual exibida, sem controles do editor.

### RF-06 — Interface responsiva e toque

- Disponibilizar layout funcional em desktop, tablet e celular.
- Suportar seleção e movimentação de elementos por toque.
- Evitar depender exclusivamente de hover, teclado ou clique com botão direito.
- Oferecer alvos de interação adequados a telas sensíveis ao toque.

**Critério de aceite:** é possível adicionar, mover e exportar elementos em um navegador móvel atual.

### RF-07 — Limpeza da cena

- Disponibilizar ação para limpar todos os elementos.
- Solicitar confirmação antes de apagar uma cena com conteúdo.

**Critério de aceite:** o usuário consegue começar uma composição nova sem recarregar a página e sem exclusão acidental por um único toque.

## 6. Funcionalidades opcionais / pós-MVP

Estas funcionalidades **não devem bloquear a entrega inicial**:

- Exportação SVG (fora do MVP, mesmo que a renderização interna use SVG).
- Desfazer/refazer (undo/redo).
- Duplicação de elementos.
- Zoom e deslocamento (pan) da área de desenho.
- Atalhos de teclado para desktop.
- Rótulos ou numeração de mesas.
- Mais tipos de ícones, cores e personalização visual.
- Salvar/carregar um arquivo JSON local para retomar a edição.
- Persistência local temporária (`localStorage`) como conveniência, sem substituir exportação.
- Integração com sistemas internos, caso a proposta seja aprovada.

## 7. Requisitos não funcionais

### RNF-01 — Simplicidade

A aplicação deve ter poucos controles, baixa curva de aprendizado e interface centrada na área de desenho. Evitar menus, painéis e opções desnecessários.

### RNF-02 — Desempenho

As interações de seleção e arraste devem parecer fluidas em dispositivos comuns. Não é necessário otimizar para cenas com milhares de objetos; o foco são layouts pequenos.

### RNF-03 — Portabilidade

O frontend deve produzir arquivos estáticos que possam ser servidos por Nginx/Caddy na VPS e publicados na Vercel sem reescrever a aplicação.

### RNF-04 — Privacidade e operação

O desenho permanece no navegador durante a sessão. Não enviar o conteúdo a serviços externos. Sem telemetria obrigatória, login ou armazenamento remoto.

### RNF-05 — Acessibilidade básica

Botões com rótulos compreensíveis, estados visuais claros, contraste adequado e ações principais acessíveis por mouse e toque. Quando viável, oferecer suporte de teclado às ações básicas.

### RNF-06 — Compatibilidade

Suportar versões atuais de Chromium, Firefox e Safari, incluindo navegadores móveis modernos.

## 8. Proposta técnica

### 8.1 Stack

| Componente | Escolha proposta | Justificativa |
|---|---|---|
| Linguagem | **TypeScript** | Tipagem estática e facilidade de manutenção |
| Framework de interface | **React** | Componentização da interface e gerenciamento declarativo de estado |
| Build / desenvolvimento | **Vite** | Servidor de desenvolvimento rápido e geração de arquivos estáticos para deploy |
| Interface | React (TSX) + CSS | Componentes reutilizáveis e interface responsiva sem dependência de backend |
| Renderização | SVG nativo ou biblioteca 2D leve | Manipulação visual e exportação no navegador |
| Testes | Vitest para lógica isolada | Verificações rápidas sem infraestrutura adicional |
| Backend | Nenhum no MVP | Não há necessidade de processamento no servidor |
| Banco de dados | Nenhum | Não há persistência remota |
| Deploy atual | Arquivos estáticos via Docker/Nginx e Caddy | Reutiliza a infraestrutura existente |
| Deploy futuro | Vercel | Compatível com build estático |

**Decisão técnica:** utilizar **Vite + React + TypeScript** como stack obrigatória. Começar com SVG nativo renderizado por componentes React (TSX), estado da cena com hooks (`useState`/`useReducer`) e rasterização para PNG via Canvas no navegador. Se a interação exigir, avaliar uma biblioteca 2D leve; não adicionar Next.js, backend ou banco de dados ao MVP.

### 8.2 Estrutura inicial sugerida

```text
yooga-touch-draw/
├── public/
├── src/
│   ├── components/
│   │   ├── Toolbar.tsx
│   │   └── DrawingCanvas.tsx
│   ├── editor/
│   │   ├── elements.ts
│   │   ├── interactions.ts
│   │   └── export.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

A estrutura é orientativa: usar componentes React onde fizer sentido, mantendo a lógica geométrica e de exportação em funções TypeScript testáveis. Não criar módulos vazios ou abstrações prematuras.

### 8.3 Modelo de dados em memória

Cada elemento pode ser representado por um objeto TypeScript simples:

```ts
type ElementType = 'round-table' | 'rect-table' | 'chair' | 'wall';

interface DrawingElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
```

A cena consiste em uma lista desses elementos. O estado fica em memória no React (por exemplo, `useState` ou `useReducer`) e não precisa ser serializado no MVP.

### 8.4 Deploy em subcaminho

**URL de demonstração:** `https://tests.gibsonlyrio.dev/yooga-touch-draw/`

- Configurar o `base` do Vite como `/yooga-touch-draw/` para o deploy na VPS.
- Servir o build estático em uma rota compatível com o prefixo, sem quebrar os caminhos de assets.
- Na Vercel, permitir configurar `base: '/'` por variável de ambiente ou configuração de build.
- Não codificar URLs absolutas do domínio de testes dentro da lógica do editor.
- O proxy Caddy deve manter os demais projetos e o domínio principal inalterados.

## 9. Experiência e interface

**Layout sugerido:**

- Cabeçalho compacto com nome do produto, ação de limpar e botão de exportação.
- Barra de ferramentas com botões para adicionar mesa redonda, mesa retangular, cadeira e parede, apresentada lateralmente no desktop e em posição acessível no celular.
- Área de desenho como elemento visual dominante.
- Controles contextuais simples para o elemento selecionado (rotação, tamanho e remoção).

**Princípios de UX:**

1. Abrir e desenhar imediatamente.
2. Preferir ações visíveis a atalhos ocultos.
3. Minimizar configurações.
4. Usar ícones compreensíveis acompanhados de rótulos quando necessário.
5. Manter o fluxo de exportação em um único clique/toque.

## 10. Critérios de sucesso da demonstração

O MVP estará pronto para apresentação quando:

- [ ] Abrir no endereço de testes com HTTPS.
- [ ] Exibir a área de desenho sem exigir login.
- [ ] Permitir inserir mesas redondas, mesas retangulares, cadeiras e paredes clicando ou tocando nos respectivos botões.
- [ ] Permitir selecionar, arrastar e remover elementos.
- [ ] Permitir pelo menos rotação e ajuste básico de tamanho.
- [ ] Funcionar com mouse e toque.
- [ ] Exportar um PNG fiel ao desenho, sem controles da interface.
- [ ] Funcionar após recarregar a página, mesmo que o desenho anterior seja perdido.
- [ ] Gerar um build estático com comando documentado.
- [ ] Não depender de backend ou banco de dados.

## 11. Plano de implementação

### Etapa 1 — Fundamentos

- Inicializar projeto Vite com template React + TypeScript (`react-ts`).
- Definir componentes visuais e modelo de estado em memória.
- Criar área de desenho e barra de elementos.

### Etapa 2 — Edição

- Implementar inserção por clique/toque no botão (com criação no centro), seleção, arraste e remoção.
- Implementar rotação e redimensionamento básicos.
- Ajustar interações para telas sensíveis ao toque.

### Etapa 3 — Exportação e acabamento

- Implementar exportação PNG.
- Validar fidelidade da imagem exportada.
- Ajustar responsividade, estados visuais e mensagens de confirmação.

### Etapa 4 — Homologação do MVP

- Executar build de produção e testes essenciais.
- Configurar deploy estático em `/yooga-touch-draw/` na VPS.
- Testar o acesso em desktop e celular.
- Preparar uma demonstração curta com composição e exportação.

## 12. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Complexidade de interação em dispositivos móveis | Validar arraste por toque logo no início |
| PNG diferente do desenho exibido | Testar exportação com vários elementos e rotações |
| Assets quebrados no subcaminho da VPS | Configurar `base` e testar o build em `/yooga-touch-draw/` |
| Crescimento excessivo do escopo | Manter funcionalidades opcionais fora dos critérios de aceite |
| Perda do desenho ao recarregar | Informar que não há salvamento no MVP; oferecer exportação |
| Dependência desnecessária de servidor | Manter processamento e exportação exclusivamente no cliente |

## 13. Questões em aberto

Estas decisões podem ser tomadas antes ou durante a primeira implementação, sem bloquear a estrutura inicial:

1. **Identidade visual:** usar um visual neutro ou seguir a identidade da Yooga? Verificar autorização de uso de marca se o projeto for apresentado externamente.
2. **Dimensões do desenho:** adotar uma área lógica fixa (recomendação para MVP: 1200 × 800) ou oferecer dimensões ajustáveis? A implementação pode começar com 1200 × 800.
3. **Rotação/redimensionamento:** definir controles mínimos de fácil uso no celular; não exigir precisão de CAD.

**Decisões já tomadas:** biblioteca inicial de mesas (redonda e retangular), cadeiras e paredes; inserção por clique/toque seguida de arraste; exportação somente PNG.

## 14. Próximo passo de implementação — primeira fatia vertical

**Meta:** ter um editor executável localmente que permita adicionar os quatro tipos de elemento, selecioná-los, arrastá-los e exportar PNG. Evitar infraestrutura antes dessa validação.

1. Inicializar Vite com o template **React + TypeScript**, sem backend ou banco.
2. Criar um componente React de cena SVG com `viewBox="0 0 1200 800"`, responsivo e com fundo branco explícito para exportação.
3. Definir `DrawingElement` e manter o estado em memória no React, usando `crypto.randomUUID()` para IDs.
4. Criar botões de inserção para mesa redonda, mesa retangular, cadeira e parede. Cada clique adiciona um objeto em posição inicial visível e o seleciona.
5. Implementar seleção e arraste com Pointer Events (`pointerdown`, `pointermove`, `pointerup`), captura de ponteiro e conversão correta de coordenadas do viewport para o `viewBox` SVG.
6. Implementar remoção e seleção visível. Depois, rotação e redimensionamento simples.
7. Exportar PNG inteiramente no navegador: clonar/serializar o SVG sem controles de seleção, rasterizar em Canvas com fundo branco e baixar via `toBlob()`.
8. Validar mouse e toque, build de produção e execução em subcaminho antes do deploy.

**Comandos sugeridos para inicialização local:**

```bash
mkdir -p ~/projects/yooga-touch-draw
cd ~/projects/yooga-touch-draw
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

Se a pasta já tiver arquivos, conferir o conteúdo antes de executar o scaffold; não sobrescrever arquivos existentes. Para a VPS, usar `base: '/yooga-touch-draw/'` no Vite e um Nginx estático na rede Docker `proxy`, com a rota correspondente no Caddy. Não mexer no domínio principal.

## 15. Definição de pronto

A entrega é considerada concluída quando um avaliador consegue acessar a URL de demonstração, montar um layout simples de restaurante com elementos predefinidos, ajustar sua disposição e baixar um PNG do resultado, sem login, sem instruções técnicas e sem depender de serviços de backend.
