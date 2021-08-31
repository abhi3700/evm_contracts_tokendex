// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MisBlock is ERC20 {
    constructor() public ERC20("MisBlock", "MIB") {

    }

}