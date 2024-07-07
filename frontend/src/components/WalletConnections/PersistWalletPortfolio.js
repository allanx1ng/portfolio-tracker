import apiClient from "@/util/apiClient"
import { PublicKey } from "@solana/web3.js"

export const persistWalletPortfolio = async (provider, portfolioName, publicKey, chain) => {
  try {
    if (chain == "sol") {
      const response = await apiClient.post("/fetch-sol-tokens", {
        provider: provider,
        portfolioName: portfolioName,
        walletAddress: publicKey,
      })
      return response
    } else if (chain == "btc") {
    } else if (chain == "eth") {
    } else {
    }

    // return response
  } catch (err) {
    throw err
  }
}
