async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy token with temporary minter
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();

  // 2. Deploy faucet with token address
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(token.target);
  await faucet.waitForDeployment();

  // 3. Set faucet as minter
  await token.setMinter(faucet.target);

  console.log("Token deployed to:", token.target);
  console.log("Faucet deployed to:", faucet.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
