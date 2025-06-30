require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const isKey = /^0x[0-9a-fA-F]{64}$/.test(process.env.PRIVKEY || "");
const accounts = isKey ? [process.env.PRIVKEY] : [];

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {},
    garnet: {
      url: "https://rpc.garnetchain.com",   // ✅ correct host
      chainId: 17069,
      accounts,
    },
    redstone: {
      url: "https://rpc.redstonechain.com",
      chainId: 690,
      accounts,
    },
  },
};
