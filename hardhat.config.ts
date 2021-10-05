import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

dotenv.config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const SPEEDY_NODE_KEY = process.env.SPEEDY_NODE_KEY || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        //url: `https://speedy-nodes-nyc.moralis.io/${SPEEDY_NODE_KEY}/bsc/mainnet/archive`,
      }
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },    
    eth: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },    
    bsctest: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};