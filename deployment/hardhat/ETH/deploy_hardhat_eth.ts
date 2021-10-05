import * as dotenv from "dotenv";
import { ethers, network } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
          },
        },
      ],
    });
    const Token = await ethers.getContractFactory("MisBlockETH");
    const INITIAL_MINT = 1000000000000;
    const mintAmount = convertTokenValue(Number(INITIAL_MINT * 75.5 / 100));
    console.log("mint amount:", mintAmount.toString());
    const token = await Token.deploy(mintAmount);
    await token.deployed();
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });