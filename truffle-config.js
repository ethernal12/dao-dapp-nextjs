
require('dotenv').config()

const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3  = require('web3');

module.exports = {

  contracts_build_directory: "./public/contracts",
  
  networks: {
    
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: function () {
  
          return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURAROP )
          },
      network_id: 3,
      gas: 4000000,
      gasPrice: web3.utils.toWei("20", "Gwei"),
      skipDryRun: true,
      from:"",
      timeoutblocks: 200,
      
     
  }

  },
 

 
  compilers: {
    solc: {
      version: "0.8.7",    
   
    }
  },


};
