import type {
  DashboardQuery,
  DashboardResponse,
  TransactionStatus,
} from '../../shared/dashboard.ts'

function toSearchParams(query: DashboardQuery) {
  const params = new URLSearchParams()

  if (query.range) {
    params.set('range', query.range)
  }

  if (query.q) {
    params.set('q', query.q)
  }

  if (query.status) {
    params.set('status', query.status)
  }

  return params.toString()
}

export async function fetchDashboard(query: DashboardQuery): Promise<DashboardResponse> {
  const search = toSearchParams(query)
  const response = await fetch(`/api/dashboard${search ? `?${search}` : ''}`)

  if (!response.ok) {
    throw new Error('Dashboard API request failed')
  }

  return response.json() as Promise<DashboardResponse>
}

export async function downloadDashboardExport(query: DashboardQuery) {
  const search = toSearchParams(query)
  const response = await fetch(`/api/dashboard/export${search ? `?${search}` : ''}`)

  if (!response.ok) {
    throw new Error('Export request failed')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'novaflow-transactions.csv'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function normalizeStatus(value: string): TransactionStatus | undefined {
  if (
    value === 'Completed' ||
    value === 'Processing' ||
    value === 'Refunded' ||
    value === 'Pending'
  ) {
    return value
  }

  return undefined
}
