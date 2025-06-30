// hardhat.config.js
//
// Base compiler + network setup for the Tribela / EVE-Frontier chain workspace
// ▸ Loads .env for private keys
// ▸ Guards against empty / malformed keys so tests run without config
// ▸ Configures localhost, Garnet test-L2, and Redstone main-L2
//

require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

// ── helper ──
// Accept key ONLY if it’s 0x + 64 hex chars; otherwise omit accounts
const isPrivKey = /^0x[0-9a-fA-F]{64}$/.test(process.env.PRIVKEY || "");
const accounts  = isPrivKey ? [process.env.PRIVKEY] : [];

module.exports = {
  solidity: "0.8.24",

  networks: {
    // Hardhat’s in-memory dev chain (chainId 31337)
    localhost: {},

    // Garnet — public OP-Stack L2 testnet used by EVE Frontier
    garnet: {
      url:      "https://rpc.garnetchain.com",  // ✅ official RPC
      chainId:  17069,
      accounts,                                 // [] when key missing
    },

    // Redstone — main L2 planned for production
    redstone: {
      url:      "https://rpc.redstonechain.com",
      chainId:  690,
      accounts,
    },
  },
};
