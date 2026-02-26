// apiClient.js
import axios from "axios"
require("dotenv").config()
const NODE_ENV = process.env.NODE_ENV
const BACKEND_URL =
  NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL

// Create an instance with a base URL and timeout
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage or any other secure storage
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 errors globally with a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Optionally redirect to login or refresh the token
    }
    return Promise.reject(error)
  }
)

export default apiClient
