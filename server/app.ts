import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import { dashboardRangeIds } from '../shared/dashboard.js'
import type { DashboardQuery } from '../shared/dashboard.js'
import {
  buildDashboardResponse,
  buildTransactionsCsv,
  isTransactionStatus,
} from './data/mockDashboard.js'

const dashboardQuerySchema = z.object({
  range: z.enum(dashboardRangeIds).optional(),
  q: z.string().trim().max(120).optional(),
  status: z.string().optional(),
})

const dashboardRouter = express.Router()

dashboardRouter.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'novaflow-api', timestamp: new Date().toISOString() })
})

dashboardRouter.get('/dashboard', (req, res) => {
  const parsed = dashboardQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid dashboard query', details: parsed.error.flatten() })
    return
  }

  const status = isTransactionStatus(parsed.data.status) ? parsed.data.status : undefined
  const query: DashboardQuery = {
    range: parsed.data.range,
    q: parsed.data.q,
    status,
  }

  res.json(buildDashboardResponse(query))
})

dashboardRouter.get('/dashboard/export', (req, res) => {
  const parsed = dashboardQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid export query', details: parsed.error.flatten() })
    return
  }

  const status = isTransactionStatus(parsed.data.status) ? parsed.data.status : undefined
  const csv = buildTransactionsCsv({
    range: parsed.data.range,
    q: parsed.data.q,
    status,
  })

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="novaflow-transactions.csv"')
  res.send(csv)
})

export function createDashboardApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors({ origin: true }))
  app.use(express.json())
  app.use('/api', dashboardRouter)
  app.use(dashboardRouter)

  return app
}
