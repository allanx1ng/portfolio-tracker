export const round = (num, maxDecimals) => {
  // Ensure num is a number
  if (isNaN(num)) {
    return 0
  }
  num = Number(num)

  // If the number is less than 1, round to significant digits
  if (Math.abs(num) < 1) {
    return parseFloat(num.toPrecision(maxDecimals))
  }

  // Convert the number to a string
  let numStr = num.toString()

  // Find the position of the decimal point
  let decimalIndex = numStr.indexOf(".")

  // If there is no decimal point, the number is an integer
  if (decimalIndex === -1) {
    return num
  }

  // Check the number of decimal places
  let decimalPlaces = numStr.length - decimalIndex - 1

  // If the number of decimal places exceeds the maximum, round it
  if (decimalPlaces > maxDecimals) {
    return Math.round(num * 10 ** maxDecimals) / 10 ** maxDecimals
  }

  // If the number of decimal places is within the limit, return the original number
  return num
}

/**
 * Format a number to a specified number of decimal places safely
 * @param {number} num - The number to format
 * @param {number} decimals - The number of decimal places (default: 2)
 * @returns {number} - The formatted number
 */
export const formatNumber = (num, decimals = 2) => {
  // Ensure num is a number
  if (isNaN(num)) {
    return 0
  }
  num = Number(num)
  
  // Ensure decimals is within valid range (0-20)
  decimals = Math.max(0, Math.min(20, decimals))
  
  // Format the number using toFixed
  return Number(num.toFixed(decimals))
}

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {number} decimals - The number of decimal places (default: 2)
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  return `$${formatNumber(value, decimals).toLocaleString()}`
}

export const percentGainCalc = (val, contributions) => {
  if (val == 0 && contributions == 0) {
    return 0
  }
  return (val / contributions - 1) * 100
}

export const percentPortfolioCalc = (val, tvl) => {
  return (val / tvl) * 100
}
