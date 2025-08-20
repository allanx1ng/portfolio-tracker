"use client"
import React, { useState } from "react"
import { ethers } from "ethers"
import WalletLink from "@coinbase/wallet-sdk"
import { successMsg, errorMsg } from "@/util/toastNotifications"

const CBWallet = ({ name, callback }) => {
  const [account, setAccount] = useState(null)
  // const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const connectCoinbaseWallet = async () => {
    setIsLoading(true)
    try {
      // Initialize WalletLink
      const walletLink = new WalletLink({
        appName: "My App",
        appLogoUrl: "https://example.com/logo.png", // Replace with your app logo
        darkMode: false,
      })

      // Initialize a Web3 Provider object
      const ethereum = walletLink.makeWeb3Provider(
        "https://rpc.ankr.com/eth", // Replace with your RPC provider
        1
      )

      // Request account access if needed
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        const publicKey = accounts[0]
        console.log("Connected with public key:", publicKey)

        setAccount(publicKey)

        const ethTokens = await callback(publicKey)

        // Initialize ethers provider
        // const provider = new ethers.BrowserProvider(ethereum)

        // // Fetch balance
        // const balanceBigNumber = await provider.getBalance(publicKey)
        // const balance = ethers.formatEther(balanceBigNumber)

        // setBalance(balance)
        successMsg("Connected to Coinbase Wallet")
      } else {
        console.error("No accounts found")
      }
    } catch (err) {
      // errorMsg("error connecting cb wallet")
      console.error("Error connecting to Coinbase wallet:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button onClick={connectCoinbaseWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Coinbase Wallet"}
      </button>
      {account && (
        <div>
          <h3>Connected Account: {account}</h3>
        </div>
      )}
    </div>
  )
}

export default CBWallet
