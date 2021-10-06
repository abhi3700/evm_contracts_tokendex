import { ethers } from 'hardhat';

export function convertTokenValue(token: number) {
    return ethers.BigNumber.from(10).pow(18).mul(token);
}