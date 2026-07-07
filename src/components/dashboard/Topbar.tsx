import {
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
} from 'lucide-react'
import type { DashboardRangeId, DashboardResponse } from '../../../shared/dashboard.ts'

interface TopbarProps {
  dashboard: DashboardResponse
  range: DashboardRangeId
  search: string
  onRangeChange: (range: DashboardRangeId) => void
  onSearchChange: (search: string) => void
  onExport: () => void
  isExporting: boolean
}

export function Topbar({
  dashboard,
  range,
  search,
  onRangeChange,
  onSearchChange,
  onExport,
  isExporting,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>Overview</h1>
        <p>Here's what's happening with your business today.</p>
      </div>

      <div className="topbar-actions">
        <label className="search-control global-search" aria-label="Search customers, orders, products">
          <Search size={22} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search customers, orders, products..."
          />
          <kbd>⌘K</kbd>
        </label>

        <label className="select-control date-select">
          <CalendarDays size={22} aria-hidden="true" />
          <select
            value={range}
            onChange={(event) => onRangeChange(event.target.value as DashboardRangeId)}
            aria-label="Dashboard date range"
          >
            {dashboard.rangeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" />
        </label>

        <button
          type="button"
          className="secondary-button export-button"
          onClick={onExport}
          disabled={isExporting}
        >
          <Download size={20} aria-hidden="true" />
          <span>{isExporting ? 'Exporting' : 'Export'}</span>
        </button>

        <button type="button" className="icon-button notification-button" aria-label="Notifications">
          <Bell size={22} aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <button type="button" className="user-menu" aria-label="User menu">
          <img src={dashboard.currentUser.avatarUrl} alt="" width="48" height="48" />
          <span>
            <strong>{dashboard.currentUser.name}</strong>
            <small>{dashboard.currentUser.role}</small>
          </span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
