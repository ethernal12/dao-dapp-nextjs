import { useEffect } from "react"
import useSWR from "swr"


export const handler = (web3, provider) => () => {


    const NETWORKS = {
        1: "Etehreum Main Network",
        3: "Ropsten Test network",
        4: "Rinkby Test network",
        5: "Goerli Test Network",
        42: "Kovan Test Network",
        56: "Binance Smart Chain",
        1337: "Ganache"

    }

    const targetNetwork = NETWORKS[process.env.GANACHE_CHAIN_ID]
    
    const { mutate,data, ...rest } = useSWR(() =>
        web3 ? "web3/network" : null,
        async () => {
           
            const chainId = await web3.eth.getChainId()
            return NETWORKS[chainId]
        }
    )

    useEffect(() => {
         provider &&
             provider.on("chainChanged", chainId => mutate([parseInt(chainId,16)]))
           
    }, [web3])

    return {
        network: {
            data,
           targetNetwork,
           isSupported : (data === targetNetwork) ?? false,
            mutate,
            ...rest
        }
    }
}