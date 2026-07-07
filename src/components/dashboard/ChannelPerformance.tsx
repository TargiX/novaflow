import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ChannelPeriodId,
  ChannelPoint,
} from '../../../shared/dashboard.ts'
import { formatCompact, formatCurrency } from '../../lib/format'
import { Panel, SelectAction } from './Panel'

interface ChannelPerformanceProps {
  data: Record<ChannelPeriodId, ChannelPoint[]>
  period: ChannelPeriodId
  onPeriodChange: (period: ChannelPeriodId) => void
}

const channelPeriodOptions: { label: string; value: ChannelPeriodId }[] = [
  { label: 'This Year', value: 'this-year' },
  { label: 'Last Year', value: 'last-year' },
]

const channelKeys = [
  { key: 'direct', label: 'Direct', color: '#0B6CFF' },
  { key: 'organic', label: 'Organic Search', color: '#22C1CA' },
  { key: 'paid', label: 'Paid Ads', color: '#FF6A55' },
  { key: 'referral', label: 'Referral', color: '#8B72F6' },
] as const

export function ChannelPerformance({ data, period, onPeriodChange }: ChannelPerformanceProps) {
  return (
    <Panel
      title="Channel Performance"
      className="channel-panel"
      action={
        <SelectAction
          value={period}
          label="Channel performance period"
          options={channelPeriodOptions}
          onChange={onPeriodChange}
        />
      }
    >
      <div className="chart-legend channel-legend">
        {channelKeys.map((channel) => (
          <span key={channel.key}><i className="legend-dot" style={{ background: channel.color }} />{channel.label}</span>
        ))}
      </div>

      <div className="chart-wrap small-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data[period]} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#EDF1F7" />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E7ECF4' }} tick={{ fill: '#737B8C', fontSize: 13 }} />
            <YAxis
              width={48}
              domain={[0, 100000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000]}
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#737B8C', fontSize: 13 }}
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null
                }

                return (
                  <div className="chart-tooltip">
                    <strong>{label}</strong>
                    {payload.map((item) => (
                      <span key={String(item.dataKey)}>
                        <i className="legend-dot" style={{ background: item.color }} />
                        {item.name} {formatCurrency(Number(item.value ?? 0))}
                      </span>
                    ))}
                  </div>
                )
              }}
            />
            {channelKeys.map((channel) => (
              <Bar
                key={channel.key}
                dataKey={channel.key}
                name={channel.label}
                stackId="channels"
                fill={channel.color}
                radius={channel.key === 'referral' ? [5, 5, 0, 0] : [0, 0, 0, 0]}
                barSize={24}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
