import { useWeb3 } from "@components/providers"
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react"
import Table from 'react-tailwind-table';
import { isCallChain } from "typescript";
import { Button } from "..";
import Message from "../message";

export default function Request({ isLoading, account, isAdmin, contract, web3 }) {

    const { hooks } = useWeb3()
    const [table, setTable] = useState([])
    const [hasVoted, setHasVoted] = useState(undefined)
    const { data } = hooks.getData()
    const [tokenBalance, setTokenBalance] = useState(undefined)
    const [totalDistributedTokens, setTotalTotalDistributedTokens] = useState(undefined)
    const { network } = hooks.useNetwork()


    useEffect(() => {
        const data = window.sessionStorage.getItem("tokenBalance")
        const data_ = window.sessionStorage.getItem("totalDistributedTokens")

        setTokenBalance(JSON.parse(data))
        setTotalTotalDistributedTokens(JSON.parse(data_))
       

    })
    const votedx = async (index) => {
        console.log(index)
        try {
            const voted = await contract.methods.hasVotedForRequest(index)
                .call()
                console.log(voted)
            setHasVoted(voted)

        } catch (error) {
            alert(error)
        }
    }


    const voted = undefined
    const vote = async (e, id) => {
        e.preventDefault()



        try {
            await contract.methods
                .vote(id)
                .send({ from: account })


        } catch (error) {
            alert(error + " voting error")
        } finally {
            window.alert("Sucessfully voted!")
            const voted = await contract.methods.hasVotedForRequest(id)
                .call()
            setHasVoted(voted)
        }

    }
    const finalizeRequest = async (e, index) => {

        e.preventDefault()
        try {

            await contract.methods
                .transferRequestFunds(index)
                .send({ from: account })

        } catch (error) {
            alert(error)

        }

    }

    if (!network.isSupported)
        return null
    return (
        <div className="">
            <table >
                <thead >
                    <tr style={{ color: "black" }}>

                        <th >Id#</th>
                        <th >Request title</th>
                        <th >Description</th>
                        <th >Value</th>
                        <th >Recipient</th>
                        <th >Percentage of votes</th>
                        <th >Vote</th>
                        <th >Finalize request</th>
                    </tr>

                </thead>

                <tbody >

                    {data.table.slice(0, data.table.length).map((item, index) => {
                        
                         
                            votedx(index)

                   
                        return (

                            <tr key={index} >

                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                                <td>{item[2]}</td>
                                <td>{web3.utils.fromWei(String(item[3]))} ETH</td>
                                <td>{item[4]}</td>
                                <td>{((item[5] / totalDistributedTokens) * 100).toFixed(1)} </td>


                                <td>
                                    {

                                        hasVoted ? <span className="bg-red-500 p-2 sm:rounded-lg">You have allready voted!</span> :
                                            isAdmin ? <span className="bg-yellow-500 p-2 sm:rounded-lg"> Admin cannot vote!</span> :
                                                parseInt(tokenBalance) === 0 ? <span className="bg-red-500 p-2 sm:rounded-lg"> Must hold tokens to vote! </span> :
                                                    (


                                                        <form onSubmit={e => withToast(vote(e, index))}>

                                                            <Button
                                                                style={{ color: "white", background: "#1a5e5b" }}
                                                                type="submit"
                                                                className="btn btn-primary">
                                                                Vote
                                                            </Button>
                                                        </form>

                                                    )}
                                </td>
                                <td>

                                    {item[6].toString() === "true" ? <span className="bg-green-500 p-2 sm:rounded-lg"> Allready finalized!</span> :
                                        !isAdmin ? <span className="bg-red-500 p-2 sm:rounded-lg">Only admin!</span> :

                                            parseInt(data.goal) > parseInt(data.raisedAmount) ? <span className="bg-red-500 p-2 sm:rounded-lg">The goal not reached yet!</span> :
                                                item[5] < (data.totalTokensDistributed / 2 || item[5] == 0) ? <span className="bg-yellow-500 p-2 sm:rounded-lg">Not enough votes for this request yet!</span> :
                                                    (
                                                        <td >


                                                            <form onSubmit={e => withToast(finalizeRequest(e, index))}>
                                                                <Button
                                                                    style={{ color: "white", background: "#1a5e5b" }}
                                                                    type="submit"
                                                                    className="btn btn-primary">
                                                                    Finalize request
                                                                </Button>

                                                            </form>


                                                        </td>
                                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </div>
    )
}