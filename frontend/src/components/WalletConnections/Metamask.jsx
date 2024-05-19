"use client"

import React, { useState } from "react"
import { BrowserProvider, formatEther } from "ethers"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"

const Metamask = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)

  const RPC_ENDPOINTS = {
    ethereum: "https://rpc.ankr.com/eth",
    polygon: "https://polygon-rpc.com",
    bsc: "https://bsc-dataseed.binance.org/",
  }

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        let metaMaskProvider = null

        if (window.ethereum.providers) {
          metaMaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask)
          console.log("Multiple providers detected:", window.ethereum.providers)
        } else if (window.ethereum.isMetaMask) {
          metaMaskProvider = window.ethereum
        }

        if (metaMaskProvider) {
          await metaMaskProvider.request({ method: "eth_requestAccounts" })

          const provider = new BrowserProvider(metaMaskProvider)

          const accounts = await provider.listAccounts()
          if (accounts.length === 0) {
            throw new Error("No accounts found.")
          }

          const account = accounts[0].address
          console.log("Connected account:", account)
          setAccount(account)

          const balance = await provider.getBalance(account)
          console.log("Account balance (wei):", balance.toString())
          setBalance(formatEther(balance))

          successMsg("Connected Successfully")
        } else {
          throw new Error("MetaMask provider not found.")
        }
      } else {
        throw new Error("Ethereum object not found.")
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      errorMsg("Error connecting to MetaMask: " + error.message)
    }
  }

  return (
    <div>
      <ToastContainer />
      <button onClick={connectMetaMask}>Connect MetaMask</button>
      {account && (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  )
}

export default Metamask
