# Verificação dos artefatos

Data: 11/10/2026. Verificação da documentação; não é homologação do aplicativo.

- 212 tokens válidos no formato próprio, com origem C/P identificada.
- Referências resolvidas, sem ciclos, destinos ausentes ou divergência de tipo entre aliases.
- 16 referências locais Markdown verificadas.
- SVG validado como XML; prancha renderizada em Chromium isolado e revisada visualmente.
- 24 arquivos existentes de código, configuração, documentação prévia e build comparados por SHA-256 e preservados.
- Nenhuma dependência foi instalada no projeto; nenhum token foi importado pelo aplicativo.
- Testes e build do aplicativo não foram executados: não houve alteração de implementação.

## Contraste de pares semânticos

Valores opacos em sRGB; cálculo de luminância relativa. Os pares abaixo superam 4,5:1 para texto normal. Transparência, imagens e composição real precisam de nova verificação.

| Papel | Texto | Fundo | Contraste aproximado |
| --- | --- | --- | --- |
| Sólido | `#FFFFFF` | `#0A639A` | 6.43:1 |
| Suave | `#0D547F` | `#83CEF6` | 4.68:1 |
| Destrutivo | `#FFFFFF` | `#BF4848` | 4.96:1 |
| Texto principal | `#242628` | `#FFFFFF` | 15.19:1 |
| Texto corpo | `#4B5053` | `#FFFFFF` | 8.17:1 |
| Texto apoio | `#5F676C` | `#F5F6F6` | 5.32:1 |
| Status info | `#0D547F` | `#E1F1FD` | 7.02:1 |
| Status success | `#145334` | `#BBF7D6` | 7.51:1 |
| Status warning | `#9D670B` | `#FDFBC4` | 4.52:1 |
| Status error | `#8D3030` | `#FFD9D9` | 6.23:1 |
| Status novelty | `#9E1638` | `#FBCFE1` | 5.76:1 |
| Status neutral | `#4B5053` | `#F5F6F6` | 7.54:1 |

Branco sobre o azul de marca `#19A1E6` resulta em aproximadamente 2,88:1; por isso não foi adotado como par de texto normal. Bordas sutis são decorativas; limites funcionais usam token próprio. Acessibilidade completa continua dependendo de semântica, navegação e testes na implementação.

## Limites

A inspeção autenticada foi visual e de leitura. Não foram testados cliques internos de negócio, envio de formulários, teclado, leitor de tela, mobile real ou desempenho. As prescrições dessas áreas são propostas. Nenhum resultado de interação não executada foi apresentado como aprovado.
