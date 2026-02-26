import axios from "axios"
require("dotenv").config()
const NODE_ENV = process.env.NODE_ENV
const BACKEND_URL =
  NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
})

// Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Track whether a refresh is already in flight to avoid duplicate refreshes
let isRefreshing = false
let refreshQueue = []

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  refreshQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 403 (expired access token), not 401 (no token at all)
    if (error.response?.status === 403 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken")

      if (!refreshToken) {
        clearAuthAndRedirect()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Another refresh is in flight — queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint directly with axios to avoid interceptor loop
        const { data } = await axios.post(`${BACKEND_URL}/refresh`, { refreshToken })

        localStorage.setItem("token", data.token)
        localStorage.setItem("refreshToken", data.refreshToken)

        // Retry the original request and all queued requests
        processQueue(null, data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuthAndRedirect()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 401 = no token / bad token (not refreshable)
    if (error.response?.status === 401) {
      clearAuthAndRedirect()
    }

    return Promise.reject(error)
  }
)

function clearAuthAndRedirect() {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login"
  }
}

export default apiClient
