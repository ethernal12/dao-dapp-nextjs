import { handler as getAccountHook } from "./useAccount"
import { handler as getNetworkHook } from "./useNetwork"




export const setupHooks = (web3, provider) => {

    return{
        useAccount: getAccountHook(web3, provider),
        useNetwork: getNetworkHook(web3, provider)

    }


}