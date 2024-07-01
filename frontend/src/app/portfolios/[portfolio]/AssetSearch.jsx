import React, { useState, useEffect, useRef } from "react"
import apiClient from "@/util/apiClient"

export default function ({ setAsset }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimeout = useRef(null)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

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

  const selectAsset = (event, name, ticker, type, id) => {
    event.preventDefault()
    setAsset({
        type: type,
        name: name,
        ticker: ticker.toUpperCase(),
        id: id
    })
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
    <div className="">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full max-w-xs"
        placeholder="Search for assets by name or ticker..."
      />
      {/* {isLoading && <div className="mt-2 text-gray-500">Loading...</div>} */}
      <ul className="mt-2">
        {searchResults ? (
          <div>
            <div id="coins">
              {searchResults.coins.length > 0 ? (
                <div>
                  coins:{" "}
                  {searchResults.coins.map((asset, index) => (
                    <kbd key={index} className="kbd w-full">
                      <button onClick={(e) => selectAsset(e, asset.name, asset.ticker, "coin", asset.id)}
                        className="w-full">
                        {asset.name} ({asset.ticker.toUpperCase()})
                      </button>
                    </kbd>
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
                    <li key={asset.ticker} className="p-2 border-2 my-1">
                      <button onClick={(e) => selectAsset(e, asset.name, asset.ticker, "stock", asset.id)}>
                        {asset.name} ({asset.ticker.toUpperCase()})
                      </button>
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
