# Evidências, inventário e decisões

Coleta: 11/10/2026. Ambiente: Chromium desktop, captura de tela 1920 × 1080 incluindo barras do navegador e do sistema. Medidas estimadas visualmente não equivalem a medições do DOM. Sessão já autenticada; não foi necessário acessar senhas.

## 1. Fontes

| ID | Fonte | O que sustenta |
| --- | --- | --- |
| O1 | [Produtos / PDV](https://app.yooga.com.br/tabs/produtos) | Navegação, busca, catálogo, categorias, resumo e estado vazio |
| O2 | [Ajustes](https://app.yooga.com.br/settings) | Hierarquia de cadastros, cards de navegação, perfil e destaques comerciais |
| O3 | [Categorias](https://app.yooga.com.br/ajustes/categorias) | Cabeçalho com contexto, container centralizado, busca, ação e grade |
| O4 | [Clientes](https://app.yooga.com.br/ajustes/clientes) | Tabela, campos ausentes, navegação por linha e paginação visível |
| O5 | [Histórico](https://app.yooga.com.br/tabs/historico) | Indicadores, abas, alertas e modal automático de aviso de caixa |
| O6 | [Vendas](https://app.yooga.com.br/tabs/vendas) | Cabeçalho de vendas em aberto, busca, ação Nova venda; conteúdo parcialmente coberto pelo aviso |
| C1 | [HTML público](https://app.yooga.com.br/) | Fontes declaradas, idioma, viewport e referência de versão |
| C2 | [CSS público 2026.17.7](https://app.yooga.com.br/version/@2026.17.7/styles.af0b4366508049e417ea.css) | Variáveis `--yoo-*`, tipografia `mnt-*`, containers, modais, tabelas e breakpoints |

Rotas adicionais foram identificadas no bundle público apenas para abrir páginas de consulta na sessão existente. A tentativa inicial `/tabs/ajustes` não revelou uma página de ajustes e não foi usada como evidência do design.

O controle automatizado por clique encontrou uma solicitação de permissão do desktop. Não foi habilitado. A inspeção prosseguiu abrindo URLs no Chromium existente. Nenhum botão de salvar, criar, pagar, fechar caixa ou alterar preferências foi acionado. O aviso automático foi somente visualizado.

Não foram incluídos neste pacote nomes de clientes, documentos, telefones, valores de caixa, cookies, credenciais ou capturas contendo esses dados. As evidências são descrições do design e referências de origem. A prancha usa exemplos sintéticos.

## 2. Inventário visual

| # | Característica coletada | Evidência | Tradução para o design system |
| --- | --- | --- | --- |
| 01 | Marca azul em trilho branco lateral | O1–O6 | Identidade presente, com área própria |
| 02 | Menu lateral estreito com ícone e rótulo | O1–O6 | Variante compacta de navegação |
| 03 | Destino ativo azul com marcador lateral | O1, O5, O6 | Estado ativo com mais de uma pista visual |
| 04 | Indicador de atenção junto ao Histórico | O1, O5 | Badge contextual, com significado textual acessível proposto |
| 05 | Busca proeminente na área superior | O1 | Descoberta rápida em operações repetitivas |
| 06 | Suporte em posição previsível no topo | O1–O5 | Ajuda persistente no shell |
| 07 | Ícones de notificações e atalhos no cabeçalho | O1, O3, O4 | Ações globais separadas das locais |
| 08 | Fundo azulado no PDV | O1 | Superfície operacional opcional |
| 09 | Fundo cinza muito claro em cadastros | O3, O4 | Superfície de aplicação padrão |
| 10 | Painéis brancos contrastando suavemente com o fundo | O1–O5 | Hierarquia por superfície |
| 11 | Catálogo à esquerda e resumo à direita | O1 | Template de operação e contexto |
| 12 | Categorias em círculos com foto e rótulo | O1 | Filtro visual de categorias |
| 13 | Anel azul claro na categoria selecionada | O1 | Seleção com borda; sem depender apenas da foto |
| 14 | Rótulos longos de categorias truncados | O1 | Preservar nome completo acessível; rever truncamento em projetos novos |
| 15 | Contagem junto ao título da coleção | O1, O3, O4 | Quantidade discreta e contextual |
| 16 | Acesso visível a “Mostrar em Tabela” | O1 | Alternância de visualização proposta; clique não testado |
| 17 | Cards de produto com imagem dominante | O1 | Reconhecimento antes de leitura detalhada |
| 18 | Nome e preço em áreas distintas | O1 | Metadados com hierarquia estável |
| 19 | Placeholder para produto sem imagem | O1 | Resiliência a dados incompletos |
| 20 | Pequenos indicadores sobre alguns cards | O1 | Estado local; significado não confirmado |
| 21 | Sombras mais perceptíveis nos produtos | O1 | Elevação para cards interativos |
| 22 | Resumo com título, aviso, associações e ações | O1 | Painel contextual com ordem previsível |
| 23 | Estado vazio explicado por mensagem | O1 | Empty state textual |
| 24 | Ações Cliente e Vendedor com contorno | O1 | Variante secundária |
| 25 | Ferramentas compactas apenas com ícones | O1 | IconButton com nome acessível e dica propostos |
| 26 | Total separado por divisórias | O1 | Ênfase em resultado e revisão |
| 27 | Salvar e Pagar visualmente desabilitados | O1 | Dependências da ação precisam de explicação |
| 28 | Botão de totem em verde claro | O1 | Destaque contextual; não tornar todo CTA verde |
| 29 | Ajustes organizados por grupos de domínio | O2 | Hub de configurações |
| 30 | Perfil com imagem, título e acesso a detalhes | O2 | Identificação contextual |
| 31 | Cards promocionais com ilustrações e cor | O2 | Campanhas fora do núcleo operacional |
| 32 | Selo “Novidade!” em rosa | O2 | Accent de marca para descoberta |
| 33 | Cards de cadastro com ícone grande e nome | O2 | Navegação visual em hub |
| 34 | Conteúdo centralizado em Categorias e Clientes | O3, O4 | Template administrativo, largura limitada |
| 35 | Voltar, breadcrumb e título em conjunto | O3, O4 | Orientação espacial na navegação |
| 36 | Botão de criação no topo direito do container | O3, O4 | Ação primária junto ao objeto gerenciado |
| 37 | Botão azul claro com texto escuro | O3, O4 | Variante primária suave |
| 38 | Busca de largura ampla e ícone à direita | O3, O4 | Busca de coleção distinta da busca global |
| 39 | Filtro em botão quadrado ao lado da busca | O3 | Filtros progressivos |
| 40 | Cards de categorias com borda fina e raio suave | O3 | Card delimitado, pouca elevação |
| 41 | Fotos em área fixa, nomes centralizados | O3 | Grade regular para taxonomias visuais |
| 42 | Cabeçalho de tabela cinza claro | O4 | Separar títulos de dados |
| 43 | Linhas brancas com divisórias horizontais | O4 | Leitura sequencial sem excesso de grade |
| 44 | Chevron no fim da linha | O4 | Indicação visual de detalhamento |
| 45 | Dados ausentes exibidos como traço | O4 | Distinguir ausência, zero e carregamento |
| 46 | Faixa de resultados no rodapé | O4 | Orientação na coleção |
| 47 | Paginação e tamanho de página à direita | O4 | Navegação explícita para dados administrativos |
| 48 | Resumo de caixa em indicadores agrupados | O5 | Template de acompanhamento |
| 49 | Status “Aberto” com ponto e texto | O5 | Status redundante e legível |
| 50 | Abas com seleção marcada por sublinhado | O5 | Navegação local |
| 51 | Alerta de caixa em faixa colorida | O5 | Aviso persistente associado à página |
| 52 | Modal branco central com backdrop cinza | O5, O6 | Interrupção de foco visual |
| 53 | Modal com título, explicação, símbolo e ações | O5, O6 | Anatomia de decisão |
| 54 | Fechar no canto superior direito | O5, O6 | Saída previsível do diálogo |
| 55 | Checkbox de preferência dentro do aviso | O5, O6 | Preferência explícita; não foi alterada |
| 56 | Splash azul com logotipo branco durante abertura | O3 | Identidade no carregamento inicial; evitar repetição desnecessária |

## 3. Fundamentos confirmados no CSS

| Elemento | Valor / seletor de origem | Decisão |
| --- | --- | --- |
| Família | `Poppins, Roboto, Arial, sans-serif`; `--ion-font-family` | Preservar |
| Títulos | `.mnt-title-small` 16/24; medium 20/32; large 24/36; peso 600 | Escala principal |
| Corpo / labels | `.mnt-label-*` 12/16, 14/20, 16/24; pesos 400/500/600 | Separar tamanho de ênfase |
| Azul de marca | `--yoo-primary: #19a1e6` | Identidade |
| Azul suave | `--yoo-primary-300: #83cef6` | Primário suave |
| Azul forte | `--yoo-primary-500: #0a639a`; 600 `#0d547f` | Ação sólida e hover |
| Rosa | `--yoo-secondary: #f45b93`; 200 `#fbcfe1`; 900 `#9e1638` | Descoberta e campanhas |
| Neutros | 100 `#f5f6f6`; 200 `#e5e7e8`; 900 `#4b5053` | Fundo, divisória e corpo |
| Título escuro | `.mnt-title-* { color: #242628 }` | Texto principal |
| Subtítulo | `.mnt-text-color-subtitle: #575e63` | Texto secundário |
| Caption | `.mnt-text-color-caption: #5f676c` | Texto de apoio |
| Raios | `--yoo-borderradiussm/md/lg`: 6/12/20 px | Três níveis, mais círculo/pill |
| Container | `.mnt-content-box-container`: branco, 32 px, raio 12 px | Superfície de conteúdo |
| Container mobile | Mesmo seletor, até 767 px: padding 24 px | Regra existente; 16 px adicional proposto para telas muito estreitas |
| Card delimitado | `.mnt-card-stroke`: borda 1 px, padding 24 px, gap 8 px, raio 12 px | Card de referência |
| Grade | `.mnt-card-grid`: 3 colunas, gap 16 px | Instância existente, não número universal de colunas |
| Grid estrutural | `.mnt-col-*`: 12 colunas; padding lateral 8 px | Grid reutilizável |
| Divisória | `.mnt-divider`: `#e5e7e8`, margem 32 px | Separação de seções |
| Tabela | `.table-default`: raio 6 px; célula 16 × 18 px; texto 14/20 | Base desktop |
| Foco de linha | `.table-row-clickable:focus-visible`: contorno 2 px `#0b7cbe` | Evidência CSS; teclado não testado |
| Painéis laterais | `.modal-lateral`: 768 px; raio 20 px à esquerda; mobile 100% | Padrão confirmado em CSS, não aberto nesta coleta |
| Breakpoints | 576, 768, 992 e 1200 px | Preservar como pontos de partida |
| Spinner | `.yg-spinner`: 48 px, borda 4 px, rotação 0,8 s | Preferir variante com movimento reduzido |

## 4. Inconsistências e decisões de normalização

| Evidência | Risco para reuso | Regra proposta |
| --- | --- | --- |
| `--yoo-primary`, `--yoo-primary-500` e `--ion-color-primary` têm valores diferentes | “Primário” não identifica um único papel | Separar `brand`, `action` e `text.link` |
| `--ion-color-primary` usa `#1ba3e6`, mas o RGB declarado é `56,128,255` | Opacidades e sombras podem divergir | Derivar RGB/alpha do token real |
| Há raio 5, 6, 8, 10, 12, 16 e 20 px em diferentes estilos | Acúmulo de exceções | Núcleo 6/12/20; demais só por necessidade documentada |
| `.yoo-input-style` referencia `--yoo-primary-opacity-05`, mas a variável global encontrada usa `-5` | Referência pode não resolver nesse contexto | Validar todas as referências de tokens |
| Viewport público contém `maximum-scale=1.0` e `user-scalable=no` | Pode restringir zoom, conforme navegador | Novos projetos devem permitir ampliação |
| Inputs legados declaram texto 12 px | Legibilidade limitada em operação mobile | Input padrão 16 px |
| Vários overlays usam z-index muito alto e `!important` | Empilhamento difícil de manter | Escala de camadas com contratos |
| Modal de caixa surge em mais de uma página observada | Pode interromper consulta | Reservar interrupção para decisão necessária; avaliar banner para lembretes |
| Ícones de cards demoraram a aparecer em Ajustes | Aparência depende do carregamento de assets | Reservar espaço e oferecer fallback |
| Texto branco no azul vivo não atinge contraste de texto normal | Identidade confundida com acessibilidade | Branco no azul forte; azul vivo para marca e decoração |

Não se afirma que todos esses pontos são defeitos em todas as telas. Alguns são riscos de declarações distribuídas, sem verificação de estilo computado ou interação.

## 5. Cobertura ainda necessária em uma futura implementação

NV: formulários de criação e edição; hover real; ordem de Tab; foco após fechar modal; leitor de tela; validação de campos; resultados de filtros; estados offline; latência e falhas; mobile real; zoom; preferências; persistência; KDS; totem; checkout e sucesso de operações.

As propostas correspondentes estão nos demais documentos. A existência de uma especificação não significa que o app Yooga atual ou um projeto futuro já as cumpra.
