import {
  BarChart3,
  Box,
  CircleHelp,
  Gauge,
  MessageSquare,
  Plug,
  Settings,
  ShoppingBasket,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'

interface SidebarProps {
  onUpgrade: () => void
}

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: string
}

const DashboardIcon = forwardRef<SVGSVGElement, LucideProps>(function DashboardIcon(
  { size = 22, strokeWidth = 2, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3.1" y="3.1" width="6.3" height="6.3" rx="1.7" fill="currentColor" />
      <rect x="12.6" y="3.1" width="6.3" height="6.3" rx="1.7" fill="currentColor" />
      <rect x="3.1" y="12.6" width="6.3" height="6.3" rx="1.7" fill="currentColor" />
      <rect x="12.6" y="12.6" width="6.3" height="6.3" rx="1.7" fill="currentColor" />
    </svg>
  )
})

const primaryNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'customers', label: 'Customers', icon: UsersRound },
  { id: 'orders', label: 'Orders', icon: ShoppingBasket },
  { id: 'analytics', label: 'Analytics', icon: Gauge },
  { id: 'products', label: 'Products', icon: Box },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '12' },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
]

const secondaryNav: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help Center', icon: CircleHelp },
]

function NavButton({ item, active, onSelect }: { item: NavItem; active: boolean; onSelect: (item: NavItem) => void }) {
  const Icon = item.icon

  return (
    <button
      type="button"
      className={`nav-button${active ? ' is-active' : ''}`}
      onClick={() => onSelect(item)}
      aria-pressed={active}
    >
      <Icon size={22} strokeWidth={2.1} aria-hidden="true" />
      <span>{item.label}</span>
      {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
    </button>
  )
}

export function Sidebar({ onUpgrade }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [navNotice, setNavNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!navNotice) {
      return
    }

    const timeout = window.setTimeout(() => setNavNotice(null), 2200)

    return () => window.clearTimeout(timeout)
  }, [navNotice])

  function handleNavSelect(item: NavItem) {
    setActiveItem(item.id)

    if (item.id === 'dashboard') {
      setNavNotice(null)
      return
    }

    setNavNotice(`${item.label} view is coming soon in this dashboard demo.`)
  }

  return (
    <aside className="sidebar" aria-label="Primary">
      <div>
        <a className="brand" href="/" aria-label="NovaFlow dashboard">
          <span className="brand-mark">N</span>
          <span>NovaFlow</span>
        </a>

        <nav className="nav-list" aria-label="Main navigation">
          {primaryNav.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={activeItem === item.id}
              onSelect={handleNavSelect}
            />
          ))}
        </nav>

        <div className="upgrade-card">
          <div className="upgrade-title">
            <Sparkles size={21} aria-hidden="true" />
            <span>Upgrade to Pro</span>
          </div>
          <p>Unlock advanced analytics, custom reports, and priority support.</p>
          <button type="button" className="primary-button upgrade-button" onClick={onUpgrade}>
            Upgrade Now
          </button>
        </div>

        {navNotice ? (
          <div className="sidebar-toast" role="status">
            {navNotice}
          </div>
        ) : null}
      </div>

      <nav className="nav-list nav-list-secondary" aria-label="Support navigation">
        {secondaryNav.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activeItem === item.id}
            onSelect={handleNavSelect}
          />
        ))}
      </nav>
    </aside>
  )
}
