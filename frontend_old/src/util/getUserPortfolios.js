

import apiClient from "@/util/apiClient"
import { useRouter } from "next/navigation"

export const getPortfolios = async () => {
    try {
      const response = await apiClient.get("/portfolio")

      if (response.status == 200) {
        // console.log(response.data.data)
        return(response.data)
      } else if (response.status == 204) {
        return null
      }
      throw new Error(response.status)
    } catch (err) {
        throw err
    }
  }

export const getPortfolio = async (name) => {
    try {
        const response = await apiClient.get("/portfolio/" + name)
  
        if (response.status == 200) {
          // console.log(response.data.data)
          return(response.data.data)
        } else if (response.status == 204) {
          return []
        } else {
          throw new Error(response.status)
        }
        
      } catch (err) {
          throw err
      }
}