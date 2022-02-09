import { useWeb3 } from "@components/providers"




export default function Header({ network, account, isSupported, targetNetwork, contract }) {

   

    return (

        <section className="text-white bg-indigo-600">
            <div className="p-8">
                
                <h1 className="text-2xl">Hello, {account} </h1>
                <h2 className="subtitle mb-5 text-xl">I hope you are having a great day!</h2>
                <div className="flex justify-between items-center">
                    <div className="sm:flex sm:justify-center lg:justify-start">
                        <div className="rounded-md shadow">

                        </div>
                    </div>
                    <div>
                        {isSupported ?

                            <div>
                                <span>Currently on </span>
                                <strong className="text-2xl">{network} &#x2705;</strong>
                            </div>:
                                <div >
                                <div>On the wrong network : <span className="font-bold text-red-500" >{network} &#x274C;</span> </div>
                                <strong className="text-2xl">Switch to <span className="font-bold text-green-500">{targetNetwork} </span></strong>
                            </div>
                    
                    }

                    </div>
                </div>
            </div>
        </section>



    )
}