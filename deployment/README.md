# MIS Token contract deployment
Deployment commands are listed for various networks

## Testing
* "Hardhat network:"
	- "BSC"
        "npx hardhat run deployment/hardhat/BSC/deploy_hardhat_bsc.js"
    - ETH
        "npx hardhat run deployment/hardhat/ETH/deploy_hardhat_eth.js"
* "Mainnet:"
	- "BSC"
        "npx hardhat --network bsc run deployment/mainnet/BSC/deploy_mainnet_bsc.js"
    - "ETH"
        "npx hardhat --network eth run deployment/mainnet/ETH/deploy_mainnet_eth.js"

* "Testnet:"
	- "BSC"
        "npx hardhat --network bsctest run deployment/testnet/BSC/deploy_mainnet_bsc.js"
    - "ETH"
        "npx hardhat --network rinkeby run deployment/testnet/ETH/deploy_mainnet_eth.js"
