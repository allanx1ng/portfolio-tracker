import Metamask from "@/components/WalletConnections/Metamask"
import Phantom from "@/components/WalletConnections/Phantom"
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
        {/* <Coinbase/> */}
        <div>
            manually add assets
        </div>

    </div>


}

export default Connect


