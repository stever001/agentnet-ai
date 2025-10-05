# AgentNet Backend

Node.js + Express + Sequelize + MySQL.

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Ensure MySQL is running and database exists (e.g., `CREATE DATABASE agentnet_ai;`).
3. Install deps: `npm install`
4. Seed sample content: `npm run seed`
5. Start dev server: `npm run dev`

API:
- `GET /api/health`
- `GET /api/pages/:slug`
- `POST /api/pages` (requires `x-admin-token` header)
- `GET /api/standards`
- `GET /api/standards/:slug`
- `POST /api/standards` (requires `x-admin-token` header)
