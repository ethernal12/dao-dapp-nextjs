const { isPropertyAccessChain } = require('typescript');

require('dotenv').config()

module.exports = {

  env:{
    GANACHEISADMIN : process.env.GANACHEISADMIN,
    ROPSTENISADMIN: process.env.ROPSTENISADMIN,
    GANACHE_NETWORK_ID : process.env.GANACHE_NETWORK_ID,
    GANACHE_CHAIN_ID : process.env.GANACHE_CHAIN_ID

  },
  reactStrictMode: true,
};
