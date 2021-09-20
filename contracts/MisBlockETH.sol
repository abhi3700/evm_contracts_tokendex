// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/// @title A MisBlock token contract to be launced on Ethereum network
/// @author Anderson L
/// @notice This contract is inherited from MisBlockBase.

import "./MisBlockBase.sol";

contract MisBlockETH is MisBlockBase {
    constructor() MisBlockBase(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D) {
        
    }
}