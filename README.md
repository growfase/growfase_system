# Growfase System

Sistema local para criar propostas de orcamento da Growfase Studio.

O primeiro caso suportado e o orcamento de cartao de visita, com editor interno, preview publico por URL e opcao de imprimir/exportar para PDF pelo navegador.

## Como correr localmente

```powershell
npm.cmd start
```

Depois abre:

```text
http://127.0.0.1:5178/
```

Link local do gerador:

```text
http://127.0.0.1:5178/admin/gerador_de_proposta
```

Link de produção do gerador:

```text
https://www.growfase.com/admin/gerador_de_proposta
```

## Validacao

No Windows, usar `npm.cmd` para evitar bloqueio de `npm.ps1` pela execution policy:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
```

## Supabase

O servidor guarda propostas na tabela `public.quotes`.

1. Configurar `.env` com:

```text
SUPABASE_URL=https://ybmanywfxflskwbutspe.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

2. Aplicar a migration:

```text
supabase/migrations/20260716115355_create_quotes_table.sql
```

3. Verificar:

```text
http://127.0.0.1:5178/api/health
```

4. Testar insert/select/delete real na tabela `quotes`:

```powershell
npm.cmd run test:supabase
```

Este teste precisa de `SUPABASE_SERVICE_ROLE_KEY` no `.env` e da migration ja aplicada.

5. Testar o fluxo completo do servidor:

```powershell
npm.cmd run test:server
```

## Deploy Cloudflare

O projeto esta preparado para Cloudflare Workers com Static Assets:

```powershell
npm.cmd run build:cloudflare
npm.cmd run deploy:cloudflare
```

O Worker usa `wrangler.jsonc`, serve os assets gerados em `dist/` e executa as rotas `/api/*`, `/orcamento/*` e `/admin/*` no edge. Em producao, configurar `SUPABASE_SERVICE_ROLE_KEY` como secret do Worker e usar o dominio:

```text
https://www.growfase.com/admin/gerador_de_proposta
```

## Estrutura principal

- `index.html`: aplicacao e template da proposta.
- `styles.css`: sistema visual e layout responsivo.
- `app.js`: calculo de orcamento, estado da URL e interacoes.
- `server.js`: servidor estatico local com rota publica `/orcamento/:slug`.
- `design.md`: fonte de verdade para alteracoes de design.
- `AGENTS.md`: regras do projeto para agentes Codex/AIOX.
- `supabase/migrations/`: schema necessario para guardar propostas.
- `src/worker.js`: runtime Cloudflare Worker para API e rotas publicas.
- `scripts/build-cloudflare.js`: prepara os assets estaticos em `dist/`.
- `docs/project-analysis-upgrade-plan.md`: analise atual e plano de upgrade.
- `docs/push-readiness-checklist.md`: checklist de gates e ficheiros antes do push.

## Design

Antes de alterar cores, tipografia, espacamentos, layout, componentes, icons, imagens ou estados de interacao, ler `design.md` e atualizar o historico no mesmo commit.

## GitHub

Repositorio remoto configurado para:

```text
https://github.com/growfase/growfase_system
```
