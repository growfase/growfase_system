# Growfase System - Analise e Plano de Upgrade

Data: 2026-07-16

## Estado atual

O projeto e um gerador local de propostas com interface de admin em `/admin/gerador_de_proposta` e preview publico em `/orcamento/:slug`. A UI principal esta em `index.html`, a logica do gerador em `app.js`, os estilos em `styles.css` e o servidor/API em `server.js`.

O fluxo de link ja esta preparado para guardar e carregar definicoes pela tabela `public.quotes`:

- `POST /api/quotes` guarda o estado completo do gerador.
- `GET /api/quotes/:slug` carrega o estado pelo nome limpo do cliente.
- `/orcamento/[nome-do-cliente]` renderiza a proposta publica e tenta carregar da base de dados.
- `GET /api/health` confirma se a Supabase esta configurada no servidor.

## Base de dados

Foi criada a migration:

- `supabase/migrations/20260716115355_create_quotes_table.sql`

A tabela `public.quotes` guarda:

- `slug`, unico e usado no link publico.
- `client_name`, `company_name`, `currency`, `total`.
- `data`, com o estado completo do gerador em JSON.
- `created_at` e `updated_at`.

RLS fica ativa. A escrita/leitura usada pela app passa pelo servidor com `SUPABASE_SERVICE_ROLE_KEY`; a chave nunca deve ir para o frontend.

Persistencia validada: o `.env` local tem as chaves Supabase necessarias e os testes `test:supabase` e `test:server` provam insert/select/delete na tabela `public.quotes` do projeto Growfase via API do servidor. O MCP do Supabase pode continuar limitado por permissoes do conector, mas o sistema funciona pela API com `SUPABASE_SERVICE_ROLE_KEY` no servidor.

## UI e UX implementados nesta fase

- Card MB WAY na area de pagamento com o numero `+351 931 948 650`.
- Botao para copiar o numero MB WAY.
- Icone Lucide no titulo do gerador.
- Cache atualizado para `design-system-37`.
- `design.md` atualizado com as novas regras visuais.

## Qualidade e pronto para git

Foram adicionados scripts sem dependencias externas:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd test`
- `npm.cmd run test:supabase` para verificar a tabela `quotes` com a service role key configurada.
- `npm.cmd run test:server` para verificar a rota admin, criacao de proposta, leitura por slug e rota publica.

Todos passaram em Windows usando `npm.cmd`, porque `npm.ps1` esta bloqueado pela execution policy local do PowerShell.

O `.gitignore` foi reforcado com:

- `coverage/`
- `.supabase/`
- `supabase/.branches/`
- `supabase/.temp/`

## Inconsistencias e riscos encontrados

1. O projeto ainda usa HTML/CSS/JS monolitico. A velocidade de iteracao e boa, mas o risco de regressao visual aumenta.
2. A persistencia depende de `SUPABASE_SERVICE_ROLE_KEY` no servidor; ela nao pode ser exposta no frontend nem no Git.
3. Nao ha teste visual automatizado da proposta em mobile/desktop.
4. A tabela `quotes` guarda o estado completo em JSON, o que e bom para velocidade, mas futuramente pode limitar relatorios e filtros.
5. O copy MB WAY e o copy link dependem de clipboard do browser, com fallback simples.
6. Alguns textos ainda estao diretamente no HTML/JS; quando houver mais tipos de servico, convem mover para configuracao estruturada.

## Plano de upgrade

### Prioridade 1 - Fechar deploy com persistencia

1. Adicionar `SUPABASE_SERVICE_ROLE_KEY` ao ambiente de deploy.
2. Garantir que a migration esta aplicada no projeto Growfase.
3. Validar `POST /api/quotes` e `GET /api/quotes/:slug` no ambiente publicado.
4. Criar uma proposta exemplo e abrir `/orcamento/luan-campos` sem query string em producao.

### Prioridade 2 - Deploy e dominio

1. Definir ambiente de producao para `growfase.com`.
2. Garantir rewrite de `growfase.com/orcamento/*` para `index.html`.
3. Guardar secrets apenas no servidor.
4. Adicionar health check de deploy para `/api/health`.

### Prioridade 3 - Robustez do gerador

1. Separar templates de servico, FAQ e portfolio para um ficheiro de configuracao.
2. Adicionar validacao de campos obrigatorios antes de guardar.
3. Adicionar feedback visual de erro/sucesso no painel em vez de `alert`.
4. Criar estado "guardado" com data da ultima alteracao.

### Prioridade 4 - Qualidade visual

1. Adicionar teste visual com Playwright para 375px e desktop.
2. Criar screenshots de referencia para proposta publica.
3. Validar overflow de textos longos em cliente, empresa, titulo e valores.
4. Rever consistencia de sombras, raios e espacos entre todas as secoes.

### Prioridade 5 - Produto

1. Adicionar historico de propostas por cliente.
2. Permitir duplicar uma proposta existente.
3. Criar estados: rascunho, enviada, aceite, recusada.
4. Registar confirmacao pelo WhatsApp como evento.
5. Adicionar export PDF server-side quando o layout estiver estabilizado.
