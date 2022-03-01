import { useWeb3 } from "@components/providers"
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react"
import Table from 'react-tailwind-table';
import { isCallChain } from "typescript";
import { Button } from "..";

export default function Request({ isLoading, account, isAdmin, contract, web3 }) {

    const { hooks } = useWeb3()
    const [table, setTable] = useState([])
    const [hasVoted, setHasVoted] = useState(false)
    const { data } = hooks.getData()
    const [tokenBalance, setTokenBalance] = useState(undefined)
    const [totalDistributedTokens, setTotalTotalDistributedTokens] = useState(undefined)


    const {network} = hooks.useNetwork()
    useEffect(() => {
        const data = window.localStorage.getItem("tokenBalance")
        const data_ = window.localStorage.getItem("totalDistributedTokens")
        setTokenBalance(JSON.parse(data))
        setTotalTotalDistributedTokens(JSON.parse(data_))

    })


    const voted = false
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
            voted = await contract.methods.voted(account)
                .call()
            setHasVoted(voted)
        }
        console.log(hasVoted)

    }

    if (!network.isSupported )
    return null
    return (
        <table  >
            <thead >
                <tr style={{ color: "black" }}>

                    <th >Id#</th>
                    <th >Request title</th>
                    <th >Description</th>
                    <th >Value</th>
                    <th >Recipient</th>
                    <th >percentage of votes</th>
                    <th >Vote</th>
                    <th >Finalize request</th>
                </tr>

            </thead>

            <tbody>

                {data.table.slice(0, data.table.length).map((item, index) => {
                    return (

                        <tr key={index} >

                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                            <td>{item[2]}</td>
                            <td>{web3.utils.fromWei(String(item[3]))} ETH</td>
                            <td>{item[4]}</td>
                            <td>  {((item[5] / totalDistributedTokens) * 100).toFixed(1)} </td>


                            <td>
                                {

                                    hasVoted ? <span>You have allready voted!</span> :
                                        isAdmin ? <span> Admin cannot vote!</span> :
                                            parseInt(tokenBalance) === 0 ? <span> Must hold tokens to vote! </span> :
                                                (


                                                    <form onSubmit={e => withToast(vote(e, index))}>
                                                        <div className="form-group">
                                                            <label htmlFor="choice">Choice</label>
                                                            <select className="form-control" id="choice">

                                                                <option
                                                                    key={index}
                                                                    value={index}>
                                                                    ID#{item[0]}
                                                                </option>

                                                            </select>
                                                        </div>
                                                        <Button
                                                            style={{ color: "white", background: "#1a5e5b" }}
                                                            type="submit"
                                                            className="btn btn-primary">
                                                            Vote
                                                        </Button>
                                                    </form>

                                                )}
                            </td>

                            {item[6].toString() === "true" ? <span >Allready finalized!</span> :
                                !isAdmin ? <span>Only admin!!</span> :

                                    !(data.goal <= data.raisedAmount) ? <span >The goal not reached yet!</span> :
                                        item[5] < (data.totalTokensDistributed / 2 || item[5] == 0) ? <span >Not enough votes for this request yet!</span> :
                                            (
                                                <td >


                                                    <form onSubmit={e => finalizeRequest(e, index)}>
                                                        <Button
                                                            style={{ color: "white", background: "#1a5e5b" }}
                                                            type="submit"
                                                            className="btn btn-primary">
                                                            Finalize request
                                                        </Button>

                                                    </form>


                                                </td>
                                            )}
                        </tr>
                    )
                })}
            </tbody>

        </table>

    )
}