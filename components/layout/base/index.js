import { useWeb3 } from "@components/providers";
import { Web3Provider } from "@components/providers";
import { Navbar, Footer, Header } from "@components/UI/common";


export default function BaseLayout({ children }) {

  
  

    return (
        <Web3Provider>
            <div className="relative max-w-7xl mx-auto px-4">

                <Navbar />
                <Header
                
               
                />
                <div className="fit">
                    {children}
                </div>
            </div>

            <Footer />

        </Web3Provider>




    )
}