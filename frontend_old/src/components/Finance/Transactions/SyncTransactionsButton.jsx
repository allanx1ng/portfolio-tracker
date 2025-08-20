"use client"

import { useState, useCallback } from 'react'
import { syncTransactions } from '@/util/transactionService'
import { successMsg, errorMsg } from '@/util/toastNotifications'
import { Button } from '@/components/ui/buttons'

/**
 * Button component for manually syncing transactions for a connected Plaid account
 * 
 * @param {Object} props
 * @param {string} props.itemId - The Plaid item ID to sync
 * @param {Function} props.onSuccess - Callback function to execute after successful sync
 * @param {string} [props.buttonText] - Optional custom button text (default: 'Sync Transactions')
 * @param {string} [props.variant] - Button variant: 'primary', 'secondary', 'outline', 'ghost', or 'danger' (default: 'primary')
 * @param {string} [props.size] - Button size: 'sm', 'md', or 'lg' (default: 'md')
 * @param {boolean} [props.showCounts] - Whether to show counts of added/modified/removed transactions
 * @returns {JSX.Element}
 */
const SyncTransactionsButton = ({ 
  itemId, 
  onSuccess,
  buttonText = 'Sync Transactions',
  variant = 'primary',
  size = 'md',
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
      <Button
        onClick={handleSync}
        disabled={!itemId}
        isLoading={isLoading}
        loadingText="Syncing..."
        variant={variant}
        size={size}
      >
        {buttonText}
      </Button>
      
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
