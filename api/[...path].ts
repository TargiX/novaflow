import { dashboardRangeIds } from '../shared/dashboard.js'
import type { DashboardQuery, DashboardRangeId } from '../shared/dashboard.js'
import {
  buildDashboardResponse,
  buildTransactionsCsv,
  isTransactionStatus,
} from '../server/data/mockDashboard.js'

interface ApiRequest {
  method?: string
  url?: string
}

interface ApiResponse {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

const dashboardRangeSet = new Set<string>(dashboardRangeIds)

export default function handler(req: ApiRequest, res: ApiResponse) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const url = new URL(req.url ?? '/', 'https://novaflow.local')
  const path = normalizeApiPath(url.pathname)

  if (path === '/health') {
    sendJson(res, 200, {
      ok: true,
      service: 'novaflow-api',
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (path === '/dashboard') {
    const parsed = parseDashboardQuery(url.searchParams)

    if (parsed.ok === false) {
      sendJson(res, 400, parsed.body)
      return
    }

    sendJson(res, 200, buildDashboardResponse(parsed.query))
    return
  }

  if (path === '/dashboard/export') {
    const parsed = parseDashboardQuery(url.searchParams)

    if (parsed.ok === false) {
      sendJson(res, 400, parsed.body)
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="novaflow-transactions.csv"')
    res.end(buildTransactionsCsv(parsed.query))
    return
  }

  sendJson(res, 404, { error: 'Not found' })
}

function setCorsHeaders(res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function normalizeApiPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  if (normalized === '/api') {
    return '/'
  }

  if (normalized.startsWith('/api/')) {
    return normalized.slice('/api'.length)
  }

  return normalized
}

function parseDashboardQuery(searchParams: URLSearchParams):
  | { ok: true; query: DashboardQuery }
  | { ok: false; body: { error: string; details: { fieldErrors: Record<string, string[]> } } } {
  const range = searchParams.get('range')?.trim()
  const q = searchParams.get('q')?.trim()
  const status = searchParams.get('status')?.trim()
  const fieldErrors: Record<string, string[]> = {}

  if (range && !dashboardRangeSet.has(range)) {
    fieldErrors.range = ['Invalid dashboard range']
  }

  if (q && q.length > 120) {
    fieldErrors.q = ['Search query must be 120 characters or less']
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      body: {
        error: 'Invalid dashboard query',
        details: { fieldErrors },
      },
    }
  }

  return {
    ok: true,
    query: {
      range: range as DashboardRangeId | undefined,
      q: q || undefined,
      status: isTransactionStatus(status) ? status : undefined,
    },
  }
}

function sendJson(res: ApiResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}
