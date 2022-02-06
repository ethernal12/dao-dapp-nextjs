import Link from "next/link";
import { Button } from "@components/UI/common";


export default function Navbar() {

    return (


        <section>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative" aria-label="Global">
                    <div className="flex justify-between">
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
                                <Button variant="lightBlue">
                                    Connect wallet

                                </Button>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </section>
    )

}
