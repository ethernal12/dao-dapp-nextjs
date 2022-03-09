import { useWeb3 } from "@components/providers"
import { useEffect, useState } from "react"
import { Button } from ".."

import { toast } from 'react-toastify';
import { withToast } from "@utils/toast";


export default function Request({ account, contract, web3 }) {
    const { hooks } = useWeb3()
    const [table, setTable] = useState([])
    const [raisedAmount, setRaisedAmount] = useState(undefined)

    const { network } = hooks.useNetwork()



    useEffect(() => {
      
        const data = window.sessionStorage.getItem("raisedAmount")
        setRaisedAmount(JSON.parse(data))
        console.log(raisedAmount)

    })
    
    

    const createSpendingRequest = async (e) => {


        e.preventDefault()

        const title = e.target.elements[0].value;
        const description = e.target.elements[1].value;
        const recipient = e.target.elements[2].value;
        const value = e.target.elements[3].value;
        const valToWei = web3.utils.toWei(value, "ether");
       

        await contract.methods
            .spendingRequest(title.toString(), description.toString(), recipient, valToWei)
            .send({ from: account })
            .on('receipt', receipt => {

                window.location.reload(true);
            })

            .on("error", console.error);


    }


    if (!network.isSupported)
        return null

    return (
    

        <div className="text-black flex bg-blue-500 mt-5 " style={{ width: "50%" }}>
           {raisedAmount}
            <form onSubmit={e => withToast(createSpendingRequest(e))} className="ml-3 my-2">

                <label className="text-white" ><h1>Create spending request</h1> </label>

                <div className="form-group mt-2">
                    <label className="text-white"><h2>Request title</h2> </label>
                    <input type="text" className="form-control" id="name" style={{ width: "200px" }} />
                </div>

                <div className="form-group">
                    <label className="text-white" ><h2>Request description</h2> </label>
                    <input type="text" className="form-control" id="name" style={{ width: "200px" }} />
                </div>
                <div className="form-group">
                    <label className="text-white" ><h2>Request recipient</h2> </label>
                    <input type="text" className="form-control" id="name" style={{ width: "300px" }} />
                </div>
                <div className="form-group">
                    <label className="text-white" ><h2>Request value in ETH</h2> </label>
                    <input type="text" className="form-control" id="name" style={{ width: "100px" }} />
                </div>

                <Button variant="lightPurple" type="submit"  >Submit request</Button>
            </form>

        </div>


    )
}