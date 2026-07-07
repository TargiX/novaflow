import { ChevronDown } from 'lucide-react'

interface PanelProps {
  title: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

interface SelectActionProps<T extends string> {
  value: T
  options: { label: string; value: T }[]
  label: string
  onChange: (value: T) => void
}

export function Panel({ title, children, className = '', action }: PanelProps) {
  return (
    <section className={`panel ${className}`} aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>
      <div className="panel-header">
        <h2 id={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function SelectAction<T extends string>({ value, options, label, onChange }: SelectActionProps<T>) {
  return (
    <label className="compact-select">
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </label>
  )
}
