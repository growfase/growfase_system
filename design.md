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
- Inputs com fundo `#0A0A0A`, borda `#303030` e foco azul de 3px com baixa opacidade.
- Ações organizadas numa grelha de duas colunas.
- Ações primárias usam fundo `--accent` e texto `#050505`.
- Ações secundárias usam fundo escuro e borda visível.

### Proposta

- Alternar secções escuras imersivas com secções claras editoriais.
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

## 6. Movimento e interação

- Transições entre 150ms e 250ms para cor, borda e opacidade.
- Não usar animações que desloquem o layout.
- Respeitar `prefers-reduced-motion` quando forem adicionadas animações complexas.
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
