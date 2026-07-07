export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const currencyWithCentsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const decimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatCurrencyWithCents(value: number) {
  return currencyWithCentsFormatter.format(value)
}

export function formatCompact(value: number) {
  return compactNumberFormatter.format(value).toLowerCase()
}

export function formatNumber(value: number) {
  return decimalFormatter.format(value)
}
