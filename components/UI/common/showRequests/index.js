import { useWeb3 } from "@components/providers"
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react"
import { Button } from "..";


export default function Request({ isLoading, account, isAdmin, contract, web3 }) {


    const [table, setTable] = useState([])
    const [hasVoted, setHasVoted] = useState([])
    const [tokenBalance, setTokenBalance] = useState(undefined)
    const [totalDistributedTokens, setTotalTotalDistributedTokens] = useState(undefined)



    const { hooks } = useWeb3()
    const { data } = hooks.getData()
    const { network } = hooks.useNetwork()

    

    useEffect(() => {
        const sesData = window.sessionStorage.getItem("tokenBalance")
        const sesData_ = window.sessionStorage.getItem("totalDistributedTokens")
    
        setTokenBalance(JSON.parse(sesData))
        setTotalTotalDistributedTokens(JSON.parse(sesData_))

        const voted = async () => {
            console.log("voted")


            const votedArray = []
            var res = null


            const id = await contract.methods.id()
                .call()


            for (var i = 0; i < id; i++) {
                res = await contract.methods.voted(i, account)
                    .call()

                votedArray.push(res)
            }

            setHasVoted(votedArray)
            console.log(hasVoted)
            console.log(totalDistributedTokens + " TTD")

            //setArray(oldArray => [...oldArray,newValue] );

        }
        console.log(tokenBalance)
         voted()

    }, [])


    const voted = null
    const vote = async (e, id) => {
        e.preventDefault()

        try {
            await contract.methods
                .vote(id)
                .send({ from: account })

        } catch (error) {
            alert(error + " voting error")
        } finally {

            window.location.reload()
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
    //{((item[5] / totalDistributedTokens) * 100).toFixed(1)}
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


                        return (

                            <tr key={index} >

                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                                <td>{item[2]}</td>
                                <td>{web3.utils.fromWei(String(item[3]))} ETH</td>
                                <td>{item[4]}</td>
                                <td>{item[5]}  </td>

                                <td>

                                    {
                                        isAdmin ? <span className="bg-yellow-500 p-2 sm:rounded-lg">Admin cannot vote!</span> :
                                            hasVoted[index] === true ? <span className="bg-red-500 p-2 sm:rounded-lg">You have allready voted!</span> :

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
                                                item[5] < (totalDistributedTokens / 2 || item[5] == 0) ? <span className="bg-yellow-500 p-2 sm:rounded-lg">Not enough votes for this request yet!</span> :
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