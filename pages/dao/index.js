import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Fund, Header, Hero } from "@components/UI/common";

export default function Contribute() {

    const { web3, isLoading, contract, isWeb3Loaded } = useWeb3()
    const { hooks } = useWeb3()
    const { network } = hooks.useNetwork()
    const { account } = hooks.useAccount()


    return (
        <>

            <Header
                network={network.data}
                account={account.data}
                isSupported={network.isSupported}
                targetNetwork={network.targetNetwork}
                contract={contract}
                isLoading={isLoading}
                isWeb3Loaded={isWeb3Loaded}

            />
            <Fund
                account={account.data}
                contract={contract}
                web3={web3}


            />

            <Hero />

            <Breadcrumbs />


        </>


    )
}
Contribute.Layout = BaseLayout