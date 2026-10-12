# Implementação no Yooga Touch Draw

Data: 11/10/2026. Status: implementado e validado localmente. Esta adoção aplica o núcleo do design system ao editor atual, preservando o escopo funcional do MVP.

## O que foi aplicado

- Poppins 400, 500 e 600 servida localmente, com licença OFL incluída.
- Marca Yooga, paleta semântica, escala de espaço, raios, sombras, tipografia, foco e movimento.
- Tokens gerados de `tokens.json` para `src/styles/tokens.css` por `scripts/generate-design-tokens.mjs`.
- Composição de editor em três áreas: biblioteca, desenho e propriedades.
- Cards de elementos, painel de propriedades, feedback de ações, ajuda contextual e confirmação de limpeza.
- Layout responsivo: três áreas no desktop, biblioteca horizontal no tablet e fluxo em coluna no celular.
- Estados vazio, selecionado, desabilitado, carregando, sucesso e erro.
- Foco contido e restaurado nos diálogos; foco inicial seguro na confirmação destrutiva.
- Alternativa de teclado ao arraste: setas movem 10 px, Shift + seta move 1 px e Escape desfaz a seleção.
- Fonte, símbolo e ícones locais; a aplicação continua funcionando sem carregar assets externos.

## Comportamento preservado

- Inserção de mesas, cadeiras e paredes.
- Seleção e arraste com mouse ou toque.
- Rotação de 45° e escala entre 50% e 200%.
- Exclusão e limpeza com confirmação.
- Estado somente na sessão, sem backend ou persistência.
- Exportação PNG em 2400 × 1600 px, com fundo branco e sem grade, foco ou controles.
- Funcionamento na raiz e no subcaminho `/yooga-touch-draw/`.

Não foram adicionados zoom, pan, desfazer/refazer, autenticação, banco de dados ou integrações. A implementação visual não altera as regras de negócio do MVP.

## Validação executada

| Verificação                                            | Resultado                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| TypeScript estrito e build Vite                        | Aprovado                                                         |
| Vitest                                                 | 19 testes aprovados                                              |
| Inserção dos quatro tipos                              | Aprovado                                                         |
| Arraste, seleção, rotação e escala                     | Aprovado                                                         |
| Movimento e seleção por teclado                        | Aprovado                                                         |
| Exclusão, confirmação e cancelamento da limpeza        | Aprovado                                                         |
| Foco inicial, contenção e retorno nos diálogos         | Aprovado                                                         |
| Ajuda contextual e fechamento com Escape               | Aprovado                                                         |
| Toque emulado e alvo mínimo de 44 px                   | Aprovado                                                         |
| Exportação desktop e mobile                            | Aprovado                                                         |
| PNG 2400 × 1600, sem grade ou seleção                  | Aprovado                                                         |
| Larguras 320, 390, 575, 768, 991, 1024, 1200 e 1440 px | Sem rolagem horizontal                                           |
| Texto ampliado a 200% em viewport de 390 px            | Sem rolagem horizontal após ajuste do cabeçalho                  |
| Preferência de movimento reduzido                      | Animações e transições removidas                                 |
| Build e execução em `/yooga-touch-draw/`               | Aprovado                                                         |
| Falha simulada de exportação                           | Desenho preservado, mensagem exibida e nova tentativa disponível |
| Erros de página e respostas HTTP durante os fluxos     | Nenhum encontrado                                                |

As verificações de navegador foram executadas em Chromium headless. Firefox, Safari, leitores de tela e aparelhos físicos continuam como homologação futura, conforme as limitações já registradas no projeto.

## Manutenção

`npm run build` regenera os tokens antes de validar TypeScript e montar o bundle. Durante desenvolvimento, execute `npm run tokens` após editar `docs/design-system/tokens.json`. Não edite `src/styles/tokens.css` manualmente, pois ele é um artefato gerado.

Componentes transversais documentados que o Touch Draw não utiliza continuam apenas na especificação. A existência de um padrão para tabelas, filtros ou checkout não adiciona essas interfaces ao editor.
