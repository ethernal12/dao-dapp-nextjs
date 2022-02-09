import Link from "next/link";
import { Button } from "@components/UI/common";
import { useWeb3 } from "@components/providers";



export default function Navbar() {
    const { connect, isWeb3Loaded, isLoading, hooks } = useWeb3()

    const {account} = hooks.useAccount()
    
    return (

        
        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between items-center">
                        <div>
                        
                            <Link href="#" >
                                <a className="font-medium mr-8 text-gray-500 hover:text-yellow-500">Accounts and contracts info</a>

                            </Link>
                            <Link href="#" >
                                <a className="font-medium mr-8 text-gray-500 hover:text-yellow-500">Funding request</a>
                            </Link>

                            <Link href="#" >
                                <a className="font-medium mr-8 text-gray-500 hover:text-yellow-500">Requests</a>
                            </Link>

                            <Link href="#" >
                                <a className="font-medium mr-8 text-gray-500 hover:text-yellow-500">Contract funding info</a>
                            </Link>

                        </div>
                        <div>
                            <Link href="#" >

                                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">Company</a>

                            </Link>
                            <Link href="#" >
                                <a className="font-medium mr-8 text-indigo-600 hover:text-indigo-500">Log in</a>

                            </Link>

                            <div className="my-2">
                                {isWeb3Loaded && account.data ?
                                      <Button

                                      variant="lightBlue"

                                  >
                                      {account.isAdmin ? "Hi there Admin" : "Hi there"}
                                   

                                  </Button> : isLoading ?

                                    <Button

                                        onClick={connect}
                                        disabled={true}
                                        variant="lightBlue"

                                    >
                                        Loading

                                    </Button> : isWeb3Loaded ?

                                        <Button
                                            onClick={connect}

                                            variant="lightBlue"

                                        >
                                            Connect wallet

                                        </Button> :

                                        <Button
                                            onClick={() => window.open("https://metamask.io/")}
                                            variant="lightBlue"

                                        >
                                            Install  metamask


                                        </Button>

                                }
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </section>
    )

}
