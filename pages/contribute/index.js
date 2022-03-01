import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Header, Hero, Fund } from "@components/UI/common";




export default function Contribute() {
    const { web3, isLoading, contract } = useWeb3()
    const { hooks } = useWeb3()
    const { network, isSupported } = hooks.useNetwork()
    const { account } = hooks.useAccount()


    return (
        <>

           

            <Fund


                targetNetwork={network.targetNetwork}
                network={network.data}
                account={account.data}
                contract={contract}
                web3={web3}
                isSupported={network.isSupported}
                isAdmin = {account.isAdmin}
            />


   

            <Breadcrumbs />

            



        </>


    )
}
Contribute.Layout = BaseLayout