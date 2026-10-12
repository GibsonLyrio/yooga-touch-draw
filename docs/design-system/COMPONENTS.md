# Biblioteca de componentes

Contratos propostos para implementação futura. A presença visual na Yooga está identificada como O; CSS público como C. Todos os comportamentos que não foram testados são **P**, inclusive teclado, foco, validação e persistência. Consulte [fundamentos](SYSTEM-DESIGN.md) para tokens e [evidências](EVIDENCE.md) para limites.

## 1. Contrato comum

Cada componente deve declarar propósito, anatomia, variantes, estados, conteúdo, comportamento, acessibilidade e adaptação. Props e nomes apresentados aqui são conceituais e independentes de framework.

| Estado | Aparência | Comportamento esperado |
| --- | --- | --- |
| Default | Tokens do papel e da variante | Disponível e reconhecível |
| Hover | Mudança discreta de superfície/borda | Não revelar função essencial somente aqui |
| Pressed | Escurecimento ou superfície pressionada | Feedback imediato; não deslocar o layout |
| Focus-visible | Anel 2 px, offset 2 px | Visível em toda superfície; independente de hover |
| Selected/current | Fundo suave, marcador e estado programático | Diferenciar seleção de navegação e foco |
| Disabled | Fundo neutro e texto atenuado | Não executar; explicar pré-requisito próximo quando necessário |
| Loading | Indicador e rótulo de progresso | Preservar dimensão, evitar duplo envio, anunciar estado |
| Invalid | Borda + mensagem + associação ao campo | Preservar dados e oferecer correção |
| Read-only | Conteúdo legível, sem affordance de edição | Continua selecionável/copíavel quando aplicável |

Estados combinam: um item selecionado ainda pode receber foco. Não apagar o foco com o estilo de seleção. Usar `disabled` nativo quando adequado; se um item desabilitado precisar continuar focalizável para explicar a restrição, definir explicitamente `aria-disabled` e impedir sua execução.

## 2. Shell e navegação

### AppShell / NavigationRail — O1–O6

**Anatomia:** marca, navegação global, conteúdo principal, cabeçalho contextual, ajuda. Rail compacto 64 px; opção expandida 240 px. Ícone de 24 px, rótulo legível, alvo confortável. Estado atual: cor de ação, marcador e `aria-current="page"`.

**Variantes:** rail para poucos destinos conhecidos; sidebar expandida para rótulos longos ou grupos; drawer mobile; barra inferior apenas para 3–5 destinos prioritários. Não exibir rail e barra inferior simultaneamente.

**Interação:** links têm URLs reais; preservar Voltar do navegador. Abrir menu mobile por botão nomeado. Ao navegar, atualizar título da página e orientar o foco sem roubar foco durante atualização parcial. Badges não devem alargar o menu ou ocultar rótulos.

**Limites:** a marca identifica a empresa; não deve competir com a tarefa. Menus com muitos destinos precisam de agrupamento, não de ícones cada vez menores.

### PageHeader / Breadcrumb — O3, O4

**Anatomia:** retorno opcional, contexto hierárquico, H1, descrição opcional, ações. Título 24/36 semibold. Ação principal fica próxima ao título ou no painel de coleção; evitar duplicação.

**Mobile:** título e ações podem ocupar linhas diferentes. Breadcrumb reduzido preserva acesso ao nível anterior; não truncar o nome atual se isso impedir orientação.

**Semântica:** breadcrumb é navegação hierárquica; Voltar representa histórico. Não presumir que sempre levam ao mesmo lugar.

### Tabs — O5

**Anatomia:** rótulos, indicador inferior 3 px, painel associado. Indicador azul e texto ativo mais forte. Contagem opcional.

**Comportamento P:** tabs locais usam semântica de tablist e teclado com setas; ativação automática somente se o painel responde sem atraso perceptível. Se cada item navega para outra URL/página, usar links de navegação, não fingir tabs ARIA.

Em mobile, permitir rolagem visível do conjunto ou substituir por seleção de seção quando a quantidade crescer. Não esconder a aba ativa.

## 3. Ações

### Button — O1, O3–O6

**Anatomia:** ícone opcional de 20 px, rótulo, indicador de progresso. Gap 8 px; padding horizontal 16–24 px; raio 12 px. Alturas mínimas: 40 compact, 48 comfortable, 56 kiosk.

| Variante | Aparência | Uso |
| --- | --- | --- |
| Primary solid | Azul 500 + branco | Ação principal com alta ênfase |
| Primary soft | Azul 300 + azul 600 | Padrão de cadastro observado; mesma prioridade semântica |
| Secondary | Branco, borda de controle, texto principal | Alternativa como Cancelar ou Selecionar cliente |
| Tertiary | Transparente, texto de ação | Ação auxiliar |
| Destructive | Vermelho escuro + branco, ou contorno vermelho | Remover dado; confirmar conforme consequência |
| Positive | Fundo verde suave + texto escuro | Confirmação contextual, sem substituir o primário global |

Não usar preenchimento rosa para erro. O primário não é determinado pela posição do botão, mas pela ação recomendada naquele contexto.

**Variações de estado:** sólido usa `solidHover` e `solidPressed`; suave usa `softHover` no hover e, pressionado, `softPressed` com borda `border.selected` e retirada da sombra. Secundário recebe `secondaryHover`; destrutivo usa `destructiveHover`. Todos preservam o anel de foco independente. Desabilitado usa `action.disabled`/`action.onDisabled`, sem hover ativo. Em loading, manter a variante e substituir o conteúdo por indicador + rótulo, sem variar a largura.

**Conteúdo:** verbo + objeto quando necessário: “Nova categoria”, “Salvar alterações”, “Exportar imagem”. Evitar “OK” em decisões importantes. Enquanto envia: “Salvando…”. Sucesso é mostrado somente após confirmação efetiva da operação.

**Interação:** Enter/Espaço seguem botão nativo. Ação assíncrona impede duplicação. Desabilitar apenas a ação em curso, não toda a interface sem necessidade. Em erro, restaurar rótulo e permitir nova tentativa segura.

**Mobile:** largura total quando reduz ambiguidade, ações empilhadas conforme ordem de leitura. A ação principal não pode ficar fora da área rolável.

### IconButton / ActionGroup — O1, O3

Área padrão 48 × 48 px; desenho 20–24 px. Variantes ghost e outlined. Nome acessível obrigatório; dica no hover e no foco. Ações de risco ganham texto em menus ou diálogos. Toolbar agrupa ações relacionadas e preserva ordem. Com muitas ações, manter as frequentes visíveis e mover as outras para menu nomeado.

Não adicionar ícone “+” a ações que não criam ou adicionam. Um X fecha uma superfície; uma lixeira remove conteúdo. Não trocar esses significados.

### Link

Usar para destino, não para envio de formulário. Dentro de texto, sublinhar; em navegação, contexto e estado atual podem fornecer distinção. Informar abertura externa quando relevante. O destino deve continuar utilizável sem JavaScript quando a arquitetura permitir.

## 4. Entrada e seleção

### Field / TextInput / Textarea — C; interação P

**Anatomia:** label persistente, indicador de obrigatoriedade textual ou legenda consistente, controle, ajuda, erro. Input 48 px mínimo, texto 16/24, borda 1 px de controle, padding horizontal 16 px, raio 12 px. Textarea cresce ou permite expansão, sem esconder linhas digitadas.

**Estados:** vazio, preenchido, foco, inválido, desabilitado e somente leitura. Ajuda explica formato; erro explica correção. A borda sozinha não comunica erro.

**Validação:** evitar acusar erro antes da primeira tentativa de preencher. Após blur ou envio, mostrar problemas pertinentes; depois, atualizar enquanto a pessoa corrige. No envio inválido, resumo de erros quando houver vários campos e foco no primeiro problema relevante. Nunca apagar o conteúdo digitado.

**Dados:** usar autocomplete, inputmode e tipos adequados. Máscara não pode impedir colagem, edição intermediária ou uso de leitor de tela. Formatação de moeda deve manter precisão e permitir correção previsível. CPF/CNPJ, telefone e endereço são extensões de domínio.

### SearchField — O1, O3, O4

Busca global e busca de coleção precisam de escopo explícito: “Buscar produtos” é melhor que “Buscar” quando existe ambiguidade. Ícone de lupa, limpar quando preenchido e label acessível. Não enviar o formulário de edição por acidente ao pressionar Enter na busca.

**P:** debounce inicial de 300 ms quando há busca remota; Enter inicia imediatamente. Cancelar/ignorar resultados antigos, preservar a consulta e anunciar a contagem após estabilizar. Mostrar carregamento local. Consulta sem resultado não é erro.

### Select / Combobox — select de paginação O4; demais P

Usar select nativo para listas pequenas e simples. Combobox quando há muitas opções ou pesquisa. Anatomia: label, valor, indicador de expansão e lista. Diferenciar “Nenhuma opção”, “Nenhum resultado” e “Não foi possível carregar”.

**P:** setas navegam, Enter seleciona, Escape fecha; rótulo da opção selecionada permanece visível. Definir se digitação livre é permitida. Nunca gravar silenciosamente texto livre como entidade existente. Para entidades grandes, buscar progressivamente sem baixar toda a base.

### Checkbox / Radio / Switch — checkbox O5; demais P

- Checkbox: seleção independente ou múltipla; label clicável; estado indeterminado em selecionar todos.
- Radio: uma opção por grupo; grupo com título; setas para alternativas.
- Switch: configuração binária com efeito claro. Se salva imediatamente, mostrar falha e restaurar estado quando necessário. Se depende de “Salvar”, seguir a convenção do formulário e informar isso.

Área de toque inclui o rótulo. Não usar switch para uma ação momentânea como “Exportar”. Não pré-marcar preferências de “não mostrar novamente” em decisões relevantes.

### CategorySelector / FilterChip — O1; comportamento P

Imagem circular, anel de seleção, nome e alvo confortável. Categoria ativa tem estado programático. Usar botão com estado pressionado ou grupo de seleção conforme a tarefa; não aplicar semântica de tab sem painel correspondente.

Chip de filtro textual tem rótulo e remoção nomeada, por exemplo “Remover filtro: Ativos”. “Limpar filtros” não apaga a busca sem indicação. Número de filtros ativos fica visível. Nome longo deve continuar acessível por toque e teclado.

### QuantityControl — P

Botões diminuir/aumentar com valor editável e unidade. Declarar mínimo, máximo, passo e precisão. No limite, bloquear a ação correspondente e explicar o limite se necessário. Não transformar valor inválido em zero silenciosamente. Evitar envio remoto a cada tecla; definir confirmação ou atualização controlada.

## 5. Coleções e conteúdo

### Card / Surface — O1–O4, C

**Anatomia:** mídia opcional, título, descrição/metadado, status e ação. Branco, raio 12 px; padding 24 px; gap 8–16 px. Surface principal usa padding 32 px desktop. Card de navegação pode ser link inteiro quando contém uma única ação.

**Variantes:** bordered para coleção administrativa; elevated para item acionável; neutral para agrupamento; promotional para descoberta. Não fazer todo card parecer clicável se for apenas informativo.

**Interação:** se há múltiplas ações, usar controles distintos e evitar botão dentro de botão ou link envolvendo outros links. Nome e conteúdo devem permanecer legíveis com aumento de fonte. Hover não é prova suficiente de interatividade.

### ProductCard / EntityCard — O1, O3

Mídia com área reservada, nome até duas linhas, metadado principal e status. A versão produto pode exibir preço; a versão genérica pode exibir responsável, data ou categoria. Clique pode selecionar, abrir ou adicionar, mas cada coleção usa uma convenção única e comunica essa ação.

Ao adicionar repetidamente um item, mostrar confirmação próxima sem abrir modal a cada toque. Se o item exige configuração, abrir a configuração antes de confirmar. Essas interações são P, não foram exercitadas no PDV.

### DataTable — O4, C

**Anatomia:** título e contagem fora da tabela; toolbar de busca/filtros; cabeçalho; corpo; ações por linha; resumo/paginação. Fundo branco, cabeçalho neutro, bordas horizontais sutis, contorno externo 1 px, raio 6 px. Células C: 16 px vertical × 18 px horizontal, texto 14/20.

**Regras P:**

1. Texto à esquerda, números comparáveis à direita, datas formatadas consistentemente.
2. Ordenação precisa indicar coluna e direção; `aria-sort` quando aplicável.
3. Linha com detalhe tem link/botão explícito e nomeado. O clique amplo pode ser conveniência, sem impedir seleção de texto ou ações internas.
4. Seleção em lote deixa claro o escopo: página atual ou todos os resultados. O número selecionado é sempre visível.
5. Ações destrutivas em lote informam consequência e quantidade antes de executar.
6. Traço significa ausência de dado, com equivalente “Não informado” quando necessário. Zero é exibido como zero. Erro e carregamento são estados separados.
7. Coluna essencial não é removida sem alternativa mobile. Dados secundários podem migrar para detalhe.
8. Preservar filtro, ordenação e página ao retornar do detalhe; redefinir página quando filtro tornar a página inválida.

**Semântica:** tabela HTML para dados tabulares; não adicionar papel de grid sem implementar o modelo completo de navegação. Evitar virtualização até haver necessidade medida e solução acessível.

### Pagination — O4

Resumo “1–10 de 86”, anterior/próxima, página atual e tamanho de página quando útil. Botões nos limites ficam indisponíveis; a página atual recebe estado programático. Alterar tamanho deve manter contexto razoável e informar a nova faixa. Em mobile, resumo e navegação podem ocupar duas linhas. Não reduzir os alvos a números minúsculos.

### MetricCard / Chart — indicadores O5; gráficos P

Indicador contém nome, valor, unidade/período e comparação opcional. Informação auxiliar explica cálculo. Não mostrar variação sem base e intervalo. Valor indisponível não vira zero.

Gráficos usam rótulos, legendas e alternativa tabular/textual. Cor não é o único identificador; adicionar marcador, padrão ou rótulo direto. Ordenar categorias com critério. Mesma série mantém a cor entre telas. Evitar 3D, escalas enganosas e cores de sucesso/erro sem significado de negócio.

## 6. Contexto e sobreposição

### ContextPanel / SummaryPanel — O1

**Ordem:** título → estado/seleção → informações editáveis ou associações → resumo → ação principal. Total ou resultado fica junto à decisão. Divisórias indicam grupos.

**Estados P:** sem seleção, seleção única, seleção múltipla, edição pendente, processamento, concluído e falha. Sem seleção mostra orientação específica. Em seleção múltipla, distinguir valores compartilhados de valores diferentes.

Desktop: painel adjacente. Mobile: drawer, sheet ou etapa dedicada; preservar seleção e dados ao alternar. Um rodapé sticky não deve esconder o último item ou o erro.

### Drawer / SidePanel — C; interação P

Para detalhe ou edição contextual com necessidade de manter a coleção visível. Larguras P: 400 px simples, 640 px formulário, 768 px complexo; máximo 100% do espaço disponível. Raio 20 px no lado livre no desktop. Mobile: tela inteira.

Declarar se é modal. Se modal, fundo inerte e foco contido. Se não modal, permitir alternância de foco previsível entre painel e página. Título, fechar, corpo rolável e rodapé de ações. Alterações pendentes seguem política explícita de salvar/descartar; fechar não confirma dados silenciosamente.

### Dialog / ConfirmationDialog — O5, O6; C

**Anatomia:** título que explica a decisão, contexto curto, corpo opcional, ações, fechar quando permitido. Branco, raio 20 px, sombra elevada, backdrop `rgba(0,0,0,.4)`. Tamanhos P: 480 px breve; 640 px formulário; 860 px conteúdo complexo. Limite vertical 90% da área disponível e rolagem interna acessível.

**Contrato P:** título associado; papel de diálogo; foco inicial no elemento apropriado à tarefa, sem favorecer confirmação destrutiva; fundo inerte; Escape quando fechar é permitido; foco retorna ao disparador. Ao fechar com edição pendente, oferecer permanência ou descarte de forma clara.

Cancelar e confirmar têm resultados distintos. Clicar no backdrop pode fechar conteúdo de consulta, mas não deve descartar formulário preenchido silenciosamente. Evitar modais empilhados; usar etapas no mesmo diálogo ou navegar para uma página.

Não usar modal para todo sucesso. Avisos recorrentes devem preferir banner quando não exigem decisão imediata. O aviso de caixa observado é referência visual, não recomendação automática para todos os produtos.

### Popover / Menu / Tooltip — P, com suporte visual de ícones observados

Popover mostra conteúdo curto contextual; menu contém ações; tooltip explica um controle. Usar modelo de teclado correspondente e ancoragem que respeite a viewport. Escape fecha. A abertura por hover precisa de alternativa por foco e, quando relevante, toque.

Informação obrigatória, erro e instrução de preenchimento não ficam apenas em tooltip. Menu pode conter ação destrutiva identificada; tooltip não contém formulário.

## 7. Feedback

### Badge / Status — O1, O2, O5

Texto 12/16, padding 4 × 8 px, pill ou raio 6 px. Status com ponto/ícone e rótulo. Badge informativo não parece botão. Se filtra ao clicar, usar um chip interativo com estado e foco.

### Alert / Banner — O1, O5

Ícone, título opcional, mensagem e ação de recuperação. Fundos semânticos suaves, texto escuro, padding 16 px, raio 12 px. Dismiss só quando o aviso pode desaparecer sem esconder problema persistente. Problema crítico permanece visível até resolução.

### Toast — P

Para feedback breve não bloqueante. Uma ação local bem-sucedida pode usar toast; falha que exige correção também aparece no contexto. Proposta de duração 6 s para informação simples, com pausa quando houver foco/hover. Mensagem com ação essencial, erro importante ou recuperação permanece até resolução/dispensa. Não usar temporizador curto para “Desfazer” quando for a única forma de recuperar algo.

### EmptyState — O1, O5; demais P

| Situação | Texto de exemplo | Ação |
| --- | --- | --- |
| Coleção nova | “Você ainda não criou categorias.” | “Nova categoria” |
| Busca vazia | “Nenhum resultado para esta busca.” | “Limpar busca” |
| Filtros restritivos | “Nenhum item corresponde aos filtros.” | “Limpar filtros” |
| Sem seleção | “Selecione um item para ver os detalhes.” | Orientação, sem CTA artificial |
| Sem acesso | “Seu perfil não tem acesso a esta área.” | Caminho de ajuda apropriado |
| Falha ao carregar | “Não foi possível carregar os itens.” | “Tentar novamente” |

Nunca comunicar falha como coleção vazia. Ilustração é opcional; texto e próximo passo são essenciais.

### Loading / Skeleton / Progress — splash O3; spinner C; contratos P

Skeleton representa estrutura conhecida, reserva dimensões e não deve simular dados finais. Spinner representa espera curta sem progresso conhecido. Progresso percentual exige medida real; caso contrário usar estado indeterminado. Proposta: exibir indicador se a operação ultrapassar 300 ms; em espera prolongada, acrescentar explicação e opção de cancelar quando suportada. Esses tempos são defaults a validar, não medição do app.

Manter dados anteriores durante atualização quando fizer sentido, indicando que estão sendo atualizados. Em perda de conexão, mostrar última atualização e não fingir que informação antiga é atual. Splash de marca é reservado à inicialização, não a cada mudança de aba.

## 8. Componentes de domínio

| Extensão | Herda | Contrato adicional |
| --- | --- | --- |
| Editor visual | Toolbar, painel contextual, seleção e feedback | Desfazer/refazer, alternativa ao arraste, coordenadas e zoom previsíveis |
| Mapa de mesas | Card/objeto, status, legenda | Status de negócio documentado; cores do mapa não substituem rótulos |
| Checkout | Resumo, inputs, diálogo e progresso | Revisão explícita e estado final confiável |
| KDS | Cards, status e modo kiosk | Legibilidade à distância, prioridade e atualização sem deslocar alvo |
| Upload | Field, progress e alert | Formatos, limites, progresso, cancelamento e recuperação |
| DatePicker | Field e popover | Digitação alternativa, formato local, intervalo e teclado |
| Stepper | Navegação e validação | Etapa atual, concluída, erro e retorno sem perder entrada |

Essas extensões não estão implementadas e não foram todas observadas. Cada novo projeto deve detalhar a extensão necessária antes de codificá-la.

## 9. Critérios de aceite por componente

- Anatomia e responsabilidade únicas; nenhum componente genérico conhece regras de venda ou caixa.
- Todos os estados aplicáveis definidos e demonstráveis com dados sintéticos.
- Teclado, toque, foco e nome acessível revisados.
- Conteúdo longo, ausência de imagem, valores nulos e erros não quebram a composição.
- Variante e densidade correspondem à tarefa; tokens semânticos resolvem sem exceções locais ocultas.
- Mobile e zoom preservam ações e informação essencial.
- Comportamento real testado com o produto; aparência semelhante não basta para considerar o componente pronto.
