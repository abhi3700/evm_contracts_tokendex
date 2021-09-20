require('dotenv').config();
const SPEEDY_NODE_KEY = process.env.SPEEDY_NODE_KEY || "";

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
            jsonRpcUrl: `https://speedy-nodes-nyc.moralis.io/${SPEEDY_NODE_KEY}/bsc/mainnet/archive`,
          },
        },
      ],
    });
    const Token = await ethers.getContractFactory("MisBlockBSC");
    const token = await Token.deploy();
    await token.deployed();
    
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });