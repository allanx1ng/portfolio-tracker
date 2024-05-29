import React, { useState, useEffect, useRef } from "react"
import apiClient from "@/util/apiClient"

export default function () {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimeout = useRef(null)

  const handleSearch = async (term) => {
    if (!term) {
      setSearchResults(null)
      return
    }
    setIsLoading(true)
    try {
      const response = await apiClient.get(`/search/search-assets?query=${term}`)
      console.log(response.data)
      setSearchResults(response.data)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => {
      handleSearch(searchTerm)
    }, 500)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchTerm])

  return (
    <div className="p-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Search for assets by name or ticker..."
      />
      {isLoading && <div className="mt-2 text-gray-500">Loading...</div>}
      <ul className="mt-2">
        {searchResults ? (
          <div>
            <div id="coins">
              {searchResults.coins.length > 0 ? (
                <div>
                  coins:{" "}
                  {searchResults.coins.map((asset) => (
                    <li key={asset.ticker} className="p-2 border-b">
                      {asset.name} ({asset.ticker})
                    </li>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div id="stocks">
              {searchResults.stocks.length > 0 ? (
                <div>
                  stocks:{" "}
                  {searchResults.stocks.map((asset) => (
                    <li key={asset.ticker} className="p-2 border-b">
                      {asset.name} ({asset.ticker})
                    </li>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* {searchResults.map((asset) => (
          <li key={asset.id} className="p-2 border-b">
            {asset.name} ({asset.ticker})
          </li>
        ))} */}
      </ul>
    </div>
  )
}
