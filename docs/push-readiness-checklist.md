# Growfase System - Checklist para Push

Data: 2026-07-16

## Gates obrigatorios

Executar antes de fazer stage/commit:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:supabase
npm.cmd run test:server
```

Resultado esperado: todos passam.

## Gate Supabase

Executar quando `SUPABASE_SERVICE_ROLE_KEY` estiver configurada no `.env` e a migration tiver sido aplicada:

```powershell
npm.cmd run test:supabase
```

Resultado esperado: o teste cria uma proposta temporaria em `public.quotes`, le a proposta e apaga no final.

## Ficheiros que devem entrar no push desta fase

- `index.html`
- `styles.css`
- `app.js`
- `server.js`
- `design.md`
- `.env.example`
- `.gitignore`
- `README.md`
- `package.json`
- `tests/`
- `docs/`
- `supabase/migrations/20260716115355_create_quotes_table.sql`
- `assets/figma/mbway.png`

## Ficheiros/pastas a decidir antes do stage

- `.agents/`: skills locais instaladas para o agente. Nao sao necessarias para a app correr.
- `skills-lock.json`: lock das skills instaladas. Manter se a equipa quiser versionar o setup de agentes.
- `assets/figma/works/redes sociais/upra/Frame 65.png` e `Frame 66.png`: assets alterados anteriormente; confirmar se sao os finais.
- `assets/figma/works/Cartao de visitas/`: asset novo de cartao de visita; confirmar se deve ser usado/commitado.

## Ficheiros que nao devem entrar

- `.env`
- `supabase/.temp/`
- `.supabase/`
- `coverage/`
- `node_modules/`

## Sequencia recomendada

1. Confirmar visualmente a proposta em `http://127.0.0.1:5178/index.html`.
2. Confirmar que o gerador abre em `/admin/gerador_de_proposta`.
3. Confirmar que o link limpo abre em `/orcamento/[nome-do-cliente]`.
4. Configurar `SUPABASE_SERVICE_ROLE_KEY`.
5. Aplicar a migration `quotes`.
6. Correr `npm.cmd run test:supabase`.
7. Rever `git status --short`.
8. Fazer stage apenas dos ficheiros confirmados.
