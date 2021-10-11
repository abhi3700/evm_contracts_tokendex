# MIS Token contract deployment
Deployment commands are listed for various networks

## Testing
* "Hardhat network:"
	- "BSC"
        "npx hardhat run deployment/hardhat/BSC/deploy_hardhat_bsc.ts"
    - ETH
        "npx hardhat run deployment/hardhat/ETH/deploy_hardhat_eth.ts"
* "Mainnet:"
	- "BSC"
        "npx hardhat --network bsc run deployment/mainnet/BSC/deploy_mainnet_bsc.ts"
    - "ETH"
        "npx hardhat --network eth run deployment/mainnet/ETH/deploy_mainnet_eth.ts"

* "Testnet:"
	- "BSC"
        "npx hardhat --network bsctest run deployment/testnet/BSC/deploy_testnet_bsc.ts"
    - "ETH"
        "npx hardhat --network rinkeby run deployment/testnet/ETH/deploy_testnet_eth.ts"
    - "bridge"
        "npx hardhat --network rinkeby run deployment/testnet/bridge/deploy_testnet_eth_to_bsc.ts"
        "npx hardhat --network bsctest run deployment/testnet/bridge/deploy_testnet_bsc_to_eth.ts"        
