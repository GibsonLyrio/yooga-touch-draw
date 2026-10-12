# Brief reutilizável para novos projetos

Copie este texto junto com a pasta `design-system` quando iniciar um projeto. Ele é uma orientação de trabalho, não uma configuração instalada no agente ou no aplicativo.

---

Use o **Yooga Design System v1.0.0** como referência de UI e UX. Leia `README.md`, `SYSTEM-DESIGN.md`, `COMPONENTS.md` e `UX-PLAYBOOK.md` antes de propor telas. Consulte `EVIDENCE.md` para distinguir características observadas de extensões propostas.

Preserve Poppins, a paleta Yooga, superfícies claras, raios 6/12/20 px, espaçamento consistente e linguagem direta em português brasileiro. Use tokens semânticos de `tokens.json`; o JSON é declarativo e precisa de adaptação à tecnologia do projeto. Não importe nomes ou dependências do app original sem necessidade.

Escolha a composição conforme a tarefa: operação com contexto, cadastro, detalhe, visão geral, hub de ajustes, editor, jornada guiada ou conteúdo institucional. Não imponha a estrutura de PDV a todo produto.

Defina a tarefa principal, a hierarquia de ações e os estados vazio, carregando, erro, sucesso, desabilitado e seleção. Inclua teclado, foco, toque, zoom, rótulos acessíveis e recuperação de falhas. Use a variante sólida azul escura com branco ou a variante suave com texto azul escuro; evite texto branco pequeno no azul vivo de marca.

Mantenha regras de negócio fora dos componentes básicos. Extensões de domínio precisam de anatomia, estados e critérios próprios. Valores ausentes não são zero; falha não é vazio; sucesso depende de resultado confirmado.

Antes de implementar, apresente a composição escolhida e as exceções relevantes. Execute apenas o escopo pedido. Se a tarefa for somente documentação ou design, não altere funcionamento, dependências ou estilos do aplicativo.

Contexto deste projeto:

- Produto e público: [preencher].
- Tarefas principais: [preencher].
- Plataformas e condições de uso: [preencher].
- Entidades e linguagem do domínio: [preencher].
- Fluxos críticos e formas de recuperação: [preencher].
- Restrições e capacidades já existentes: [preencher].
- Escopo autorizado agora: [preencher].

Entregue uma solução reconhecível como Yooga, validada para o contexto do produto. Documente qualquer adaptação em vez de criar um padrão visual paralelo.
