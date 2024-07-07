import Metamask from "@/components/WalletConnections/Metamask"
import Phantom from "@/components/WalletConnections/Phantom"
import CoinbaseWallet from "@/components/WalletConnections/CBWallet"
// import Coinbase from "@/components/WalletConnections/Coinbase"
import { wallets } from "@/util/Constants"

const Connect = () => {
  const exchanges = {}
  const brokerages = {}
  const banks = {}
  console.log()

  return (
    <div>
      connect ur accounts
      {/* <Metamask/>
        <Phantom/>
        <CoinbaseWallet/> */}
      {/* <Coinbase/> */}
      <div className="grid grid-cols-4">
        {Object.entries(wallets).map(([key, value], index) => (
          <a href={`/connect/${key}`} className="w-200px h-200px" key={index}>
            <div className="w-200px h-200px rounded-3xl border-2 border-black flex flex-col flex-1 items-center justify-center text-lg shadow-md">
              <img src={value.icon} alt="image" className="w-40 h-40 rounded-full p-4" />
              <div>{value.name}</div>
            </div>
          </a>
        ))}
      </div>
      <a className="btn btn-primary" href="/connect/addCustom">manually add assets</a>

    </div>
  )
}

export default Connect
