// scripts/deploy.js
require("dotenv").config();
const hre    = require("hardhat");
const { ethers } = hre;
const fs     = require("fs");
const path   = require("path");

async function main () {
  /***************** 0. choose deployer & treasury *****************/
  const signers       = await ethers.getSigners();
  const deployer      = signers[0];
  const treasuryAddr  =
        process.env.TREASURY           // explicit env var
     ?? (signers[1] ? signers[1].address : deployer.address); // or 2nd signer / self

  console.log(`Network   : ${hre.network.name}`);
  console.log(`Deployer  : ${deployer.address}`);
  if (treasuryAddr === deployer.address) {
    console.log(`Treasury  : ${treasuryAddr} (same as deployer)\n`);
  } else {
    console.log(`Treasury  : ${treasuryAddr}\n`);
  }

  /***************** 1. FrontierToken ******************************/
  const Token = await ethers.getContractFactory("FrontierToken");
  const token = await Token.deploy(treasuryAddr);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log(`FrontierToken  deployed → ${tokenAddr}`);

  /***************** 2. RewardMinter *******************************/
  const RewardMinter = await ethers.getContractFactory("RewardMinter");
  const minter = await RewardMinter.deploy(tokenAddr);
  await minter.waitForDeployment();
  const minterAddr = await minter.getAddress();
  console.log(`RewardMinter   deployed → ${minterAddr}`);

  /***************** 3. SinkManager *******************************/
  const SinkManager = await ethers.getContractFactory("SinkManager");
  const sink = await SinkManager.deploy(tokenAddr);
  await sink.waitForDeployment();
  const sinkAddr = await sink.getAddress();
  console.log(`SinkManager    deployed → ${sinkAddr}`);

  /***************** 4. Role wiring *******************************/
  await (await token.grantRole(await token.MINTER_ROLE(), minterAddr)).wait();
  console.log("✓ MINTER_ROLE granted to RewardMinter");

  await (await sink.grantRole(await sink.SINK_CALLER(), deployer.address)).wait();
  console.log("✓ SINK_CALLER granted to deployer (temporary)");

  /***************** 5. Persist addresses *************************/
  const outDir  = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, `${hre.network.name}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        network:      hre.network.name,
        deployer:     deployer.address,
        treasury:     treasuryAddr,
        token:        tokenAddr,
        rewardMinter: minterAddr,
        sinkManager:  sinkAddr,
      },
      null,
      2
    )
  );
  console.log(`\n📄 Deployment map written to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
