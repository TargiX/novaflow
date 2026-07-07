# NovaFlow Dashboard Demo

Fully working React dashboard demo based on the supplied screenshot.

[Live demo](https://novaflow.signalops.cc) · [Source](https://github.com/TargiX/novaflow)

NovaFlow is a polished analytics dashboard with real client-side interactions, a mock-backed API, responsive dashboard panels, transaction filtering/export, and production deployment on Vercel.

## Stack

- React 19 + TypeScript + Vite
- TanStack Query for API state
- TanStack Table for transactions
- Recharts for analytics charts
- Express + Zod mock API for local development
- Vercel serverless API routes for production
- Lucide React icons

## Run

```bash
npm install
npm run dev
```

The web app runs at `http://localhost:5173`.
The API runs at `http://localhost:5174` and is proxied through Vite at `/api`.

Production uses the same mock data builders through `api/[...path].ts`, so the deployed dashboard is not a static mockup.

## API

- `GET /api/health`
- `GET /api/dashboard?range=may-2025&q=Acme&status=Completed`
- `GET /api/dashboard/export?range=may-2025&status=Completed`

Mock data lives in `server/data/mockDashboard.ts`, not inside UI components.

## Checks

```bash
npm run lint
npm run build
```
