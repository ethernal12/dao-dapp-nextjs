import { handler as getAccountHook } from "./useAccount"
import { handler as getNetworkHook } from "./useNetwork"
import { handler as getTokenBalance } from "./getTokens"
import { handler as getRequestData } from "./getRequestData"



export const setupHooks = (web3, provider, contract) => {

    return{
        useAccount: getAccountHook(web3, provider),
        useNetwork: getNetworkHook(web3, provider),
        getTokens: getTokenBalance(web3, provider, contract),
        getData: getRequestData(web3, provider, contract)
    }


}