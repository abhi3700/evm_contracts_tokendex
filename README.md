# Token Contract

## About

## Installation

## Usage

### Build
```bash
$ npx hardhat compile
```

### Test
```bash
$ npx hardhat test
```

### Deploying contracts to localhost Hardhat EVM
```bash
$ npx hardhat node
$ npx hardhat run --network localhost deployment/hardhat/swap.ts
```

### Deploying contracts to Rinkeby Testnet
* Environment variables
	- Create a `.env` file with its values:
```
DEPLOYER_PRIVATE_KEY_RINKEBY=<private_key_without_0x>
INFURA_API_KEY=<SECRET_KEY>
REPORT_GAS=<true_or_false>
```
* Deploy Private Sale contract

