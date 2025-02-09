import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 84531
    }
  }
};

export default config;