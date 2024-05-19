const { Connection, PublicKey } = require("@solana/web3.js")

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

class SolTokenFetch {
  static fetchTokens = async (req, res) => {
    const { walletAddress } = req.body
    if (!walletAddress) {
      return res.status(400).send({ error: "Wallet address is required" })
    }

    try {
      const connection = new Connection(SOLANA_RPC_URL)

      console.log(`Fetching token accounts for ${walletAddress} from ${SOLANA_RPC_URL}`)

      // Fetch all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { programId: SPL_TOKEN_PROGRAM_ID }
      )

      const tokens = tokenAccounts.value.map((accountInfo) => {
        const accountData = accountInfo.account.data.parsed.info
        return {
          mint: accountData.mint,
          tokenAmount: accountData.tokenAmount.uiAmount,
          decimals: accountData.tokenAmount.decimals,
        }
      })
      console.log("sending tokens" + tokens)

      res.send({ tokens })
    } catch (error) {
      console.log("Error fetching token accounts:", error)
      res.status(500).send({ error: "Failed to fetch token accounts" })
    }
  }

  static getTokenName = async (res, req) => {
    // const { tokenAddress } = req.body
    if (!tokenAddress) {
      return res.status(400).send({ error: "Token address is required" })
    }

    try {
      // Fetch the SPL Token Registry
      const response = await axios.get(TOKEN_REGISTRY_URL)
      const tokenList = response.data.tokens

      // Search for the token address
      const tokenInfo = tokenList.find((token) => token.address === tokenAddress)

      if (tokenInfo) {
        res.send({ name: tokenInfo.name, symbol: tokenInfo.symbol })
      } else {
        res.status(404).send({ error: "Token not found in the registry" })
      }
    } catch (error) {
      console.error("Error fetching token name:", error)
      res.status(500).send({ error: "Failed to fetch token name" })
    }
  }
}
module.exports = SolTokenFetch
