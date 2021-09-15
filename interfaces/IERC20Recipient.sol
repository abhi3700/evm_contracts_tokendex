// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract IERC20Recipient { 
    function tokenFallback(address _from, uint256 _value) virtual public;
}