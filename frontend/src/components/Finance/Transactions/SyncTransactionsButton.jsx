"use client"

import { useState, useCallback } from 'react'
import { syncTransactions } from '@/util/transactionService'
import { successMsg, errorMsg } from '@/util/toastNotifications'

/**
 * Button component for manually syncing transactions for a connected Plaid account
 * 
 * @param {Object} props
 * @param {string} props.itemId - The Plaid item ID to sync
 * @param {Function} props.onSuccess - Callback function to execute after successful sync
 * @param {string} [props.buttonText] - Optional custom button text
 * @param {string} [props.buttonClassName] - Optional custom button class
 * @param {boolean} [props.showCounts] - Whether to show counts of added/modified/removed transactions
 * @returns {JSX.Element}
 */
const SyncTransactionsButton = ({ 
  itemId, 
  onSuccess,
  buttonText = 'Sync Transactions',
  buttonClassName = "px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed",
  showCounts = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const handleSync = useCallback(async () => {
    if (!itemId) {
      errorMsg('No account selected for syncing')
      return
    }

    try {
      setIsLoading(true)
      setSyncResult(null)
      
      const result = await syncTransactions(itemId)
      
      // Set the result for display if showCounts is true
      setSyncResult(result)
      
      // Show success message
      const totalUpdates = result.added + result.modified + result.removed
      successMsg(
        totalUpdates > 0
          ? `Synced ${totalUpdates} transactions`
          : 'No new transactions to sync'
      )
      
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Error syncing transactions:', error)
      errorMsg(error.response?.data?.message || 'Failed to sync transactions')
    } finally {
      setIsLoading(false)
    }
  }, [itemId, onSuccess])

  return (
    <div className="flex flex-col">
      <button
        onClick={handleSync}
        disabled={isLoading || !itemId}
        className={buttonClassName}
      >
        {isLoading ? 'Syncing...' : buttonText}
      </button>
      
      {showCounts && syncResult && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Added: {syncResult.added}</p>
          <p>Modified: {syncResult.modified}</p>
          <p>Removed: {syncResult.removed}</p>
        </div>
      )}
    </div>
  )
}

export default SyncTransactionsButton
