import { useEffect, useState } from "react"

import { useWeb3 } from ".."



export const handler = (web3, provider, contract) => () => {
    const { hooks } = useWeb3()
    const { network } = hooks.useNetwork()


    const [account, setAccount] = useState(undefined)
    const [tokenBalance, setTokenBalance] = useState(undefined)


    useEffect(() => {
        window.ethereum &&
            window.ethereum.on("accountsChanged", accounts => { setAccount(accounts[0]) })
        console.log("account changed")

    }, [provider])




    useEffect(() => {

        const getTokens = async () => {
          
            const tokens = await contract.methods.balanceOfDaotAddr(account)
                .call()
            const distributedTokens = await contract.methods.totalDestributedTokens()
                .call()
            const raisedAmount = await contract.methods.raisedAmount()
                .call()

            window.localStorage.setItem("tokenBalance", JSON.stringify(tokens))
            window.localStorage.setItem("totalDistributedTokens", JSON.stringify(distributedTokens))
            window.localStorage.setItem("raisedAmount", JSON.stringify(raisedAmount))
            setTokenBalance(tokens)
        }
        account && network.isSupported && getTokens()


    })




    return {
        tokens: {

            tokenBalance
        }


    }
}