const { ethers } = require("hardhat");

async function main() {
  // get the first account Hardhat spins up
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  const Token = await ethers.getContractFactory("FrontierToken");
  // issuer == deployer for this test; swap in treasury later
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();

  console.log("FrontierToken deployed at:", await token.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
