"use client"
import { usePortfolios } from "@/context/PortfoliosContext"
import { useState } from "react"
import { errorMsg, infoMsg, successMsg } from "@/util/toastNotifications"

import bs58 from "bs58"
import Phantom from "./Phantom"
import { persistWalletPortfolio } from "./PersistWalletPortfolio"
import CBWallet from "./CBWallet"
import Metamask from "./Metamask"

// Function to check if an address is an EVM-compatible address
const isEVMAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address)

// Function to check if an address is a Solana address
const isSolanaAddress = (address) => {
  try {
    const decoded = bs58.decode(address)
    return decoded.length === 32
  } catch (err) {
    return false
  }
}

// Function to check if an address is a Bitcoin address
const isBitcoinAddress = (address) => /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address)

export default function ({ wallet }) {
  const { portfolios } = usePortfolios()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const persistWalletData = async (publicKey) => {
    try {
      if (name.length == 0 || name.length > 20) {
        errorMsg("portfolio name is invalid")
        return
      }

      if (isEVMAddress(publicKey)) {
        infoMsg(publicKey)
        const response = await persistWalletPortfolio(wallet.provider, name, publicKey, "eth")
        // console.log(response)
        return response.data
      } else if (isSolanaAddress(publicKey)) {
        infoMsg(publicKey)
        const response = await persistWalletPortfolio(wallet.provider, name, publicKey, "sol")
        successMsg("success")
        // console.log(response)
        return response.data
      } else if (isBitcoinAddress(publicKey)) {
      } else {
        errorMsg("invalid wallet address format")
        return
      }
    } catch (err) {
      if (err.response) {
        errorMsg(`Error ${err.response.status} - ${err.response.data.message}`)
      } else {
        errorMsg("Failed to connect to Phantom Wallet")
      }
    }
  }

  return (
    <>
      <div>Choose a name for this portfolio:</div>
      <input
        placeholder="Wallet"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        className="input input-primary my-1"
      />
      <div
        className={`transition-opacity duration-200 ease-in-out my-8 ${
          name == "" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {wallet.provider != "custom" && (
          <div className="btn btn-primary text-white">
            {wallet.provider == "phantom" && <Phantom name={name} callback={persistWalletData} />}
            {wallet.provider == "cb_wallet" && (
              <CBWallet name={name} callback={persistWalletData} />
            )}
            {wallet.provider == "metamask" && <Metamask callback={persistWalletData} />}
          </div>
        )}
        {wallet.provider != "custom" && <div className=" my-2">OR</div>}
        <div>
          Import Wallet Manually:{" "}
          <input
            placeholder="0x1234"
            className="input input-primary"
            input={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button className="btn" onClick={(e) => persistWalletData(address)}>
            {" "}
            Save
          </button>
        </div>
      </div>
    </>
  )
}
