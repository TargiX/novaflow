import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CustomerGrowthPoint } from '../../../shared/dashboard.ts'
import { formatCompact, formatNumber } from '../../lib/format'
import { Panel, SelectAction } from './Panel'

type CustomerWindow = '12' | '6'

interface CustomerGrowthProps {
  data: CustomerGrowthPoint[]
  window: CustomerWindow
  onWindowChange: (value: CustomerWindow) => void
}

const customerWindowOptions: { label: string; value: CustomerWindow }[] = [
  { label: 'Last 12 Months', value: '12' },
  { label: 'Last 6 Months', value: '6' },
]

export function CustomerGrowth({ data, window, onWindowChange }: CustomerGrowthProps) {
  const visibleData = window === '12' ? data : data.slice(-6)

  return (
    <Panel
      title="Customer Growth"
      className="customer-panel"
      action={
        <SelectAction
          value={window}
          label="Customer growth window"
          options={customerWindowOptions}
          onChange={onWindowChange}
        />
      }
    >
      <div className="chart-legend">
        <span><i className="legend-dot blue" />New Customers</span>
        <span><i className="legend-dot cyan" />Returning Customers</span>
      </div>

      <div className="chart-wrap small-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#EDF1F7" />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E7ECF4' }} tick={{ fill: '#737B8C', fontSize: 13 }} />
            <YAxis
              width={42}
              domain={[0, 4000]}
              ticks={[0, 1000, 2000, 3000, 4000]}
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
                        <i className={`legend-dot ${item.dataKey === 'newCustomers' ? 'blue' : 'cyan'}`} />
                        {item.name === 'newCustomers' ? 'New' : 'Returning'} {formatNumber(Number(item.value ?? 0))}
                      </span>
                    ))}
                  </div>
                )
              }}
            />
            <Line
              type="natural"
              dataKey="newCustomers"
              name="newCustomers"
              stroke="#0B6CFF"
              strokeWidth={2.4}
              dot={{ r: 3, fill: '#0B6CFF', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#FFFFFF' }}
              isAnimationActive={false}
            />
            <Line
              type="natural"
              dataKey="returningCustomers"
              name="returningCustomers"
              stroke="#22C1CA"
              strokeWidth={2.4}
              dot={{ r: 3, fill: '#22C1CA', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#FFFFFF' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
