"use client"

import { useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { ToastContainer } from "react-toastify"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import apiClient from "@/util/apiClient"

// Use Serum RPC endpoint as an example
const SERUM_RPC_URL = "https://api.mainnet-beta.solana.com/"

const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

const fetchTokenAccounts = async (publicKey) => {
  const connection = new Connection(SERUM_RPC_URL)

  console.log("trying connection")
  try {
    // Fetch all token accounts
    // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(publicKey), {
    //   programId: SPL_TOKEN_PROGRAM_ID,
    // })

    // const tokens = tokenAccounts.value.map((accountInfo) => {
    //   const accountData = accountInfo.account.data.parsed.info
    //   return {
    //     mint: accountData.mint,
    //     tokenAmount: accountData.tokenAmount.uiAmount,
    //     decimals: accountData.tokenAmount.decimals,
    //   }
    // })
    const response = await apiClient.post("/fetch-sol-tokens", {
        walletAddress: publicKey
      })

      console.log(response.data)



    return response.data.tokens
  } catch (err) {
    console.log("connect errpr")
    throw new error(err)
  }
}

const Metamask = () => {
  const [account, setAccount] = useState(null)
  const [tokens, setTokens] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const connectPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      setIsLoading(true)
      try {
        const resp = await window.solana.connect()
        const publicKey = resp.publicKey.toString()
        console.log("Connected with public key:", publicKey)
        successMsg("Connected to Phantom Wallet")

        setAccount(publicKey) // Set account here

        const tokens = await fetchTokenAccounts(publicKey)
        setTokens(tokens)
      } catch (err) {
        console.error("Error connecting to Phantom wallet:", err)
        errorMsg("Failed to connect to Phantom Wallet")
      } finally {
        setIsLoading(false)
      }
    } else {
      errorMsg("Phantom wallet is not installed")
    }
  }

  return (
    <div>
      <ToastContainer />
      <button onClick={connectPhantomWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
      </button>
      {account && (
        <div>
          <h3>Connected Account: {account}</h3>
          <div>
            {tokens.map((token, index) => (
              <p key={index}>
                Mint: {token.mint} Balance: {token.tokenAmount}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Metamask
