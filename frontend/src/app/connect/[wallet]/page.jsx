import ConnectWallet from "@/components/WalletConnections/ConnectWallet"
import { wallets } from "@/util/Constants"

export default function ({ params }) {
  if (!wallets[params.wallet]) {
    return <div>Page doesnt Exist 404</div>
  }
  const wallet = wallets[params.wallet]
  return (
    <div>
      <div className="flex items-center">
        <img src={wallet.icon} alt="image" className="w-100px h-100px rounded-full p-4" />
        <h1>{wallet.name}</h1>
      </div>

      <ConnectWallet wallet={wallet}/>

      {/* <div>{wallet.component && wallet.component}</div> */}
    </div>
  )
}
