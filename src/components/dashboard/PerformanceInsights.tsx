import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useState } from 'react'
import type { PerformancePoint } from '../../../shared/dashboard.ts'
import { formatCompact, formatCurrency, formatNumber } from '../../lib/format'
import { Panel, SelectAction } from './Panel'

type PerformanceMode = 'monthly' | 'weekly'

interface PerformanceInsightsProps {
  monthly: PerformancePoint[]
  weekly: PerformancePoint[]
}

const performanceModeOptions: { label: string; value: PerformanceMode }[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
]

export function PerformanceInsights({
  monthly,
  weekly,
}: PerformanceInsightsProps) {
  const [mode, setMode] = useState<PerformanceMode>('monthly')
  const [isPointerInsideChart, setIsPointerInsideChart] = useState(false)
  const data = mode === 'monthly' ? monthly : weekly
  const highlightedPoint = data.find((point) => point.highlighted) ?? data[0]
  const showStaticTooltip = mode === 'monthly' && !isPointerInsideChart && highlightedPoint

  return (
    <Panel
      title="Performance Insights"
      className="performance-panel"
      action={
        <SelectAction
          value={mode}
          label="Performance period"
          options={performanceModeOptions}
          onChange={setMode}
        />
      }
    >
      <div className="chart-legend">
        <span><i className="legend-dot blue" />Revenue</span>
        <span><i className="legend-dot light-blue" />Orders</span>
      </div>

      <div
        className="chart-wrap performance-chart"
        onPointerEnter={() => setIsPointerInsideChart(true)}
        onPointerLeave={() => setIsPointerInsideChart(false)}
      >
        <span className="performance-axis-label revenue-axis-label">Revenue ($)</span>
        <span className="performance-axis-label orders-axis-label">Orders</span>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 14, right: 16, bottom: 0, left: 2 }}>
            <defs>
              <linearGradient id="barBlue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#62A7FF" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#D8E9FF" stopOpacity={0.62} />
              </linearGradient>
              <linearGradient id="barActive" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#086DFF" stopOpacity={1} />
                <stop offset="100%" stopColor="#086DFF" stopOpacity={0.82} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EDF1F7" />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E7ECF4' }} tick={{ fill: '#737B8C', fontSize: 13 }} />
            <YAxis
              yAxisId="revenue"
              width={54}
              domain={[0, 150000]}
              ticks={[0, 30000, 60000, 90000, 120000, 150000]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#737B8C', fontSize: 13 }}
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              width={50}
              domain={[0, 3000]}
              ticks={[0, 600, 1200, 1800, 2400, 3000]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#737B8C', fontSize: 13 }}
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <Tooltip
              isAnimationActive={false}
              wrapperStyle={{ pointerEvents: 'none' }}
              cursor={{ fill: 'rgba(15, 107, 255, 0.05)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const revenue = Number(payload.find((item) => item.dataKey === 'revenue')?.value ?? 0)
                const orders = Number(payload.find((item) => item.dataKey === 'orders')?.value ?? 0)

                return (
                  <div className="chart-tooltip">
                    <strong>{label} 2025</strong>
                    <span><i className="legend-dot blue" />Revenue {formatCurrency(revenue)}</span>
                    <span><i className="legend-dot light-blue" />Orders {formatNumber(orders)}</span>
                  </div>
                )
              }}
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              radius={[8, 8, 0, 0]}
              barSize={28}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.highlighted ? 'url(#barActive)' : 'url(#barBlue)'}
                />
              ))}
            </Bar>
            <Line
              yAxisId="orders"
              type="natural"
              dataKey="orders"
              stroke="#82B6FF"
              strokeWidth={2.3}
              dot={(props) => {
                const { cx, cy, payload } = props as {
                  cx?: number
                  cy?: number
                  payload?: PerformancePoint
                }

                if (typeof cx !== 'number' || typeof cy !== 'number') {
                  return null
                }

                if (payload?.highlighted) {
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r="10" fill="#0B6CFF" opacity="0.18" />
                      <circle cx={cx} cy={cy} r="7" fill="#0B6CFF" />
                      <circle cx={cx} cy={cy} r="3.2" fill="#FFFFFF" />
                    </g>
                  )
                }

                return <circle cx={cx} cy={cy} r="4" stroke="#82B6FF" strokeWidth="2" fill="#FFFFFF" />
              }}
              activeDot={{ r: 8, stroke: '#086DFF', strokeWidth: 4, fill: '#FFFFFF' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {showStaticTooltip ? (
          <div className="performance-static-tooltip" aria-hidden="true">
            <strong>{highlightedPoint.label === 'Jul' ? 'July' : highlightedPoint.label} 2025</strong>
            <span><i className="legend-dot blue" />Revenue {formatCurrency(highlightedPoint.revenue)}</span>
            <span><i className="legend-dot light-blue" />Orders {formatNumber(highlightedPoint.orders)}</span>
          </div>
        ) : null}
      </div>
    </Panel>
  )
}
