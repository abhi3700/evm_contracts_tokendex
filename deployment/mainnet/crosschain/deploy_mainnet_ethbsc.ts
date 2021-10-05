// 1. deploy the token contract to ETH mainnet

// 2. mint the 24.5% tokens to admin

// 3. deploy the token contract to BSC mainnet

// 4. mint the 75.5% tokens to admin


// import { ethers } from 'hardhat';
// import { convertTokenValue } from '../../../helper/tokenHelper';

// async function main() {
    
//     // ethers is avaialble in the global scope
//     const [deployer] = await ethers.getSigners();
//     console.log(
//       "Deploying the contracts with the account:",
//       await deployer.getAddress()
//     );
  
//     console.log("Account balance:", (await deployer.getBalance()).toString());
    
//     const INITIAL_MINT = 1000000000000;
//     const bscMintAmount = convertTokenValue(Number(INITIAL_MINT * 75.5 / 100));
//     const ethMintAmount = convertTokenValue(Number(INITIAL_MINT * 24.5 / 100));
    
//     console.log("Bsc Mint amount:", bscMintAmount.toString());
//     const bscToken = await ethers.getContractFactory("MisBlockBSC");    
//     const bsctoken = await bscToken.deploy(bscMintAmount);
//     await bsctoken.deployed();
  
//     console.log("Token address:", bsctoken.address);

//     console.log("Eth Mint amount:", ethMintAmount.toString());
//     const ethToken = await ethers.getContractFactory("MisBlockETH");
//     const ethtoken = await ethToken.deploy(ethMintAmount);
//     await ethtoken.deployed();
  
//     console.log("Token address:", ethtoken.address);
//   }
  
// main()
// .then(() => process.exit(0))
// .catch((error) => {
//     console.error(error);
//     process.exit(1);
// });