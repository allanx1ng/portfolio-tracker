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

export const percentGainCalc = (val, contributions) => {
  if (val == 0 && contributions == 0) {
    return 0
  }
  return (val / contributions - 1) * 100
}

export const percentPortfolioCalc = (val, tvl) => {
  return (val / tvl) * 100
}
