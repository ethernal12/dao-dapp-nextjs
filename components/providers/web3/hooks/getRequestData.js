import { useEffect, useState } from "react"
import { useWeb3 } from ".."

export const handler = (web3, provider, contract) => () => {

    const [table, setTable] = useState([])
    const [hasVoted, setHasVoted] = useState(false)
    const [goal, setGoal] = useState(undefined)
    const [raisedAmount, setRaisedAmount] = useState(undefined)
    const [totalTokensDistributed, setTotalTokensDistributed] = useState(undefined)

    const id = null
    const { hooks } = useWeb3()

    const { account } = hooks.useAccount()
    const {network} = hooks.useNetwork()


    useEffect(() => {

        const getData = async () => {

            console.log("get data")

            try {
                id = await contract.methods.id()
                    .call()

            } catch (error) {
                console.log(error)
            }


            const spendingRequest = []
            const res = null
            const vote = undefined
            for (let i = 0; i < id; i++) {


                try {
                    res = await contract.methods
                        .getSpendingRequest(i)
                        .call()


                } catch (error) {
                    alert(error + " set table error")
                } finally {

                    spendingRequest.push(res)

                }

            }
            setTable(spendingRequest)



            try {
                vote = await contract.methods.hasVoted(account.data)
                    .call()


            } catch (error) {
                console.log(error + "setVoter")
            }
            setHasVoted(vote)


            try {
                goal = await contract.methods.goal()
                    .call()


            } catch (error) {
                console.log(error + "setGoal")
            }
            setGoal(goal)


            const contractBalance = 0
            try {
                contractBalance = await contract.methods.raisedAmount()
                    .call()


            } catch (error) {
                console.log(error + "setGoal")
            }
            setRaisedAmount(contractBalance)


            const distrubitedTokens = 0
            try {
                contractBalance = await contract.methods.totalDestributedTokens()
                    .call()


            } catch (error) {
                console.log(error + "distrubitedTokens")
            }
            setTotalTokensDistributed(distrubitedTokens)



        }
        network.isSupported && getData()


    }, [contract])

    return {
        data: {
            table,
            hasVoted,
            goal,
            raisedAmount,
            totalTokensDistributed

        }


    }

}