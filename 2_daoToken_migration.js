const DaoToken = artifacts.require("DAOT");

module.exports = function (deployer, account) {
  deployer.deploy(DaoToken, 100000000,account ); 
};
