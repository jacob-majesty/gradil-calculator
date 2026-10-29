# Decisões técnicas

## Stack

- Frontend em React + Vite + TypeScript.
- Backend em Node.js 24 + Express + TypeScript.
- Banco SQLite via módulo nativo `node:sqlite`, sem ORM.

## Cálculo

- As regras ficam no backend, em um único módulo de domínio coberto por testes.
- A cerca é tratada como trecho linear: `postes = telas + 1`.
- Alturas, fixadores, parafusos e comprimento vendido seguem os dados de fabricação.
- Somente pedidos confirmados são persistidos; a data de confirmação é gravada em UTC.

## Persistência

- SQLite em arquivo único (`/data/gradil.db` no container), com WAL.
- `node:sqlite` evita dependência nativa, compilação e engine extra na imagem.
- O modelo assume uma única instância da aplicação.

## Empacotamento

- Docker multi-stage com `node:24-alpine`.
- Runtime como usuário `node`, apenas dependências de produção e health check em `/health`.
- O frontend compilado é servido pelo Express, mantendo API e interface na mesma origem.
- Porta externa configurável por `APP_PORT` (padrão `3000`).
