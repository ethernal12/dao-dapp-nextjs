import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Header, Hero } from "@components/UI/common";




export default function Home() {




  const { web3, isInitialized, contract } = useWeb3()
  console.log(web3)
  
  return (
    <>

      {isInitialized ? "Is initalized" : "Not initialized"} {"/"} {contract != null ? "Contract loaded" : "Contract not loaded"}

      
      <Header />

      <Hero />

      <Breadcrumbs />

      <EthStats />



    </>


  )
}
Home.Layout = BaseLayout