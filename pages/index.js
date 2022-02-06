import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { Breadcrumbs, EthStats, Header, Hero } from "@components/UI/common";




export default function Home() {

  const { test } = useWeb3()
  return (
    <>

      {test}
      <Header />

      <Hero />

      <Breadcrumbs />

      <EthStats />



    </>


  )
}
Home.Layout = BaseLayout