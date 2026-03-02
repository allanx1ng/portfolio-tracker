"use client"

import { useState, createContext, useContext, useCallback, useRef } from "react"
import apiClient from "@/util/apiClient"

const InvestmentsContext = createContext(null)

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

const InvestmentsProvider = ({ children }) => {
  const [data, setData] = useState(null)
  const [accountCache, setAccountCache] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastFetched = useRef(null)
  const fetchPromise = useRef(null)

  const isCacheValid = useCallback(() => {
    return data !== null && lastFetched.current !== null
      && (Date.now() - lastFetched.current) < CACHE_TTL_MS
  }, [data])

  const fetchInvestments = useCallback(async () => {
    // Dedup: if a fetch is already in flight, return its promise
    if (fetchPromise.current) return fetchPromise.current

    const promise = (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get("/investments")
        const result = response.status === 204 ? null : response.data
        setData(result)
        lastFetched.current = Date.now()
        return result
      } catch (err) {
        const msg = err.response?.data?.error || err.message
        setError(msg)
        throw err
      } finally {
        setLoading(false)
        fetchPromise.current = null
      }
    })()

    fetchPromise.current = promise
    return promise
  }, [])

  const ensureData = useCallback(async () => {
    if (isCacheValid()) return data
    return fetchInvestments()
  }, [isCacheValid, data, fetchInvestments])

  const refreshInvestments = useCallback(async () => {
    lastFetched.current = null
    return fetchInvestments()
  }, [fetchInvestments])

  const fetchAccountDetail = useCallback(async (accountId) => {
    if (accountCache[accountId]) return accountCache[accountId]

    const response = await apiClient.get(`/investments/account/${accountId}`)
    const detail = response.data
    setAccountCache(prev => ({ ...prev, [accountId]: detail }))
    return detail
  }, [accountCache])

  const invalidateCache = useCallback(() => {
    setData(null)
    setAccountCache({})
    lastFetched.current = null
    setError(null)
  }, [])

  // Selectors
  const getOverallOverview = useCallback(() => data?.overallPortfolioOverview || null, [data])
  const getDashboardOverview = useCallback(() => data?.dashboardOverview || null, [data])
  const getInstitutions = useCallback(() => data?.institutions || [], [data])
  const getAccountDetail = useCallback((accountId) => accountCache[accountId] || null, [accountCache])

  return (
    <InvestmentsContext.Provider value={{
      loading, error,
      ensureData, refreshInvestments,
      fetchAccountDetail, invalidateCache,
      getOverallOverview, getDashboardOverview,
      getInstitutions, getAccountDetail,
    }}>
      {children}
    </InvestmentsContext.Provider>
  )
}

const useInvestments = () => useContext(InvestmentsContext)

export { InvestmentsProvider, useInvestments }
