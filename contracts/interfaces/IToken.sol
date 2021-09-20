// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;


interface IToken {
  function balanceOf(address owner) external view returns (uint256);
  // function allowance(address owner, address spender) external view returns (unit);
  // function approve(address spender, uint value) external returns (bool);
  // function transfer(address to, uint value) external returns (bool);
  // function transferFrom(address from, address to, uint value) external returns (bool);
  function transferByVestingC(address recipient, uint256 amount) external returns (bool);
}