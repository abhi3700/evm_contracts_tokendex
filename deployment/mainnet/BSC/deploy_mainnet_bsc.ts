import { ethers } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const Token = await ethers.getContractFactory("MisBlockBSC");
    
    const INITIAL_MINT = 1000000000000;
    const mintAmount = convertTokenValue(Number(INITIAL_MINT * 75.5 / 100));
    console.log("mint amount:", mintAmount.toString());
    const token = await Token.deploy('0x10ED43C718714eb63d5aA57B78B54704E256024E', mintAmount);
    await token.deployed();
  
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });