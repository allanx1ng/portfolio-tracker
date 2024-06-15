import apiClient from "@/util/apiClient"
import { PublicKey } from "@solana/web3.js"

export const persistWalletPortfolio = async (provider, portfolioName, publicKey) => {
  try {
    const response = await apiClient.post("/fetch-sol-tokens", {
      provider: provider,
      portfolioName: portfolioName,
      walletAddress: publicKey,
    })

    return response
  } catch (err) {
    throw err
  }
}
