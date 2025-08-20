import apiClient from "@/util/apiClient"


export const getInvestments = async () => {
    try {
      const response = await apiClient.get("/investments")

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

// export const getInvestments = async (name) => {
//     try {
//         const response = await apiClient.get("/portfolio/" + name)
  
//         if (response.status == 200) {
//           // console.log(response.data.data)
//           return(response.data.data)
//         } else if (response.status == 204) {
//           return []
//         } else {
//           throw new Error(response.status)
//         }
        
//       } catch (err) {
//           throw err
//       }
// }
