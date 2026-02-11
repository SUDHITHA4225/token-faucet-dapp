const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC-20 Faucet DApp", function () {
  let token, faucet;
  let owner, user1, user2;

  const FAUCET_AMOUNT = ethers.parseEther("100");
  const MAX_CLAIM = ethers.parseEther("1000");
  const COOLDOWN = 24 * 60 * 60;

beforeEach(async function () {
  [owner, user1, user2] = await ethers.getSigners();

  // 1. Deploy token FIRST with temporary minter (owner)
  const Token = await ethers.getContractFactory("FaucetToken");
  token = await Token.deploy(owner.address);
  await token.waitForDeployment();

  // 2. Deploy faucet with token address
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  faucet = await Faucet.deploy(token.target);
  await faucet.waitForDeployment();

  // 3. Set faucet as the minter
  await token.setMinter(faucet.target);
});

  it("allows a successful token claim", async function () {
    await expect(faucet.connect(user1).requestTokens())
      .to.emit(faucet, "TokensClaimed");

    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(FAUCET_AMOUNT);
  });

  it("reverts if user claims before cooldown", async function () {
    await faucet.connect(user1).requestTokens();

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Cooldown period not elapsed");
  });

  it("allows claim after cooldown period", async function () {
    await faucet.connect(user1).requestTokens();

    await ethers.provider.send("evm_increaseTime", [COOLDOWN]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("enforces lifetime claim limit", async function () {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN]);
      await ethers.provider.send("evm_mine");
    }

    const claimed = await faucet.totalClaimed(user1.address);
    expect(claimed).to.equal(MAX_CLAIM);

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Lifetime claim limit reached");
  });

  it("tracks users independently", async function () {
    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
    expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
  });

  it("admin can pause and unpause faucet", async function () {
    await expect(faucet.setPaused(true))
      .to.emit(faucet, "FaucetPaused")
      .withArgs(true);

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");

    await faucet.setPaused(false);
    await faucet.connect(user1).requestTokens();
  });

  it("non-admin cannot pause faucet", async function () {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin");
  });

  it("remainingAllowance returns correct value", async function () {
    await faucet.connect(user1).requestTokens();

    const remaining = await faucet.remainingAllowance(user1.address);
    expect(remaining).to.equal(MAX_CLAIM - FAUCET_AMOUNT);
  });
});
