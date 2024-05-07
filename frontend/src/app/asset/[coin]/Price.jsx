"use client"
import { useState, useEffect } from "react"

const Price = (data, asset) => {
  const [price, setPrice] = useState(0)
  useEffect(() => {
    setPrice(data[asset])
  }, [data])
  return <div>${price}</div>
}

export default Price
