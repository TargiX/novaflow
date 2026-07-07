import { TrendingUp } from 'lucide-react'
import type { GoalPeriodId, RevenueGoal as RevenueGoalData } from '../../../shared/dashboard.ts'
import { formatCurrency } from '../../lib/format'
import { Panel, SelectAction } from './Panel'

interface RevenueGoalProps {
  goals: Record<GoalPeriodId, RevenueGoalData>
  period: GoalPeriodId
  onPeriodChange: (period: GoalPeriodId) => void
}

const periodOptions: { label: string; value: GoalPeriodId }[] = [
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
]

export function RevenueGoal({ goals, period, onPeriodChange }: RevenueGoalProps) {
  const goal = goals[period]
  const segmentCount = 18
  const filledSegments = Math.round((goal.percentage / 100) * segmentCount)
  const segments = Array.from({ length: segmentCount }, (_, index) => {
    const angle = -82 + (index * 164) / (segmentCount - 1)
    const radians = (angle * Math.PI) / 180
    const centerX = 180 + Math.sin(radians) * 150
    const centerY = 156 - Math.cos(radians) * 150
    const active = index < filledSegments

    return {
      id: index,
      x: centerX - 12,
      y: centerY - 21,
      angle,
      color: active ? `hsl(${215 + index * 1.8} 96% ${52 + index * 0.9}%)` : '#E9EDF4',
    }
  })

  return (
    <Panel
      title="Revenue Goal"
      className="goal-panel"
      action={
        <SelectAction
          value={period}
          label="Revenue goal period"
          options={periodOptions}
          onChange={onPeriodChange}
        />
      }
    >
      <div className="goal-gauge" aria-label={`${goal.percentage}% of revenue goal`}>
        <svg className="goal-arc" viewBox="0 -24 360 208" aria-hidden="true">
          {segments.map((segment) => (
            <rect
              key={segment.id}
              x={segment.x}
              y={segment.y}
              width="24"
              height="42"
              rx="8"
              fill={segment.color}
              transform={`rotate(${segment.angle} ${segment.x + 12} ${segment.y + 21})`}
            />
          ))}
        </svg>
        <div className="goal-center">
          <strong>{goal.percentage}%</strong>
          <span>of {formatCurrency(goal.target)} goal</span>
        </div>
      </div>

      <div className="goal-breakdown">
        <div>
          <span>Achieved</span>
          <strong>{formatCurrency(goal.achieved)}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{formatCurrency(goal.remaining)}</strong>
        </div>
      </div>

      <div className="goal-status">
        <span>
          <TrendingUp size={15} aria-hidden="true" />
          {goal.statusLabel}
        </span>
        <strong>{goal.comparisonPercent}%</strong>
        <small>vs last month</small>
      </div>
    </Panel>
  )
}
