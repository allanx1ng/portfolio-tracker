export const formatNumber = (num, decimals = 2) => {
  if (isNaN(num)) return 0
  num = Number(num)
  decimals = Math.max(0, Math.min(20, decimals))
  return Number(num.toFixed(decimals))
}

export const formatCurrency = (value, decimals = 2) => {
  return `$${formatNumber(value, decimals).toLocaleString()}`
}
