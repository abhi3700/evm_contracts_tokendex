// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @title A MisBlock token contract to be launced on Ethereum network
/// @author Anderson L
/// @notice This contract is inherited from MisBlockBase.

import "./MisBlockBase.sol";

contract MisBlockETH is MisBlockBase {
    constructor(address swapRouterAddress, uint256 initialMintAmount) MisBlockBase(swapRouterAddress, initialMintAmount) {
        
    }
}