import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const LSDOptionsPool = await ethers.getContractFactory("LSDOptionsPool");
  const pool = await LSDOptionsPool.deploy();
  await pool.waitForDeployment();

  console.log("LSDOptionsPool deployed to:", await pool.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });