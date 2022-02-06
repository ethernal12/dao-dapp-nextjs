const { createContext, useContext, useEffect, useState } = require("react");

const Web3Context = createContext(null)
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "public/utils/LoadContract";
export default function Web3Provider ({children}){

    const [web3Api, setWeb3Api] = useState(
        {
            web3: null,
            provider: null,
            contract: null,
            isInitilaized: false


        })

    useEffect(() => {


        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            //setListeners(provider)


            if (provider) {
                const web3 = new Web3(provider)
                const contract = null
                
                try {
                    contract = await loadContract("CrowdFunding", web3)

                } catch (error) {
                    console.log(error)
                }
                
                
                setWeb3Api(
                    
                    {
                        web3,
                        provider,
                        contract,
                        isInitialized: true

                        
                    })
            }
            else {
                setWeb3Api(({ ...web3Api, isInitialized: false }))
                console.error("Please install Metamask.")
            }

        }
        loadProvider()


    }, [])
    return(

        <Web3Context.Provider value={web3Api}>
            {children}

        </Web3Context.Provider>
    )
}

export function useWeb3() {

    return useContext(Web3Context)
}