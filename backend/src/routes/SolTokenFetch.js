const { Connection, PublicKey } = require("@solana/web3.js")
const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

class SolTokenFetch {
  static fetchTokens = async (req, res) => {
    const uid = req.user.uid
    const { provider, portfolioName, walletAddress } = req.body
    if (!walletAddress || !provider || !portfolioName) {
      return res.status(400).send({ error: "Wallet address is required" })
    }

    try {
      const connection = new Connection(SOLANA_RPC_URL)

      console.log(`Fetching token accounts for ${walletAddress} from ${SOLANA_RPC_URL}`)

      // Fetch all token accounts
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      //   new PublicKey(walletAddress),
      //   { programId: SPL_TOKEN_PROGRAM_ID }
      // )

      // const tokens = tokenAccounts.value.map((accountInfo) => {
      //   const accountData = accountInfo.account.data.parsed.info
      //   return {
      //     mint: accountData.mint,
      //     tokenAmount: accountData.tokenAmount.uiAmount,
      //     decimals: accountData.tokenAmount.decimals,
      //   }
      // })

      const balance = (await connection.getBalance(new PublicKey(walletAddress))) / 1e9
      // return balance / 1e9
      console.log(balance)
      // console.log("sending tokens" + tokens)
      const data = await SolTokenFetch.persistWalletToDb(
        uid,
        provider,
        portfolioName,
        walletAddress,
        balance
      )

      if (data == "wallet-conflict") {
        return res.status(409).json({ message: "Wallet address already exists under another name" })
      } else if (data == "name-conflict") {
        return res.status(409).json({ message: "Portfolio name already exists" })
      }

      return res.status(200).json({ name: "Solana", ticker: "SOL", bal: balance })
    } catch (error) {
      console.log("Error fetching token accounts:", error)
      return res.status(500).send({ error: "Failed to fetch token accounts" })
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

  static persistWalletToDb = async (uid, provider, portfolioName, walletAddress, solBalance) => {
    const sql = `SELECT * FROM portfolio WHERE uid=$1 AND portfolio_name=$2`
    const sql2 = `SELECT * FROM portfolio WHERE wallet_address=$1`
    try {
      const query = `
      INSERT INTO Portfolio (uid, portfolio_name, account_type, provider, wallet_address)
      VALUES ($1, $2, 'wallet', $3, $4) 
      ON CONFLICT DO NOTHING
    `
      const upsertAssetQuery = `
      INSERT INTO Portfolio_assets (uid, portfolio_name, asset_id, amount, avg_price)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (uid, portfolio_name, asset_id)
      DO UPDATE SET amount = EXCLUDED.amount
    `

      try {
        try {
          const data = await db.queryDbValues(sql, [uid, portfolioName])
          if (data.length > 0) {
            console.log(409 + "ERROR")
            return "name-conflict"
          }
        } catch (err) {
          console.log(409 + "ERROR")
          return "name-conflict"
        }
        try {
          const data2 = await db.queryDbValues(sql2, [walletAddress])
          if (data2.length > 0) {
            console.log(409 + "ERROR")
            return "wallet-conflict"
          }
        } catch (err) {
          console.log(409 + "ERROR")
          return "wallet-conflict"
        }
      } catch (err) {
        // res
        //   .status(500)
        //   .json({
        //     message:
        //       "portfolio with given name or wallet address already exists: " +
        //       portfolioName +
        //       " wallet: " +
        //       walletAddress,
        //   })
        //   return
        throw err
      }

      const data = await db.queryDbValues(query, [uid, portfolioName, provider, walletAddress])

      const d2 = await db.queryDbValues(upsertAssetQuery, [uid, portfolioName, 5426, solBalance, 0])
      // res.status(200).json({ message: "successlly connected wallet: " + walletAddress })
    } catch (err) {
      throw err
    }
  }
}
module.exports = SolTokenFetch
