import Metamask from "@/components/WalletConnections/Metamask"
import Phantom from "@/components/WalletConnections/Phantom"
import CoinbaseWallet from "@/components/WalletConnections/CBWallet"
// import Coinbase from "@/components/WalletConnections/Coinbase"



const Connect = () => {
    const wallets = {}
    const exchanges = {}
    const brokerages = {}
    const banks = {}

    return <div>
        connect ur accounts
        <Metamask/>
        <Phantom/>
        <CoinbaseWallet/>
        {/* <Coinbase/> */}
        <div>
            manually add assets
        </div>

    </div>


}

export default Connect


