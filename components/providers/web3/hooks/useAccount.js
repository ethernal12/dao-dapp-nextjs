import { useEffect } from "react"
import useSWR from "swr"


export const handler = (web3, provider) => () => {
    const adminAddress = { "0xfe1c2c2a2442cfd8353078355c54d17d5c4d58b884f34180f661c170e1fde9ee": true } // hashed admin address

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