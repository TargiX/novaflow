export const dashboardRangeIds = ['may-2025', 'june-2025', 'july-2025'] as const
export type DashboardRangeId = (typeof dashboardRangeIds)[number]

export const transactionStatuses = [
  'Completed',
  'Processing',
  'Refunded',
  'Pending',
] as const
export type TransactionStatus = (typeof transactionStatuses)[number]

export const goalPeriodIds = ['month', 'quarter'] as const
export type GoalPeriodId = (typeof goalPeriodIds)[number]

export const channelPeriodIds = ['this-year', 'last-year'] as const
export type ChannelPeriodId = (typeof channelPeriodIds)[number]

export type MetricTone = 'blue' | 'cyan' | 'coral' | 'violet'
export type MetricIcon = 'revenue' | 'customers' | 'orders' | 'conversion'

export interface RangeOption {
  id: DashboardRangeId
  label: string
  shortLabel: string
  comparisonLabel: string
}

export interface CurrentUser {
  name: string
  role: string
  avatarUrl: string
}

export interface MetricSummary {
  id: string
  title: string
  value: string
  changePercent: number
  comparisonLabel: string
  tone: MetricTone
  icon: MetricIcon
  sparkline: number[]
}

export interface PerformancePoint {
  label: string
  revenue: number
  orders: number
  highlighted?: boolean
}

export interface CustomerGrowthPoint {
  label: string
  newCustomers: number
  returningCustomers: number
}

export interface ChannelPoint {
  label: string
  direct: number
  organic: number
  paid: number
  referral: number
}

export interface RevenueGoal {
  period: GoalPeriodId
  periodLabel: string
  achieved: number
  target: number
  remaining: number
  percentage: number
  statusLabel: string
  comparisonPercent: number
}

export interface TransactionCustomer {
  name: string
  initials: string
  tone: string
}

export interface Transaction {
  id: string
  orderId: string
  customer: TransactionCustomer
  date: string
  category: string
  status: TransactionStatus
  total: number
}

export interface DashboardFilters {
  statuses: TransactionStatus[]
}

export interface DashboardResponse {
  generatedAt: string
  currentUser: CurrentUser
  rangeOptions: RangeOption[]
  selectedRange: RangeOption
  filters: DashboardFilters
  metrics: MetricSummary[]
  performance: {
    monthly: PerformancePoint[]
    weekly: PerformancePoint[]
  }
  revenueGoals: Record<GoalPeriodId, RevenueGoal>
  customerGrowth: CustomerGrowthPoint[]
  channelPerformance: Record<ChannelPeriodId, ChannelPoint[]>
  transactions: Transaction[]
}

export interface DashboardQuery {
  range?: DashboardRangeId
  q?: string
  status?: TransactionStatus
}
