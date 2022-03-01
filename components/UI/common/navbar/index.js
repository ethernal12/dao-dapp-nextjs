import Link from "next/link";
import ActiveLink from "../link";
import { Button } from "@components/UI/common";
import { useWeb3 } from "@components/providers";



export default function Navbar() {
    const { connect, isWeb3Loaded, isLoading, hooks } = useWeb3()
    const { account } = hooks.useAccount()
  
    

 

    return (


        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8 bg-gray-500">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between items-center">
                        <div>

                            <ActiveLink href="/" >
                                <a className="font-medium mr-8 text-black hover:text-yellow-500">Home</a>

                            </ActiveLink>
                            <ActiveLink href="/contribute" >
                                <a className="font-medium mr-8 text-black hover:text-yellow-500">Contribute</a>
                            </ActiveLink>
                            {account.isAdmin &&
                                <ActiveLink href="/createRequest" >
                                    <a className="font-medium mr-8 text-black hover:text-yellow-500">Create request</a>
                                </ActiveLink>
                            }


                            <ActiveLink href="/createdRequests" >
                                <a className="font-medium mr-8 text-black hover:text-yellow-500">Created requests</a>
                            </ActiveLink>

                        </div>
                        <div>
                            <ActiveLink href="#" >

                                <a className="font-medium mr-8 text-black hover:text-gray-900">Company</a>

                            </ActiveLink>
                            <ActiveLink href="#" >
                                <a className="font-medium mr-8 text-indigo-600 hover:text-indigo-500">Log in</a>

                            </ActiveLink>

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
