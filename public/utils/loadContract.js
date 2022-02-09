


export const loadContract = async (name, web3) => {

  
    
    const NETWORK_ID = process.env.GANACHE_NETWORK_ID
    const res = await fetch(`/contracts/${name}.json`)

    const Artifact = await res.json()
   
  
    let contract = null

    try {
       
        contract = new web3.eth.Contract(
            Artifact.abi,
            Artifact.networks[NETWORK_ID].address
        )


    } catch (error) {
        console.log(`Contract ${name} failed to load => ` + error)
    }

    return contract
}


