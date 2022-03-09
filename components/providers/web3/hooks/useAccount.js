

import { useEffect } from "react"
import useSWR from "swr"


export const handler = (web3, provider) => () => {
    const ganacheAdmin = process.env.GANACHEISADMIN
    const ropestenAdmin= process.env.ROPSTENISADMIN
  

    const adminAddress = { [ganacheAdmin] : true } // hashed admin address (use keccak-256 and hex address without 0x to get the hash)
   
    const { data, mutate, ...restRes } = useSWR(() =>
        web3 ? "web3/accounts" : null ,
        async () => {

            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        }


    )

    useEffect(() => {
        window.ethereum &&
            window.ethereum.on("accountsChanged", accounts => { mutate(accounts[0]) })

    }, [provider])
   
    

    return {
        account: {
            data,
            isAdmin: (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
            mutate,
            ...restRes
        }


    }
}