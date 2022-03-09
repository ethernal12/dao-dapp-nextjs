const web3  = require('web3');
const CF = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  deployer.deploy(CF,
                  web3.utils.toBN(100000000).toString(),//DEADLINE
                  web3.utils.toBN(web3.utils.toWei("0.01","ether")).toString(),//FUNDING  GOAL
                  web3.utils.toBN(web3.utils.toWei("0.01","ether")).toString()//MINIMUM CONTRIBUTION
                  ,);
};
