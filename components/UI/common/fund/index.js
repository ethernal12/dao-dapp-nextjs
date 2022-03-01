import { useWeb3 } from "@components/providers"
import { useEffect, useState } from "react"
import { Button } from ".."

import { toast } from 'react-toastify';
import { withToast } from "@utils/toast";


export default function Contribute({ account, isAdmin, contract, web3 }) {
    const { hooks } = useWeb3()

    const { tokens } = hooks.getTokens()
    const [tokenBalance, setTokenBalance] = useState(0)
    
    const { network } = hooks.useNetwork()

    console.log(isAdmin)

    const fund = async (e) => {
        e.preventDefault()
        const value = (e.target.elements[0].value).toString();
        try {

            const result = await contract.methods.contribute()
                .send({ from: account, value: web3.utils.toWei(value, "ether") })

            return result

        } catch (error) {
            throw new Error(error.message)

        } finally {
            const tokens = await contract.methods.balanceOfDaotAddr(account)
                .call()
            const distributedTokens = await contract.methods.totalDestributedTokens()
                .call()

            window.localStorage.setItem("tokenBalance", JSON.stringify(tokens))
            window.localStorage.setItem("totalDistributedTokens", JSON.stringify(distributedTokens))
            window.location.reload()

        }


    }

    useEffect(() => {
        const data = window.localStorage.getItem("tokenBalance")
        setTokenBalance(JSON.parse(data))

    }, [tokenBalance])

    if (!network.isSupported)
        return null

    return (



        <div className="bg-blue-500">
            <div>
                {!isAdmin &&

                    <form onSubmit={e => withToast(fund(e))}>

                        <input style={{ width: "70px", height: "50px" }} type="text" className="form-control mr-2 rounded-md ml-3 my-2 text-black" id="contributors" />
                        <Button
                            variant="lightPurple" type="submit">Contribute
                        </Button>

                    </form>

                }


            </div>
            <div className="bg-blue-200">

                Your token balance: {tokenBalance} <strong>DAOT</strong>


            </div>
        </div>


    )
}