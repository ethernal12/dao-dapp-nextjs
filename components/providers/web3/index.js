const { createContext, useContext, useEffect, useState, useMemo } = require("react");

const Web3Context = createContext(null)
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "public/utils/LoadContract";
import { useAccount } from "./hooks/useAccount";
import { setupHooks } from "./hooks/setupHooks";


export default function Web3Provider({ children }) {


    const setListeners = provider =>{
        provider.on("chainChanged", _ => window.location.reload())
    
    }

    const [web3Api, setWeb3Api] = useState(
        {
            web3: null,
            provider: null,
            contract: null,
            isLoading: true
            

        })

    useEffect(() => {


        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            


            if (provider) {
                const web3 = new Web3(provider)
                setListeners(provider)
                const contract = null

                try {
                    contract = await loadContract("CrowdFunding", web3)
                    console.log(contract)
                } catch (error) {
                    console.log(error)
                }
                
             
                setWeb3Api({
                        web3,
                        provider,
                        contract,
                        isLoading: false

                    })
            }
            else {
                setWeb3Api(({ ...web3Api, isLoading: false }))
                console.error("Please install Metamask.")
            }

        }
        loadProvider()



    }, [])



    const _web3Api = useMemo(() => {
        const { web3, provider } = web3Api
        return {
            ...web3Api,
            isWeb3Loaded: web3 != null,
            hooks: setupHooks(web3, provider),
            connect: provider ?
                async () => {
                    try {
                        await provider.request({ method: "eth_requestAccounts" })
                    } catch (error) {
                        console.log("Cannot request eth_Accounts" + error)
                        window.location.reload()
                    }


                } :
                () => { console.log("Cannot connect to metamask, please install...") }



        }


    }, [web3Api])

    return (

        <Web3Context.Provider value={_web3Api}>
            {children}

        </Web3Context.Provider>
    )
}

export function useWeb3() {

    return useContext(Web3Context)
}