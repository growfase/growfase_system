# Growfase Orçamentos - Design System

Este documento é a fonte de verdade visual do projeto. Toda alteração que mude cores, tipografia, espaçamento, componentes, ícones, responsividade, interação ou composição deve atualizar este ficheiro no mesmo conjunto de alterações.

## 1. Direção visual

O produto é um gerador de propostas comerciais para a Growfase Studio, com foco inicial em cartões de visita. A experiência deve parecer premium, tecnológica e editorial, sem perder a eficiência de uma ferramenta de trabalho.

- Referência principal: frame de proposta do Figma Growfase Studio.
- Abordagem: phone first, com editor e pré-visualização separados em ecrãs pequenos.
- Personalidade: escura, precisa, contemporânea e confiante.
- Cor de destaque: azul claro. Não usar verde como cor de marca, estado ou decoração.
- Formas: cantos discretos, até 8px, evitando cartões excessivamente arredondados.
- Imagens: usar os assets exportados do Figma em `assets/figma/`.

## 2. Tokens

Os tokens canónicos estão em `:root` no ficheiro `styles.css`.

| Papel | Token | Valor | Uso |
| --- | --- | --- | --- |
| Fundo | `--bg` | `#060606` | Fundo global |
| Painel | `--panel` | `#101010` | Superfícies principais escuras |
| Painel elevado | `--panel-2` | `#171717` | Variações de superfície |
| Texto principal | `--text` | `#F7F7F7` | Texto sobre fundos escuros |
| Texto secundário | `--muted` | `#9C9C9C` | Legendas e metadados |
| Divisória | `--line` | `#262626` | Bordas e separadores |
| Superfície clara | `--light` | `#F5F5F1` | Secções editoriais da proposta |
| Texto escuro | `--ink` | `#101010` | Texto sobre superfícies claras |
| Destaque | `--accent` | `#8EDCFF` | Ações, foco e informação selecionada |
| Azul suave | `--blue` | `#BFF1FF` | Gradientes e detalhes secundários |

O azul deve aparecer com intenção e não dominar toda a interface. Estados de sucesso continuam azuis; não introduzir verde. Vermelho deve ficar reservado a erros ou ações destrutivas futuras.

## 3. Tipografia

- Display: `Orbitron`, fallback `Oxanium`, para títulos de impacto e identidade Growfase.
- Corpo: `Oxanium`, fallback `Inter`, para o conteúdo da proposta.
- Interface: `Inter`, fallback `Oxanium`, para formulários, botões e controlos.
- Mockups: `Montserrat`, fallback `Inter`, quando a composição visual do asset exigir.
- Letter spacing: `0`; não usar tracking negativo.
- Títulos grandes ficam reservados à proposta. O editor usa títulos e rótulos compactos.

## 4. Layout e responsividade

### Desktop, acima de 880px

- Workspace em duas colunas: editor entre 300px e 380px e pré-visualização flexível.
- Distância exterior e entre colunas: 28px a 32px.
- Editor fixo durante o scroll, com altura máxima relativa ao viewport.
- Proposta com largura máxima de 400px para preservar a composição phone first.

### Mobile, até 880px

- Alternador fixo no topo para `Editor` e `Pré-visualização`.
- Apenas uma vista é apresentada de cada vez.
- Padding lateral de 14px no editor.
- A página pública apresenta apenas a proposta, com largura total até 400px.
- Nenhum elemento deve provocar scroll horizontal a 375px.

### Impressão e PDF

- Ocultar editor e controlos.
- Renderizar apenas a proposta a 400px, sem sombra nem moldura externa.
- Preservar cores, imagens e hierarquia da pré-visualização.

## 5. Componentes

### Editor

- Painel escuro com borda de 1px e raio de 8px.
- A marca do editor deve usar o asset real `/assets/figma/logo.png`, não letra ou placeholder.
- O título do gerador deve poder usar um ícone Lucide pequeno em azul claro junto ao texto, mantendo o logo real como marca principal.
- Inputs com fundo `#0A0A0A`, borda `#303030` e foco azul de 3px com baixa opacidade.
- Ações organizadas numa grelha de duas colunas.
- Ações primárias usam fundo `--accent` e texto `#050505`.
- Ações secundárias usam fundo escuro e borda visível.
- O gerador deve ter uma caixa única para definir o valor final em euros. Acabamentos, impressão e extras de produção não devem aparecer como opções do editor quando forem executados por outra empresa. O link público deve ser limpo no formato `https://www.growfase.com/orcamento/[nome-do-cliente]`. A ação `Gerar link` deve guardar a proposta no Supabase antes de copiar/mostrar o link.

### Proposta

- Alternar secções escuras imersivas com secções claras editoriais.
- A primeira secção da proposta segue a abertura do Figma: fundo preto sólido, navegação compacta com logo real, barra de cliente em superfície escura, título display enorme em linhas separadas editável pelo gerador, linhas técnicas azuis discretas no lado direito e mockup MacBook iluminado encostado ao rodapé da secção. Não usar fundo cinza ou brilho branco estrutural atrás do mockup.
- A segunda secção da proposta segue a referência editorial clara do Figma: fundo cinza muito claro com grelha subtil, navegação pequena em azul claro, headline display preta com GROWFASE em destaque, copy curta em blocos espaçados e galeria `Websites` empilhada com imagens reais de `assets/figma/works/websites/`.
- A galeria de `Redes Sociais` aparece logo após `Websites`, usando a mesma superfície clara com grelha. Cada trabalho social deve mostrar o logotipo da marca e três posts em composição horizontal, com o post central em destaque. O gerador pode selecionar quais trabalhos ficam visíveis.
- A galeria de `Cartões de visita` aparece na mesma área de trabalhos, depois de `Redes Sociais`, usando os assets reais de `assets/figma/works/Cartão de visitas/`. Os cartões devem ser exibidos em proporção 1:1, com cantos de 8px, sombra editorial subtil e opção própria de mostrar/ocultar no gerador.
- A secção sobre Luan deve ser uma secção escura imersiva: retrato real em card superior usando o asset com nome e cargo integrados, texto pessoal em blocos curtos e mockup de telemóvel grande encostado ao limite inferior da própria secção sobre fundo azul/preto com textura dos assets.
- A secção de processo deve seguir o frame escuro do Figma: navegação pequena em azul, título display no topo, nota inicial, timeline vertical central com pontos luminosos azuis, seta curva azul clara pequena apontando para o início da timeline, nota lateral de aprovação, ícone Lucide de foguete na etapa de entrega e card de prazo horizontal no rodapé. O fundo deve usar três linhas horizontais de `GROWFASE` com opacidade progressiva, reduzindo cerca de 30% na segunda linha e 60% na terceira. O prazo deve ser editável no gerador, com azul escuro no card, backdrop blur de 40px, texto alinhado à direita, valor principal em destaque, sufixo "úteis" menor quando existir, degradê branco/cinzento de 50px no final da secção e z-index 100 para ficar à frente de todas as camadas da secção.
- A área posterior ao processo deve ter fundo claro `#f3f3f0`, igual à área de orçamento/investimento, e apresentar `Serviços Solicitados` em card escuro, com headline display "Vamos para o que mais interessa?" e a palavra `interessa?` em azul claro. O conteúdo do card deve refletir o dropdown `Serviço solicitado` do gerador: Cartão de visita, Gestão de Anuncios, Landing Page, Website instituicional ou Redes sociais. O espaço entre este card e o título de investimento deve ser curto e editorial, sem uma grande área vazia.
- A área de orçamento deve seguir a referência de tabela comercial: fundo claro, título display `Investimento para` com o serviço em azul, lista de investimento em linhas cinza com valores em badges pretas, ofertas em faixa verde água, total em faixa azul e formas de pagamento em cards cinza logo abaixo. Deve ter 16px de margem/padding lateral à esquerda e direita. Deve haver 48px entre a tabela de investimento e `Formas de Pagamento`. Para cartão de visita, comunicar impressão como item à parte. Não mostrar linha de acabamento selecionado na tabela. As formas de pagamento exibidas são apenas integral e duas parcelas; na opção em duas parcelas usar `50% no início` e `50% na entrega` com logo MB WAY no canto superior direito do card. A seguir às formas de pagamento deve existir um card MB WAY com o número `+351 931 948 650`, indicação para envio do comprovativo e botão com ícone Lucide para copiar o número. Não mostrar resumo de quantidade/acabamento/validade no rodapé. Não usar degradê no rodapé desta área; terminar com o título `Iniciaremos após pagamento.` com `pagamento.` em azul, 48px de margem acima e abaixo, botão verde de confirmação por WhatsApp com ícone e 24px de respiro claro antes da FAQ.
- A FAQ deve ser uma secção escura final com etiqueta `Dúvidas`, título `Perguntas Frequentes`, cinco cards empilhados com perguntas em branco e respostas em cinza, seguida pelo logo real da Growfase grande e centrado. O gerador deve ter um seletor de FAQ com presets `Website` e `Cartão/design geral`; no preset de cartão/design geral, a impressão deve ser comunicada como serviço à parte.
- Secções não devem parecer cartões flutuantes; cartões são reservados a planos, pacotes, mockups e itens repetidos.
- Imagens devem mostrar o trabalho real e manter proporção estável.
- O investimento selecionado deve ser o ponto de maior contraste informativo.

### Botões e ícones

- Biblioteca oficial: Lucide, carregada por UMD no `index.html`.
- Tamanho padrão dos ícones de ação: 16px; alternador mobile: 15px.
- Espessura visual consistente com o padrão Lucide.
- Botões de comando usam ícone + rótulo. Não usar emoji como ícone.
- Ícones não substituem rótulos essenciais; botões apenas com ícone precisam de `aria-label` e tooltip.
- Hover altera cor, borda ou luminosidade sem mudar dimensões.
- Foco de teclado deve permanecer claramente visível em azul.
- Selects do gerador usam chevron customizado por CSS, posicionado com 15px de recuo à direita para ficar 3px mais à esquerda do alinhamento anterior.

## 6. Movimento e interação

- Transições entre 150ms e 250ms para cor, borda e opacidade.
- Não usar animações que desloquem o layout.
- Respeitar `prefers-reduced-motion` quando forem adicionadas animações complexas.
- A página pública `/orcamento/[cliente]` deve apresentar um loader de 3 segundos com o logo real da Growfase sobre fundo preto, brilho azul subtil e barra de progresso horizontal antes de revelar a proposta. O loader não deve aparecer no gerador/admin.
- Áreas clicáveis devem ter pelo menos 38px de altura no alternador e 42px nas ações do editor.
- A seleção de pacote e extras deve ter diferença de contraste além da cor isolada.

## 7. Acessibilidade

- Contraste mínimo de 4.5:1 para texto de corpo.
- Todos os campos têm rótulo visível.
- Imagens informativas precisam de texto alternativo; imagens puramente decorativas usam `alt=""`.
- Controlos devem funcionar com teclado e apresentar `:focus-visible`.
- Estados temporários, como `Link copiado`, devem manter o propósito do botão reconhecível.

## 8. Regras de manutenção

Ao receber uma alteração de design:

1. Verificar primeiro este documento e o frame de referência no Figma.
2. Atualizar os tokens ou a regra relevante neste ficheiro.
3. Implementar a alteração em HTML, CSS e JavaScript.
4. Validar desktop, 375px mobile, página pública e impressão quando aplicável.
5. Registar a mudança no histórico abaixo.

## 9. Histórico de design

| Data | Alteração |
| --- | --- |
| 2026-07-14 | Criado o sistema visual do projeto com direção phone first e paleta azul clara baseada no Figma. |
| 2026-07-14 | Definido Lucide como biblioteca oficial e aplicado o padrão ícone + rótulo aos comandos do editor. |
| 2026-07-15 | Atualizada a primeira secção da proposta para seguir a abertura do Figma, com logo real, barra de cliente, título display editorial, linhas técnicas azuis e mockup MacBook iluminado. |
| 2026-07-15 | Atualizada a segunda secção da proposta para o layout claro do Figma, com grelha subtil, copy de objetivo da Growfase e galeria de websites usando AxisCore, Greenlife e Mushome. |
| 2026-07-15 | Adicionada galeria selecionável de Redes Sociais, valores editáveis em euros e regra de link limpo guardado na base de dados. |
| 2026-07-15 | Simplificado o editor de valores para uma caixa única de valor final em euros, removendo a grelha de bases, unitários e extras. |
| 2026-07-15 | Atualizada a secção sobre Luan para composição escura com retrato real, copy pessoal e mockup de telemóvel usando assets do Figma. |
| 2026-07-15 | Atualizada a secção de processo para timeline escura estilo Figma e adicionado campo editável de prazo estimado no gerador. |
| 2026-07-15 | Aumentado o mockup de telemóvel da secção sobre Luan e encostado ao limite inferior da secção para ocupar mais largura. |
| 2026-07-15 | Corrigida a seta inicial da timeline de processo e refinado o card de prazo para composição horizontal com valor e sufixo separados. |
| 2026-07-15 | Refinada a secção de processo com seta menor, fundo GROWFASE em opacidade progressiva, azul do card de prazo mais escuro e degradê branco final de 20px. |
| 2026-07-15 | Substituída a área de investimento inicial por card de Serviços Solicitados ligado ao dropdown de serviço no gerador. |
| 2026-07-15 | Alterado o fundo da área de Serviços Solicitados para branco, mantendo o card interno escuro. |
| 2026-07-15 | Redesenhada a FAQ como secção escura final com cards fixos e logo Growfase grande no rodapé. |
| 2026-07-15 | Adicionado seletor de FAQ no gerador para alternar entre perguntas de website e cartão/design geral, com impressão indicada como serviço à parte. |
| 2026-07-15 | Refinada a área de orçamento para seguir a referência clara com card preto de valor, proposta selecionada branca, pacotes empilhados e resumo cinza. |
| 2026-07-15 | Recriada a área de orçamento no formato de tabela de investimento e formas de pagamento, adaptada para cartão de visita com impressão à parte. |
| 2026-07-15 | Removida a opção de pagamento em 3x sem juros, mantendo apenas integral e duas parcelas. |
| 2026-07-15 | Removido o degradê final da área de orçamento e adicionado botão de confirmação via WhatsApp. |
| 2026-07-15 | Ajustado o rodapé da área de orçamento com 24px antes da FAQ, botão verde com ícone WhatsApp, nota de início após pagamento e sombras 20% mais fortes. |
| 2026-07-15 | Corrigido o respiro entre botão WhatsApp e FAQ para ser padding claro dentro da área de orçamento. |
| 2026-07-15 | Adicionado espaçamento de 48px entre a tabela de investimento e as formas de pagamento. |
| 2026-07-15 | Removido o resumo final de quantidade/acabamento/validade e transformada a nota de início após pagamento em título com pagamento em azul. |
| 2026-07-15 | Aplicada margem de 48px acima e abaixo do título Iniciaremos após pagamento. |
| 2026-07-15 | Ajustado o ícone dos selects 3px para a esquerda usando chevron customizado em CSS. |
| 2026-07-15 | Corrigida a especificidade CSS do título Iniciaremos após pagamento para a margem de 48px sobrepor a regra global de títulos. |
| 2026-07-15 | Substituído o placeholder textual do editor pelo logo real da Growfase. |
| 2026-07-15 | Atualizado o primeiro post da composição UPRA para o asset Boas Estratégias com cache-buster dedicado. |
| 2026-07-15 | Movida a seta inicial da timeline de processo 8px para a esquerda. |
| 2026-07-15 | Movida novamente a seta inicial da timeline de processo mais 8px para a esquerda. |
| 2026-07-15 | Movida a seta inicial da timeline de processo mais 10px para a esquerda e 5px para cima. |
| 2026-07-15 | Movida a seta inicial da timeline de processo mais 14px para a esquerda. |
| 2026-07-15 | Removida a linha de acabamento selecionado da tabela de investimento. |
| 2026-07-15 | Alterada a primeira secção da proposta para fundo preto sólido, removendo brilho/fundo cinza atrás do mockup. |
| 2026-07-15 | Adicionada opção no gerador para alterar o título da primeira secção e encostado o mockup ao fim da secção. |
| 2026-07-15 | Removido o bloco de acabamentos extras do editor porque produção/acabamentos são feitos por outra empresa. |
| 2026-07-16 | Atualizado o primeiro card UPRA em Redes Sociais para o asset `Frame 66.png` com novo cache-buster. |
| 2026-07-16 | Ajustada a área de orçamento para 16px de margem lateral esquerda e direita. |
| 2026-07-16 | Adicionado logo MB WAY ao card de pagamento em duas parcelas. |
| 2026-07-16 | Aumentado para 50px o degradê final da secção de processo. |
| 2026-07-16 | Igualado o fundo da secção Serviços Solicitados ao fundo claro da área de orçamento. |
| 2026-07-16 | Adicionado backdrop blur de 10px ao card de prazo da secção de processo. |
| 2026-07-16 | Adicionado card MB WAY com número e ação de copiar na área de pagamento. |
| 2026-07-16 | Adicionado ícone Lucide ao título do gerador no painel do editor. |
| 2026-07-16 | Ajustado o card MB WAY para empilhar o botão em ecrãs estreitos e corrigida a especificidade do ícone no título do gerador. |
| 2026-07-16 | Adicionada galeria selecionável de Cartões de visita na área de trabalhos, usando os assets reais adicionados em `assets/figma/works/Cartão de visitas/`. |
| 2026-07-16 | Corrigida a galeria de Cartões de visita para apresentar os assets em proporção quadrada 1:1. |
| 2026-07-16 | Renomeada a ação de copiar para `Gerar link` e fixado o formato canónico `https://www.growfase.com/orcamento/[cliente]`, guardando no Supabase antes de expor o link. |
| 2026-07-16 | Corrigida a rota pública `/orcamento/[cliente]` para manter o path original, abrir apenas a proposta e nunca mostrar o gerador ao cliente. |
| 2026-07-16 | Atualizado o botão WhatsApp para `wa.me/351931948650`, escurecido o card de prazo com blur de 40px e reduzido o espaço antes do investimento. |
| 2026-07-16 | Adicionado loader público de 3 segundos com logo Growfase para links `/orcamento/[cliente]`. |
| 2026-07-17 | Adicionada barra de progresso ao loader público e limpeza automática de textos antigos com acentos corrompidos. |
| 2026-07-17 | Elevado o card de prazo da secção de processo para z-index 100. |
