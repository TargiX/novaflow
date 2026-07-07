import {
  DollarSign,
  Info,
  ShoppingBag,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import type { MetricIcon, MetricSummary } from '../../../shared/dashboard.ts'

interface MetricCardProps {
  metric: MetricSummary
}

const iconMap: Record<MetricIcon, typeof DollarSign> = {
  revenue: DollarSign,
  customers: UsersRound,
  orders: ShoppingBag,
  conversion: Target,
}

function sparklineGeometry(values: number[]) {
  const width = 130
  const height = 30
  const topPadding = 9
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min || 1

  const points = values.map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width
      const y = topPadding + height - ((value - min) / spread) * height
      return { x, y }
    })

  const path = points.reduce((commands, point, index) => {
    if (index === 0) {
      return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    }

    const previous = points[index - 1]
    const controlX = previous.x + (point.x - previous.x) * 0.5

    return `${commands} C ${controlX.toFixed(2)} ${previous.y.toFixed(2)}, ${controlX.toFixed(2)} ${point.y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
  }, '')

  return { path, lastPoint: points.at(-1) ?? { x: width, y: height / 2 } }
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.icon]
  const sparkline = sparklineGeometry(metric.sparkline)

  return (
    <article className={`metric-card tone-${metric.tone}`}>
      <span className="metric-icon" aria-hidden="true">
        <Icon size={30} strokeWidth={2} />
      </span>

      <Info className="metric-info-icon" size={18} aria-label={`${metric.title} details`} />

      <div className="metric-copy">
        <h2>{metric.title}</h2>
        <strong>{metric.value}</strong>
      </div>

      <div className="metric-change-row">
        <span className="metric-change">
          <TrendingUp size={14} aria-hidden="true" />
          {metric.changePercent.toFixed(1)}%
        </span>
        <span>{metric.comparisonLabel}</span>
      </div>

      <svg className="sparkline" viewBox="0 0 130 48" role="img" aria-label={`${metric.title} trend`}>
        <path d={sparkline.path} />
        <circle cx={sparkline.lastPoint.x} cy={sparkline.lastPoint.y} r="3.4" />
      </svg>
    </article>
  )
}
