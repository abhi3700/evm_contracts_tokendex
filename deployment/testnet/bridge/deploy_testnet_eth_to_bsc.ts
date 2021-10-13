import { ethers } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';
import MisBlockETHABI from '../../../constants/abi/MisBlockETH.json';

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const tokenEthAddress = "0xE0a3280F68051320E5f7d892e678C1A63a797D71";

    const Token = await ethers.getContractFactory("BridgeEth");
    const token = await Token.deploy(tokenEthAddress);
    await token.deployed();
  
    console.log("Token address:", token.address);

    const tokenEthcontract = new ethers.Contract(tokenEthAddress, MisBlockETHABI, deployer);
    
    await tokenEthcontract.addMintAvailableAddress(token.address);
    await tokenEthcontract.addBurnAvailableAddress(token.address);

    console.log("Successfully Deployed");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });