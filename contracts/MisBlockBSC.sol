// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @title A MisBlock token contract to be launced on BSC network
/// @author Anderson L
/// @notice This contract is inherited from MisBlockBase.

import "./MisBlockBase.sol";

contract MisBlockBSC is MisBlockBase {
    constructor(address swapRouterAddress, uint256 initialMintAmount) MisBlockBase(swapRouterAddress, initialMintAmount) {
        
    }
}