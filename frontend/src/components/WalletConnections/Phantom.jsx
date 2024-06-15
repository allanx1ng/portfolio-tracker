"use client"

import { useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import apiClient from "@/util/apiClient"
import { persistWalletPortfolio } from "./PersistWalletPortfolio"

const Phantom = () => {
  const [account, setAccount] = useState(null)
  const [tokens, setTokens] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState("Phantom")
  const [name, setName] = useState("")

  const fetchTokenAccounts = async (publicKey) => {
    try {
      const response = await persistWalletPortfolio(provider, name, publicKey)

      
      console.log(response.data)

      return response.data
      // const solBalance = await connection.getBalance(new PublicKey(publicKey))
      console.log(solBalance)
      return solBalance / 1e9
    } catch (err) {
      console.log("connect errpr")
      throw new Error(err)
    }
  }

  const connectPhantomWallet = async () => {
    if (name.length == 0 || name.length > 20) {
      errorMsg("portfolio name is invalid")
      return
    }
    if (window.solana && window.solana.isPhantom) {
      setIsLoading(true)
      try {
        const resp = await window.solana.connect()
        const publicKey = resp.publicKey.toString()
        console.log("Connected with public key:", publicKey)
        

        setAccount(publicKey) // Set account here

        const solBal = await fetchTokenAccounts(publicKey)

        successMsg("Connected to Phantom Wallet")
        setTokens([solBal])
      } catch (err) {
        // await disconnectPhantomWallet()
        // console.error("Error connecting to Phantom wallet:", err)
        
        errorMsg("Failed to connect to Phantom Wallet")
      } finally {
        setIsLoading(false)
      }
    } else {
      errorMsg("Phantom wallet is not installed")
    }
  }

  // const disconnectPhantomWallet = async () => {
  //   if (window.solana && window.solana.isPhantom) {
  //     try {
  //       await window.solana.disconnect();
  //       console.log('Wallet disconnected');
  //       setAccount(null)
  //     } catch (err) {
  //       // console.error('Error disconnecting wallet:', err);
  //     }
  //   }
  // };

  return (
    <div>
      {/* <ToastContainer /> */}
      <input
        placeholder="Phantom"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <button onClick={connectPhantomWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
      </button>
      {account && (
        <div>
          <h3>Connected Account: {account}</h3>
          <div>
            {tokens.map((token, index) => (
              <p key={index}>
                Mint: {token.name} Balance: {token.bal}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Phantom
