# AgentNet.ai Website Starter

This monorepo includes:
- `agentnet-backend` (Node.js/Express/Sequelize/MySQL)
- `agentnet-frontend` (Vite/React/Tailwind with Figma tokens)

## Quickstart

### Backend
1. `cd agentnet-backend`
2. Copy `.env.example` to `.env` and set DB credentials
3. `npm install`
4. Ensure MySQL is running and DB exists (e.g., `CREATE DATABASE agentnet_ai;`)
5. `npm run seed`
6. `npm run dev`

### Frontend
1. `cd agentnet-frontend`
2. Copy `.env.example` to `.env` and set `VITE_API_BASE` (default `http://localhost:5174`)
3. `npm install`
4. `npm run dev`

## Roadmap-ready Sections
- Standards (now)
- Docs (now)
- Future: Dev Community APIs, Support, Node Registrar, Events, Blog

## Security Note
Admin mutations are guarded by a simple `x-admin-token` header. Replace in production with real auth.
