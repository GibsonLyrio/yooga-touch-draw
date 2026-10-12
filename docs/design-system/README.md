# Yooga Design System

Versão **1.0.0 — especificação proposta**, 11 de outubro de 2026. Baseado na inspeção do app Yooga, versão pública `2026.17.7`. A primeira entrega foi exclusivamente documental. Após autorização do usuário, o núcleo foi aplicado ao Touch Draw; veja [implementação e validação](IMPLEMENTATION.md). A especificação continua sendo referência transversal, sem afirmar que todos os componentes foram implementados neste editor.

O objetivo é permitir que um produto novo seja reconhecível como Yooga sem precisar copiar uma tela de vendas. A identidade se mantém pela tipografia, pelas cores, pela composição, pela linguagem e pela previsibilidade das interações. A estrutura se adapta à tarefa: operar, cadastrar, consultar, editar ou apresentar.

## Como usar esta especificação

| Arquivo                                                                | Conteúdo                                                                    |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Fundamentos e regras](SYSTEM-DESIGN.md)                               | Identidade, tokens, tipografia, composição, responsividade e acessibilidade |
| [Biblioteca de componentes](COMPONENTS.md)                             | Anatomia, variantes, estados e contratos de interação                       |
| [Padrões de UX e adoção](UX-PLAYBOOK.md)                               | Fluxos, conteúdo, templates, aplicação em outros produtos e governança      |
| [Evidências e decisões](EVIDENCE.md)                                   | O que foi observado, confirmado no CSS, inferido ou proposto                |
| [Tokens de referência](tokens.json)                                    | Valores declarativos; adaptados ao CSS pelo gerador do projeto              |
| [Prancha visual PNG](reference-board.png) · [SVG](reference-board.svg) | Síntese visual dos fundamentos e exemplos conceituais                       |
| [Guia para novos projetos](PROJECT-BRIEF.md)                           | Instrução reutilizável para equipes e agentes                               |
| [Verificação inicial](VERIFICATION.md)                                 | Registro da etapa documental, antes da implementação                        |
| [Implementação](IMPLEMENTATION.md)                                     | Escopo aplicado ao Touch Draw e validação atual                             |

A prancha SVG incorpora os subconjuntos latinos de Poppins 400/500/600 distribuídos publicamente pelo app; a [licença SIL OFL](FONT-LICENSE.txt) acompanha a referência. O PNG preserva a aparência em visualizadores que não carregam fontes do SVG. Os exemplos são sintéticos, sem dados da conta.

Leia os fundamentos e escolha o template de UX antes de desenhar uma tela. Consulte o componente correspondente e use os tokens semânticos. As regras de negócio pertencem ao produto; não devem ser embutidas nos componentes básicos.

## Origem e grau de certeza

- **O — Observado:** visto em uma página autenticada, sem executar operações de negócio.
- **C — Confirmado em fonte pública:** valor ou regra presente no HTML/CSS distribuído pelo app. Uma declaração CSS não prova que ela está ativa em todas as telas.
- **P — Proposto:** normalização ou extensão para este design system; precisa de validação na implementação futura.
- **NV — Não validado:** comportamento que exigiria interação, dispositivo ou teste não realizado nesta coleta.

A tipografia Poppins, parte importante da paleta, a escala de títulos e os raios 6/12/20 px são confirmados. Teclado, leitor de tela, foco de modais, resultados de buscas, formulários internos e navegação mobile não foram testados. As regras correspondentes são propostas, não relatos de comportamento do app atual.

## Decisões centrais

1. Manter o azul Yooga como identidade e usar o azul escuro da própria paleta para ações que exigem texto branco legível.
2. Adotar a linguagem mais recente observada em Categorias e Clientes: fundo neutro claro, conteúdo branco, raio 12 px, padding 32 px e tipografia consistente.
3. Preservar o layout operacional com catálogo e painel contextual como um template, sem impô-lo a todos os produtos.
4. Tratar rosa como destaque de marca, verde como confirmação, amarelo como atenção e vermelho como erro ou ação destrutiva.
5. Usar uma camada semântica de tokens para evitar a mistura de paletas legadas e nomes de framework.
6. Especificar estados vazios, erros, carregamento, teclado e mobile com o mesmo cuidado dos estados ideais.

## Limites da entrega

Esta é uma base transversal completa de especificação, não uma biblioteca implementada nem uma homologação oficial da marca. Não é uma arquitetura de servidores, APIs ou banco de dados. O termo “system-design” foi interpretado como **design system de produto e experiência**, conforme o pedido de UI/UX.

Nenhuma documentação pode garantir adequação automática a todo domínio. Projetos com requisitos próprios devem manter o núcleo e acrescentar extensões documentadas. KDS, totem, editor visual e site institucional, por exemplo, precisam de composições diferentes.

Tema claro é o baseline. Existe CSS público de tema escuro específico de KDS, mas um tema escuro global não foi observado nem definido como pronto. Os tokens semânticos permitem adicioná-lo posteriormente com validação própria.
