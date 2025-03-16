import Metamask from "@/components/WalletConnections/Metamask"
import Phantom from "@/components/WalletConnections/Phantom"
import CoinbaseWallet from "@/components/WalletConnections/CBWallet"
// import Coinbase from "@/components/WalletConnections/Coinbase"
import { wallets } from "@/util/Constants"
import { Icon } from "@iconify/react"
import Brokerage from "./brokerage/page"


const Connect = () => {
  console.log()

  return (
    <div>
      <h1 className="my-4">Connect accounts:</h1>

      {/* <Metamask/>
        <Phantom/>
        <CoinbaseWallet/> */}
      {/* <Coinbase/> */}
      <div className=" p-8 bg-secondary my-8 rounded-3xl">
        <div className="grid grid-cols-5">
          <h2 className="col-span-full pb-4">Wallets</h2>

          {Object.entries(wallets).map(([key, value], index) => (
            <a href={`/connect/${key}`} className="w-200px h-200px" key={index}>
              <div className="w-200px h-200px bg-white rounded-3xl flex flex-col flex-1 items-center justify-center text-lg shadow-md">
                {key == "custom" ? (
                  <Icon icon="material-symbols:wallet" className="w-40 h-40 rounded-full p-4"/>
                ) : (
                  <img src={value.icon} alt="image" className="w-40 h-40 rounded-full p-4" />
                )}

                <div>{value.name}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-5">
          <h2 className="col-span-full pb-4">Brokerages</h2>
          <Brokerage/>
        
          
        </div>
      </div>
      <a className="btn btn-primary" href="/connect/addCustom">
        manually add assets
      </a>
    </div>
  )
}

export default Connect
