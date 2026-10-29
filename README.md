# Gradil Calculator

Aplicação fullstack que calcula a quantidade de componentes de uma cerca Gradil,
apresenta um orçamento, desenha um esboço simplificado e guarda os pedidos
confirmados em SQLite.

**Stack:** TypeScript, React (Vite) e Node.js (Express).

## Funcionalidades

- Cálculo de telas, postes, fixadores e parafusos.
- Alturas 1,03 m, 1,53 m e 2,03 m com a quantidade correta de fixadores.
- Pinturas: sem pintura, branca, preta e verde.
- Esboço SVG com postes e telas.
- Confirmação do pedido com data e histórico dos mais recentes.
- Health check em `GET /health`.

## Regras de cálculo

- A tela tem 2,5 m e não é personalizável.
  `telas = ceil(comprimento / 2,5)`.
- O comprimento vendido é `telas × 2,5 m`, nunca menor que o solicitado. A
  diferença só é exibida quando maior que zero (arredondada ao centímetro).
- Em uma cerca linear, `postes = telas + 1`, pois cada poste interno fixa duas telas.
- Fixadores por tela: 3 (1,03 m), 4 (1,53 m) ou 6 (2,03 m).
- Parafusos: 4 por poste.

As premissas e decisões técnicas estão em
[`docs/adr/decisoes-tecnicas.md`](docs/adr/decisoes-tecnicas.md).

## Estrutura

```text
.
├── server/               API Express, domínio e SQLite
│   ├── src/domain/       Regras de cálculo e validação
│   ├── src/db.ts         Repositório SQLite (node:sqlite)
│   └── tests/            Testes unitários
├── web/                  React + Vite
│   └── src/components/   Formulário, resultado, esboço e histórico
├── docs/
│   └── adr/              Decisões técnicas consolidadas
├── .github/workflows/    CI (testes e typecheck)
├── Dockerfile            Build multi-stage Alpine
└── docker-compose.yml
```

## Rodando localmente

Requisitos: Node.js 24+ (usa o módulo nativo `node:sqlite`) e npm.

```bash
npm install
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Health check: http://localhost:3000/health

Comandos úteis:

```bash
npm test          # testes unitários do backend
npm run typecheck # TypeScript no backend e no frontend
npm run build     # compila backend e frontend
```

## Docker

```bash
docker compose up --build
```

A aplicação fica em http://localhost:3000. Para usar outra porta:

```bash
APP_PORT=8080 docker compose up --build
```

Os pedidos são persistidos no volume `gradil-data` (`/data/gradil.db`).

A imagem usa `node:24-alpine`, build multi-stage, execução como usuário `node`,
health check no Docker e caches limpos durante o build.

## API

| Método | Rota           | Descrição                                      |
| ------ | -------------- | ---------------------------------------------- |
| GET    | `/health`      | Saúde da aplicação                             |
| GET    | `/api/options` | Alturas, cores e regras de fabricação          |
| POST   | `/api/orders`  | Calcula o pedido e salva se `confirmed: true`  |
| GET    | `/api/orders`  | Pedidos confirmados, do mais recente ao antigo |

Exemplo de cálculo confirmado:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"length":5.1,"height":2.03,"color":"Verde","confirmed":true}'
```

## Licença

Consulte o arquivo [LICENSE](LICENSE).
