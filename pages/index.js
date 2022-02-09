import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Header, Hero } from "@components/UI/common";




export default function Home() {
  const { web3, isLoading, contract } = useWeb3()
  const { hooks } = useWeb3()
  const { network } = hooks.useNetwork()
  const { account } = hooks.useAccount()


  return (
    <>

      {isLoading ? "Is loading web3..." : web3 ? "Web3 loaded" : "Please install metamask"} {"/"} {contract != null ? "Contract loaded" : "Contract not loaded"}


      <Header
        network={network.data}
        account={account.data}
        isSupported = {network.isSupported}
        targetNetwork = {network.targetNetwork}
        contract = {contract}
      />

      <Hero />

      <Breadcrumbs />

      <EthStats />



    </>


  )
}
Home.Layout = BaseLayout