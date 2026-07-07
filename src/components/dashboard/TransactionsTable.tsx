import { useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, Filter, MoreHorizontal, Search } from 'lucide-react'
import type {
  Transaction,
  TransactionStatus,
} from '../../../shared/dashboard.ts'
import { formatCurrencyWithCents } from '../../lib/format'

type StatusFilter = 'All' | TransactionStatus

interface TransactionsTableProps {
  transactions: Transaction[]
  statuses: TransactionStatus[]
  query: string
  statusFilter: StatusFilter
  selectedRows: Set<string>
  showAll: boolean
  onQueryChange: (value: string) => void
  onStatusFilterChange: (status: StatusFilter) => void
  onToggleRow: (id: string) => void
  onToggleAll: (ids: string[]) => void
  onShowAllChange: (showAll: boolean) => void
}

const statusClass: Record<TransactionStatus, string> = {
  Completed: 'completed',
  Processing: 'processing',
  Refunded: 'refunded',
  Pending: 'pending',
}

export function TransactionsTable({
  transactions,
  statuses,
  query,
  statusFilter,
  selectedRows,
  showAll,
  onQueryChange,
  onStatusFilterChange,
  onToggleRow,
  onToggleAll,
  onShowAllChange,
}: TransactionsTableProps) {
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 5)
  const allVisibleIds = useMemo(
    () => visibleTransactions.map((transaction) => transaction.id),
    [visibleTransactions],
  )
  const allVisibleSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedRows.has(id))

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            aria-label="Select all visible transactions"
            checked={allVisibleSelected}
            onChange={() => onToggleAll(allVisibleIds)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select ${row.original.orderId}`}
            checked={selectedRows.has(row.original.id)}
            onChange={() => onToggleRow(row.original.id)}
          />
        ),
      },
      {
        accessorKey: 'orderId',
        header: 'Order ID',
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="customer-cell">
            <span className={`customer-avatar tone-${row.original.customer.tone}`}>
              {row.original.customer.initials}
            </span>
            <span>{row.original.customer.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className={`status-pill ${statusClass[row.original.status]}`}>
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => <strong className="money-cell">{formatCurrencyWithCents(row.original.total)}</strong>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button type="button" className="row-action" aria-label={`Actions for ${row.original.orderId}`}>
            <MoreHorizontal size={20} aria-hidden="true" />
          </button>
        ),
      },
    ],
    [allVisibleIds, allVisibleSelected, onToggleAll, onToggleRow, selectedRows],
  )

  const table = useReactTable({
    data: visibleTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <section className="panel transactions-panel" aria-labelledby="recent-transactions-title">
      <div className="panel-header transactions-header">
        <h2 id="recent-transactions-title">Recent Transactions</h2>

        <div className="transactions-tools">
          <label className="search-control table-search" aria-label="Search transactions">
            <Search size={19} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search transactions..."
            />
          </label>

          <label className="filter-select">
            <Filter size={18} aria-hidden="true" />
            <select
              value={statusFilter}
              aria-label="Filter transactions by status"
              onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
            >
              <option value="All">Filter</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>

          <button
            type="button"
            className="text-button"
            onClick={() => onShowAllChange(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-table" colSpan={columns.length}>
                  No transactions match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
