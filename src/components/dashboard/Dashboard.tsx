import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  ChannelPeriodId,
  DashboardQuery,
  DashboardRangeId,
  GoalPeriodId,
  TransactionStatus,
} from '../../../shared/dashboard.ts'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import {
  downloadDashboardExport,
  fetchDashboard,
} from '../../lib/api'
import { ChannelPerformance } from './ChannelPerformance'
import { CustomerGrowth } from './CustomerGrowth'
import { MetricCard } from './MetricCard'
import { PerformanceInsights } from './PerformanceInsights'
import { RevenueGoal } from './RevenueGoal'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { TransactionsTable } from './TransactionsTable'

type StatusFilter = 'All' | TransactionStatus
type CustomerWindow = '12' | '6'

export function Dashboard() {
  const [range, setRange] = useState<DashboardRangeId>('may-2025')
  const [globalSearch, setGlobalSearch] = useState('')
  const [transactionSearch, setTransactionSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriodId>('month')
  const [customerWindow, setCustomerWindow] = useState<CustomerWindow>('12')
  const [channelPeriod, setChannelPeriod] = useState<ChannelPeriodId>('this-year')
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(() => new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const debouncedGlobalSearch = useDebouncedValue(globalSearch, 250)
  const debouncedTransactionSearch = useDebouncedValue(transactionSearch, 250)

  const dashboardQuery = useMemo<DashboardQuery>(() => {
    const q = debouncedTransactionSearch || debouncedGlobalSearch || undefined
    return {
      range,
      q,
      status: statusFilter === 'All' ? undefined : statusFilter,
    }
  }, [debouncedGlobalSearch, debouncedTransactionSearch, range, statusFilter])

  const dashboardRequest = useQuery({
    queryKey: ['dashboard', dashboardQuery],
    queryFn: () => fetchDashboard(dashboardQuery),
  })

  const dashboard = dashboardRequest.data

  function toggleRow(id: string) {
    setSelectedRows((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleAll(ids: string[]) {
    setSelectedRows((current) => {
      const next = new Set(current)
      const allSelected = ids.length > 0 && ids.every((id) => next.has(id))

      ids.forEach((id) => {
        if (allSelected) {
          next.delete(id)
        } else {
          next.add(id)
        }
      })

      return next
    })
  }

  async function handleExport() {
    setIsExporting(true)
    try {
      await downloadDashboardExport(dashboardQuery)
      setNotice('CSV export generated')
    } catch {
      setNotice('Export failed. API is still running locally.')
    } finally {
      setIsExporting(false)
      window.setTimeout(() => setNotice(null), 2400)
    }
  }

  function handleUpgrade() {
    setNotice('Pro demo enabled for this session')
    window.setTimeout(() => setNotice(null), 2400)
  }

  if (dashboardRequest.isLoading || !dashboard) {
    return (
      <div className="app-frame">
        <Sidebar onUpgrade={handleUpgrade} />
        <main className="main-content loading-content">
          <div className="loading-panel">
            <span className="loader" />
            <strong>Loading NovaFlow analytics</strong>
            <p>Fetching dashboard data from the local API.</p>
          </div>
        </main>
      </div>
    )
  }

  if (dashboardRequest.isError) {
    return (
      <div className="app-frame">
        <Sidebar onUpgrade={handleUpgrade} />
        <main className="main-content loading-content">
          <div className="loading-panel error-panel">
            <strong>Dashboard API is unavailable</strong>
            <p>Start the project with npm run dev to run both API and web app.</p>
            <button type="button" className="primary-button" onClick={() => dashboardRequest.refetch()}>
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-frame">
      <Sidebar onUpgrade={handleUpgrade} />

      <main className="main-content">
        <Topbar
          dashboard={dashboard}
          range={range}
          search={globalSearch}
          onRangeChange={setRange}
          onSearchChange={setGlobalSearch}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {dashboardRequest.isFetching ? <div className="refresh-line" aria-hidden="true" /> : null}

        <section className="metrics-grid" aria-label="Summary metrics">
          {dashboard.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="insights-grid" aria-label="Revenue insights">
          <PerformanceInsights
            monthly={dashboard.performance.monthly}
            weekly={dashboard.performance.weekly}
          />
          <RevenueGoal
            goals={dashboard.revenueGoals}
            period={goalPeriod}
            onPeriodChange={setGoalPeriod}
          />
        </section>

        <section className="lower-grid" aria-label="Growth and channel analytics">
          <CustomerGrowth
            data={dashboard.customerGrowth}
            window={customerWindow}
            onWindowChange={setCustomerWindow}
          />
          <ChannelPerformance
            data={dashboard.channelPerformance}
            period={channelPeriod}
            onPeriodChange={setChannelPeriod}
          />
        </section>

        <TransactionsTable
          transactions={dashboard.transactions}
          statuses={dashboard.filters.statuses}
          query={transactionSearch}
          statusFilter={statusFilter}
          selectedRows={selectedRows}
          showAll={showAllTransactions}
          onQueryChange={setTransactionSearch}
          onStatusFilterChange={setStatusFilter}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          onShowAllChange={setShowAllTransactions}
        />
      </main>

      {notice ? <div className="toast" role="status">{notice}</div> : null}
    </div>
  )
}
