// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/// @title A MisBlock token contract to be launced on BSC network
/// @author Anderson L
/// @notice This contract is inherited from MisBlockBase.

import "./MisBlockBase.sol";

contract MisBlockBSC is MisBlockBase {
    constructor() MisBlockBase(0x10ED43C718714eb63d5aA57B78B54704E256024E) {
        
    }
}