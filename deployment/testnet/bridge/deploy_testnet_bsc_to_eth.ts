import { ethers } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';
import MisBlockBSCABI from '../../../constants/abi/MisBlockBSC.json';

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const tokenBscAddress = "0x92ebC44F32c527F11817a3a5F42C0BC8192e3825";

    const Token = await ethers.getContractFactory("BridgeBsc");
    const token = await Token.deploy(tokenBscAddress);
    await token.deployed();
  
    console.log("Token address:", token.address);

    const tokenBsccontract = new ethers.Contract(tokenBscAddress, MisBlockBSCABI, deployer);
    
    await tokenBsccontract.addMintAvailableAddress(token.address);
    await tokenBsccontract.addBurnAvailableAddress(token.address);

    console.log("Successfully Deployed");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });