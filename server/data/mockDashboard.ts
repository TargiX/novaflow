import type {
  ChannelPeriodId,
  ChannelPoint,
  CurrentUser,
  CustomerGrowthPoint,
  DashboardQuery,
  DashboardRangeId,
  DashboardResponse,
  GoalPeriodId,
  MetricSummary,
  PerformancePoint,
  RangeOption,
  RevenueGoal,
  Transaction,
  TransactionStatus,
} from '../../shared/dashboard.js'
import { transactionStatuses } from '../../shared/dashboard.js'

const rangeOptions: RangeOption[] = [
  {
    id: 'may-2025',
    label: 'May 1 - May 31, 2025',
    shortLabel: 'May 2025',
    comparisonLabel: 'vs Apr 1 - Apr 30',
  },
  {
    id: 'june-2025',
    label: 'Jun 1 - Jun 30, 2025',
    shortLabel: 'June 2025',
    comparisonLabel: 'vs May 1 - May 31',
  },
  {
    id: 'july-2025',
    label: 'Jul 1 - Jul 31, 2025',
    shortLabel: 'July 2025',
    comparisonLabel: 'vs Jun 1 - Jun 30',
  },
]

const currentUser: CurrentUser = {
  name: 'Ethan Brooks',
  role: 'Admin',
  avatarUrl: '/avatar-ethan.png',
}

interface DashboardSeed {
  metrics: MetricSummary[]
  monthlyPerformance: PerformancePoint[]
  weeklyPerformance: PerformancePoint[]
  revenueGoals: Record<GoalPeriodId, RevenueGoal>
  customerGrowth: CustomerGrowthPoint[]
  channelPerformance: Record<ChannelPeriodId, ChannelPoint[]>
  transactions: Transaction[]
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function makePerformance(
  revenue: number[],
  orders: number[],
  highlightLabel: string,
): PerformancePoint[] {
  return months.map((label, index) => ({
    label,
    revenue: revenue[index] ?? 0,
    orders: orders[index] ?? 0,
    highlighted: label === highlightLabel,
  }))
}

function makeCustomerGrowth(
  newCustomers: number[],
  returningCustomers: number[],
): CustomerGrowthPoint[] {
  return months.map((label, index) => ({
    label,
    newCustomers: newCustomers[index] ?? 0,
    returningCustomers: returningCustomers[index] ?? 0,
  }))
}

function makeChannels(
  direct: number[],
  organic: number[],
  paid: number[],
  referral: number[],
): ChannelPoint[] {
  return months.map((label, index) => ({
    label,
    direct: direct[index] ?? 0,
    organic: organic[index] ?? 0,
    paid: paid[index] ?? 0,
    referral: referral[index] ?? 0,
  }))
}

function goal(
  period: GoalPeriodId,
  periodLabel: string,
  achieved: number,
  target: number,
  comparisonPercent: number,
): RevenueGoal {
  return {
    period,
    periodLabel,
    achieved,
    target,
    remaining: target - achieved,
    percentage: Math.ceil((achieved / target) * 100),
    statusLabel: achieved / target >= 0.7 ? 'On track' : 'Needs focus',
    comparisonPercent,
  }
}

const transactionsMay: Transaction[] = [
  {
    id: 'trn_98765',
    orderId: '#NF-98765',
    customer: { name: 'Acme Corporation', initials: 'AC', tone: 'navy' },
    date: 'May 31, 2025',
    category: 'Enterprise Plan',
    status: 'Completed',
    total: 4250,
  },
  {
    id: 'trn_98764',
    orderId: '#NF-98764',
    customer: { name: 'BrightWave LLC', initials: 'BW', tone: 'blue' },
    date: 'May 30, 2025',
    category: 'Growth Plan',
    status: 'Processing',
    total: 2150,
  },
  {
    id: 'trn_98763',
    orderId: '#NF-98763',
    customer: { name: 'Summit Industries', initials: 'SI', tone: 'teal' },
    date: 'May 29, 2025',
    category: 'Add-ons',
    status: 'Refunded',
    total: 320,
  },
  {
    id: 'trn_98762',
    orderId: '#NF-98762',
    customer: { name: 'Northfield Partners', initials: 'NP', tone: 'navy' },
    date: 'May 28, 2025',
    category: 'Enterprise Plan',
    status: 'Completed',
    total: 5600,
  },
  {
    id: 'trn_98761',
    orderId: '#NF-98761',
    customer: { name: 'Vertex Solutions', initials: 'VS', tone: 'teal-dark' },
    date: 'May 27, 2025',
    category: 'Growth Plan',
    status: 'Pending',
    total: 1850,
  },
  {
    id: 'trn_98760',
    orderId: '#NF-98760',
    customer: { name: 'Pioneer Labs', initials: 'PL', tone: 'violet' },
    date: 'May 26, 2025',
    category: 'Enterprise Plan',
    status: 'Completed',
    total: 7400,
  },
  {
    id: 'trn_98759',
    orderId: '#NF-98759',
    customer: { name: 'Cobalt Studio', initials: 'CS', tone: 'blue' },
    date: 'May 25, 2025',
    category: 'Seat Expansion',
    status: 'Processing',
    total: 980,
  },
  {
    id: 'trn_98758',
    orderId: '#NF-98758',
    customer: { name: 'Harbor Retail Group', initials: 'HR', tone: 'teal' },
    date: 'May 24, 2025',
    category: 'Growth Plan',
    status: 'Completed',
    total: 3120,
  },
]

const dashboardSeeds: Record<DashboardRangeId, DashboardSeed> = {
  'may-2025': {
    metrics: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$128,450',
        changePercent: 12.4,
        comparisonLabel: 'vs Apr 1 - Apr 30',
        tone: 'blue',
        icon: 'revenue',
        sparkline: [32, 38, 54, 49, 78, 52, 92, 69, 63, 76],
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: '4,256',
        changePercent: 8.7,
        comparisonLabel: 'vs Apr 1 - Apr 30',
        tone: 'cyan',
        icon: 'customers',
        sparkline: [58, 52, 54, 45, 43, 48, 71, 56, 68, 88],
      },
      {
        id: 'orders',
        title: 'Orders',
        value: '2,340',
        changePercent: 15.2,
        comparisonLabel: 'vs Apr 1 - Apr 30',
        tone: 'coral',
        icon: 'orders',
        sparkline: [36, 43, 41, 55, 52, 74, 50, 56, 63, 49],
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: '3.62%',
        changePercent: 1.1,
        comparisonLabel: 'vs Apr 1 - Apr 30',
        tone: 'violet',
        icon: 'conversion',
        sparkline: [42, 51, 49, 66, 58, 83, 62, 57, 72, 82],
      },
    ],
    monthlyPerformance: makePerformance(
      [58_000, 72_000, 69_000, 82_000, 112_000, 94_000, 112_340, 102_000, 78_000, 99_000, 88_000, 0],
      [1_420, 1_820, 1_680, 1_940, 2_520, 2_360, 2_180, 2_420, 2_010, 2_340, 2_080, 2_240],
      'Jul',
    ),
    weeklyPerformance: [
      { label: 'W1', revenue: 24_200, orders: 420 },
      { label: 'W2', revenue: 31_600, orders: 560 },
      { label: 'W3', revenue: 28_900, orders: 510 },
      { label: 'W4', revenue: 43_750, orders: 850, highlighted: true },
    ],
    revenueGoals: {
      month: goal('month', 'This Month', 128_450, 180_000, 12),
      quarter: goal('quarter', 'This Quarter', 378_900, 500_000, 18),
    },
    customerGrowth: makeCustomerGrowth(
      [320, 860, 1_420, 990, 1_920, 3_260, 1_760, 2_030, 3_530, 2_470, 3_020, 3_520],
      [1_260, 1_520, 2_180, 680, 820, 1_740, 910, 860, 1_920, 960, 1_270, 1_680],
    ),
    channelPerformance: {
      'this-year': makeChannels(
        [18_000, 20_000, 22_000, 25_000, 18_000, 21_000, 24_000, 19_000, 21_000, 18_000, 20_000, 22_000],
        [14_000, 15_000, 18_000, 20_000, 13_000, 17_000, 15_000, 14_000, 16_000, 15_000, 14_000, 16_000],
        [30_000, 31_000, 30_000, 31_000, 28_000, 31_000, 29_000, 30_000, 29_000, 28_000, 29_000, 30_000],
        [18_000, 19_000, 20_000, 22_000, 20_000, 24_000, 31_000, 21_000, 23_000, 22_000, 20_000, 24_000],
      ),
      'last-year': makeChannels(
        [14_000, 15_000, 18_000, 19_000, 15_000, 17_000, 18_000, 16_000, 17_000, 15_000, 18_000, 19_000],
        [11_000, 12_000, 14_000, 15_000, 10_000, 13_000, 12_000, 11_000, 12_000, 11_000, 12_000, 13_000],
        [25_000, 26_000, 25_000, 27_000, 23_000, 26_000, 25_000, 24_000, 25_000, 23_000, 25_000, 26_000],
        [12_000, 13_000, 14_000, 15_000, 14_000, 16_000, 18_000, 15_000, 16_000, 15_000, 14_000, 17_000],
      ),
    },
    transactions: transactionsMay,
  },
  'june-2025': {
    metrics: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$136,220',
        changePercent: 6.1,
        comparisonLabel: 'vs May 1 - May 31',
        tone: 'blue',
        icon: 'revenue',
        sparkline: [41, 50, 52, 64, 56, 75, 71, 82, 79, 88],
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: '4,611',
        changePercent: 8.3,
        comparisonLabel: 'vs May 1 - May 31',
        tone: 'cyan',
        icon: 'customers',
        sparkline: [49, 53, 55, 59, 61, 69, 64, 72, 76, 84],
      },
      {
        id: 'orders',
        title: 'Orders',
        value: '2,615',
        changePercent: 11.8,
        comparisonLabel: 'vs May 1 - May 31',
        tone: 'coral',
        icon: 'orders',
        sparkline: [38, 42, 49, 45, 61, 58, 70, 66, 76, 73],
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: '3.84%',
        changePercent: 0.6,
        comparisonLabel: 'vs May 1 - May 31',
        tone: 'violet',
        icon: 'conversion',
        sparkline: [52, 55, 58, 56, 61, 65, 62, 70, 74, 79],
      },
    ],
    monthlyPerformance: makePerformance(
      [64_000, 76_000, 82_000, 86_000, 104_000, 136_220, 118_000, 121_000, 109_000, 125_000, 112_000, 0],
      [1_530, 1_760, 1_980, 2_040, 2_300, 2_615, 2_360, 2_420, 2_220, 2_500, 2_280, 2_390],
      'Jun',
    ),
    weeklyPerformance: [
      { label: 'W1', revenue: 32_800, orders: 610 },
      { label: 'W2', revenue: 29_400, orders: 560 },
      { label: 'W3', revenue: 37_120, orders: 720, highlighted: true },
      { label: 'W4', revenue: 36_900, orders: 725 },
    ],
    revenueGoals: {
      month: goal('month', 'This Month', 136_220, 190_000, 10),
      quarter: goal('quarter', 'This Quarter', 410_600, 535_000, 16),
    },
    customerGrowth: makeCustomerGrowth(
      [460, 920, 1_240, 1_420, 2_050, 2_440, 2_140, 2_350, 3_010, 2_760, 3_120, 3_780],
      [1_140, 1_420, 1_860, 920, 1_040, 1_960, 1_160, 1_010, 1_720, 1_300, 1_420, 1_910],
    ),
    channelPerformance: {
      'this-year': makeChannels(
        [19_000, 21_000, 24_000, 27_000, 20_000, 25_000, 25_000, 21_000, 23_000, 19_000, 21_000, 24_000],
        [15_000, 16_000, 19_000, 22_000, 14_000, 19_000, 17_000, 16_000, 17_000, 16_000, 15_000, 18_000],
        [31_000, 32_000, 31_000, 34_000, 29_000, 33_000, 31_000, 31_000, 30_000, 29_000, 30_000, 32_000],
        [19_000, 20_000, 22_000, 24_000, 21_000, 27_000, 33_000, 22_000, 25_000, 24_000, 22_000, 26_000],
      ),
      'last-year': makeChannels(
        [15_000, 16_000, 19_000, 20_000, 16_000, 18_000, 19_000, 17_000, 18_000, 16_000, 19_000, 20_000],
        [12_000, 13_000, 15_000, 16_000, 11_000, 14_000, 13_000, 12_000, 13_000, 12_000, 13_000, 14_000],
        [26_000, 27_000, 26_000, 28_000, 24_000, 27_000, 26_000, 25_000, 26_000, 24_000, 26_000, 27_000],
        [13_000, 14_000, 15_000, 16_000, 15_000, 17_000, 19_000, 16_000, 17_000, 16_000, 15_000, 18_000],
      ),
    },
    transactions: transactionsMay.map((transaction, index) => ({
      ...transaction,
      id: transaction.id.replace('987', '996'),
      orderId: `#NF-996${5 - index}`,
      date: transaction.date.replace('May', 'Jun'),
      total: Math.round(transaction.total * (1 + index * 0.04)),
    })),
  },
  'july-2025': {
    metrics: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$142,960',
        changePercent: 4.9,
        comparisonLabel: 'vs Jun 1 - Jun 30',
        tone: 'blue',
        icon: 'revenue',
        sparkline: [48, 51, 66, 61, 75, 78, 72, 86, 83, 91],
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: '4,908',
        changePercent: 6.4,
        comparisonLabel: 'vs Jun 1 - Jun 30',
        tone: 'cyan',
        icon: 'customers',
        sparkline: [56, 57, 60, 64, 68, 72, 75, 79, 76, 88],
      },
      {
        id: 'orders',
        title: 'Orders',
        value: '2,744',
        changePercent: 4.9,
        comparisonLabel: 'vs Jun 1 - Jun 30',
        tone: 'coral',
        icon: 'orders',
        sparkline: [42, 46, 55, 49, 63, 66, 74, 71, 78, 82],
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: '3.91%',
        changePercent: 0.3,
        comparisonLabel: 'vs Jun 1 - Jun 30',
        tone: 'violet',
        icon: 'conversion',
        sparkline: [55, 57, 60, 61, 65, 68, 66, 72, 75, 81],
      },
    ],
    monthlyPerformance: makePerformance(
      [69_000, 82_000, 86_000, 93_000, 116_000, 128_000, 142_960, 126_000, 114_000, 131_000, 121_000, 0],
      [1_620, 1_920, 2_040, 2_160, 2_430, 2_590, 2_744, 2_520, 2_330, 2_640, 2_410, 2_520],
      'Jul',
    ),
    weeklyPerformance: [
      { label: 'W1', revenue: 34_500, orders: 640 },
      { label: 'W2', revenue: 35_900, orders: 692 },
      { label: 'W3', revenue: 31_880, orders: 604 },
      { label: 'W4', revenue: 40_680, orders: 808, highlighted: true },
    ],
    revenueGoals: {
      month: goal('month', 'This Month', 142_960, 195_000, 9),
      quarter: goal('quarter', 'This Quarter', 426_100, 550_000, 15),
    },
    customerGrowth: makeCustomerGrowth(
      [520, 1_020, 1_510, 1_640, 2_160, 2_620, 2_320, 2_580, 3_240, 2_980, 3_420, 3_940],
      [1_220, 1_480, 2_020, 1_050, 1_150, 2_050, 1_240, 1_180, 1_840, 1_420, 1_560, 2_020],
    ),
    channelPerformance: {
      'this-year': makeChannels(
        [20_000, 22_000, 25_000, 28_000, 21_000, 26_000, 27_000, 22_000, 24_000, 20_000, 22_000, 25_000],
        [16_000, 17_000, 20_000, 23_000, 15_000, 20_000, 19_000, 17_000, 18_000, 17_000, 16_000, 19_000],
        [32_000, 33_000, 33_000, 35_000, 30_000, 34_000, 33_000, 32_000, 31_000, 30_000, 31_000, 33_000],
        [20_000, 21_000, 23_000, 25_000, 22_000, 28_000, 34_000, 23_000, 26_000, 25_000, 23_000, 27_000],
      ),
      'last-year': makeChannels(
        [16_000, 17_000, 20_000, 21_000, 17_000, 19_000, 20_000, 18_000, 19_000, 17_000, 20_000, 21_000],
        [13_000, 14_000, 16_000, 17_000, 12_000, 15_000, 14_000, 13_000, 14_000, 13_000, 14_000, 15_000],
        [27_000, 28_000, 27_000, 29_000, 25_000, 28_000, 27_000, 26_000, 27_000, 25_000, 27_000, 28_000],
        [14_000, 15_000, 16_000, 17_000, 16_000, 18_000, 20_000, 17_000, 18_000, 17_000, 16_000, 19_000],
      ),
    },
    transactions: transactionsMay.map((transaction, index) => ({
      ...transaction,
      id: transaction.id.replace('987', '100'),
      orderId: `#NF-100${5 - index}`,
      date: transaction.date.replace('May', 'Jul'),
      total: Math.round(transaction.total * (1.08 + index * 0.03)),
    })),
  },
}

function getSeed(range: DashboardRangeId | undefined): [RangeOption, DashboardSeed] {
  const selectedRange = rangeOptions.find((option) => option.id === range) ?? rangeOptions[0]
  return [selectedRange, dashboardSeeds[selectedRange.id]]
}

function matchesTransaction(transaction: Transaction, q: string, status?: TransactionStatus) {
  const normalizedQuery = q.trim().toLowerCase()
  const statusMatches = status ? transaction.status === status : true

  if (!normalizedQuery) {
    return statusMatches
  }

  const searchable = [
    transaction.orderId,
    transaction.customer.name,
    transaction.category,
    transaction.status,
    transaction.date,
  ]
    .join(' ')
    .toLowerCase()

  return statusMatches && searchable.includes(normalizedQuery)
}

export function buildDashboardResponse(query: DashboardQuery): DashboardResponse {
  const [selectedRange, seed] = getSeed(query.range)
  const filteredTransactions = seed.transactions.filter((transaction) =>
    matchesTransaction(transaction, query.q ?? '', query.status),
  )

  return {
    generatedAt: new Date().toISOString(),
    currentUser,
    rangeOptions,
    selectedRange,
    filters: {
      statuses: [...transactionStatuses],
    },
    metrics: seed.metrics,
    performance: {
      monthly: seed.monthlyPerformance,
      weekly: seed.weeklyPerformance,
    },
    revenueGoals: seed.revenueGoals,
    customerGrowth: seed.customerGrowth,
    channelPerformance: seed.channelPerformance,
    transactions: filteredTransactions,
  }
}

export function buildTransactionsCsv(query: DashboardQuery) {
  const dashboard = buildDashboardResponse(query)
  const headers = ['Order ID', 'Customer', 'Date', 'Category', 'Status', 'Total']
  const rows = dashboard.transactions.map((transaction) => [
    transaction.orderId,
    transaction.customer.name,
    transaction.date,
    transaction.category,
    transaction.status,
    transaction.total.toFixed(2),
  ])

  return [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')
}

export function isTransactionStatus(value: unknown): value is TransactionStatus {
  return typeof value === 'string' && transactionStatuses.includes(value as TransactionStatus)
}

export function isChannelPeriod(value: unknown): value is ChannelPeriodId {
  return value === 'this-year' || value === 'last-year'
}
