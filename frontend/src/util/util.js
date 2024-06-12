export const round = (num, maxDecimals) => {
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
