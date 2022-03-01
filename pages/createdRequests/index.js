import { BaseLayout } from "@components/layout";
import { useWeb3 } from "@components/providers";
import { ShowRequests } from "@components/UI/common";




export default function CreatedRequests() {
    const { web3, contract, hooks, isLoading } = useWeb3()

    const { account } = hooks.useAccount()
    const { isAdmin } = hooks.useAccount()
    const { tokens } = hooks.getTokens()

    
    return (
        <>

            <ShowRequests
                account={account.data}
                isAdmin={account.isAdmin}
                contract={contract}
                web3={web3}
                tokenBalance={tokens.tokenBalance}
                isLoading = {isLoading}

            />

        </>


    )
}
CreatedRequests.Layout = BaseLayout