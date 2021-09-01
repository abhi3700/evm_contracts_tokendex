require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const DEPLOYER_PRIVATE_KEY_RINKEBY = process.env.DEPLOYER_PRIVATE_KEY_RINKEBY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      }
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY_RINKEBY}`],
    },
    kovan: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY_RINKEBY}`],
    },
  },
  solidity: "0.8.2",
};