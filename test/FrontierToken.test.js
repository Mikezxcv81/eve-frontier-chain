const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployFixture() {
  const [deployer, treasury, alice] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("FrontierToken");
  const token = await Token.deploy(treasury.address);
  await token.waitForDeployment();
  return { token, deployer, treasury, alice };
}

describe("FrontierToken", function () {
  it("premints 1 000 000 to treasury", async () => {
    const { token, treasury } = await deployFixture();
    const bal = await token.balanceOf(treasury.address);
    expect(bal).to.equal(ethers.parseEther("1000000"));
  });

  it("only MINTER_ROLE can mint", async () => {
    const { token, treasury, alice } = await deployFixture();
    // alice (no role) should revert
    await expect(token.connect(alice).mint(alice, 1)).to.be.reverted;
    // treasury (has role) succeeds
    await expect(token.connect(treasury).mint(alice, 5)).not.to.be.reverted;
  });

  it("burn reduces totalSupply", async () => {
    const { token, treasury } = await deployFixture();
    const supply1 = await token.totalSupply();
    await token.connect(treasury).burn(ethers.parseEther("10"));
    const supply2 = await token.totalSupply();
    expect(supply2).to.equal(supply1 - ethers.parseEther("10"));
  });

  it("ERC20Permit flow works", async () => {
    const { token, treasury, alice } = await deployFixture();

    const nonce = await token.nonces(treasury.address);
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const sig = await treasury.signTypedData(
      {
        name: "Tribe Token",
        version: "1",
        chainId,
        verifyingContract: await token.getAddress(),
      },
      {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      {
        owner: treasury.address,
        spender: alice.address,
        value: ethers.parseEther("100"),
        nonce,
        deadline,
      }
    );

    const { v, r, s } = ethers.Signature.from(sig);

    await token
      .connect(alice)
      .permit(treasury.address, alice.address, ethers.parseEther("100"), deadline, v, r, s);

    await token
      .connect(alice)
      .transferFrom(treasury.address, alice.address, ethers.parseEther("40"));

    expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther("40"));
  });

  it("ERC20Votes snapshots update on transfer", async () => {
    const { token, treasury, alice } = await deployFixture();

    await token.connect(treasury).delegate(treasury.address);
    const before = await token.getVotes(treasury.address);

    await token.connect(treasury).transfer(alice.address, ethers.parseEther("1"));

    const after = await token.getVotes(treasury.address);
    const diff  = before - after;

    expect(diff).to.equal(ethers.parseEther("1"));
  });
});
