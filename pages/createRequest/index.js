import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Header, Hero, Fund, Request } from "@components/UI/common";




export default function Requests() {
    const { web3, isLoading, contract , hooks} = useWeb3()
    
    const { network } = hooks.useNetwork()
    const { account } = hooks.useAccount()


    return (
        <>
      
            <Request
             targetNetwork={network.targetNetwork}
             network={network.data}
             account={account.data}
             contract={contract}
             web3={web3}
             isSupported={network.isSupported}
         
            
            />
    
        </>


    )
}
Requests.Layout = BaseLayout