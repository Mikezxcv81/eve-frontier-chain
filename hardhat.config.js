// hardhat.config.js
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

// ── helper ──
// Accept only strings that start with 0x and have 64 hex chars
const isValidPrivKey = /^0x[0-9a-fA-F]{64}$/.test(process.env.PRIVKEY || "");
const accounts = isValidPrivKey ? [process.env.PRIVKEY] : [];

module.exports = {
  solidity: "0.8.24",

  networks: {
    // Local Hardhat network requires no config; default is fine
    localhost: {},

    // Public EVE Frontier testnet
    garnet: {
      url: "https://garnet.rpc.redstone.xyz",
      chainId: 17069,
      accounts,            // [] when key is absent/invalid
    },

    // Main L2 that Frontier will eventually use
    redstone: {
      url: "https://rpc.redstone.xyz",
      chainId: 690,
      accounts,
    },
  },
};
