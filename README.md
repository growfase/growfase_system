# Growfase System

Sistema local para criar propostas de orcamento da Growfase Studio.

O primeiro caso suportado e o orcamento de cartao de visita, com editor interno, preview publico por URL e opcao de imprimir/exportar para PDF pelo navegador.

## Como correr localmente

```powershell
node server.js
```

Depois abre:

```text
http://127.0.0.1:5178/
```

## Estrutura principal

- `index.html`: aplicacao e template da proposta.
- `styles.css`: sistema visual e layout responsivo.
- `app.js`: calculo de orcamento, estado da URL e interacoes.
- `server.js`: servidor estatico local com rota publica `/orcamento/:slug`.
- `design.md`: fonte de verdade para alteracoes de design.
- `AGENTS.md`: regras do projeto para agentes Codex/AIOX.

## Design

Antes de alterar cores, tipografia, espacamentos, layout, componentes, icons, imagens ou estados de interacao, ler `design.md` e atualizar o historico no mesmo commit.

## GitHub

Repositorio remoto configurado para:

```text
https://github.com/growfase/growfase_system
```
