// hardhat.config.js
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",

  networks: {
    garnet: {
      url: "https://garnet.rpc.redstone.xyz",
      chainId: 17069,
      // only inject the key if it’s actually set
      accounts: process.env.PRIVKEY ? [process.env.PRIVKEY] : [],
    },
    redstone: {
      url: "https://rpc.redstone.xyz",
      chainId: 690,
      accounts: process.env.PRIVKEY ? [process.env.PRIVKEY] : [],
    },
  },
};
