import { useWeb3 } from "@components/providers"
import { Button } from ".."




export default function Header({ connect }) {
    const { web3, isLoading, contract, hooks, isWeb3Loaded } = useWeb3()

    const { network, isSupported } = hooks.useNetwork()
    const { account } = hooks.useAccount()



    return (

        <section className="text-white bg-indigo-600">
            <div className="p-8">

                {network.isSupported &&


                    <div><h1 className="text-2xl">Hello, {account.data} </h1>
                        <h2 className="subtitle mb-5 text-xl">I hope you are having a great day!</h2>
                    </div>

                }


                <div className="flex justify-between items-center">
                    <div className="sm:flex sm:justify-center lg:justify-start">
                        <div className="rounded-md shadow">

                            <div >
                                {network.isSupported ?

                                    <div className="sm:flex"  >
                                        <div className="text-2xl">Currently on {network.data} &#x2705; </div>

                                    </div> :
                                    <div >
                                        <div>On the wrong network : <span className="font-bold text-red-500" >{network.data} &#x274C;</span> </div>
                                        <strong className="text-2xl">Switch to <span className="font-bold text-green-500">{network.targetNetwork} </span></strong>
                                    </div>

                                }

                            </div>
                        </div>
                    </div>
                    {isLoading ?

                        <Button
                            onClick={connect}>
                            Loading...


                        </Button> :
                        isWeb3Loaded ?
                            account.data && network.isSupported ?
                                <Button
                                    variant="purple"
                                    hovarable={false}
                                >
                                    Connected {account.isAdmin && "Admin"}


                                </Button> :
                                <Button
                                    disabled={false}
                                    onClick={connect}>
                                   

                                </Button> :
                            <Button
                                disabled={false}
                                onClick={() => window.open("https://metamask.io/")}>
                                Install metamask
                            </Button>

                    }


                    {/* <Button
                        disabled={false}
                        onClick={() => window.open("https://metamask.io/")}>
                        Install metamask
                    </Button> */}

                </div>
            </div>

        </section >



    )
}