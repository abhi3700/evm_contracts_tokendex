// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
/// @title A common Interface for all Vesting contracts
/// @dev Admin calling token contract's `allocateVesting()` function, which then calls 
//       the `updateMaxVestingAmount()` function
interface IVesting {
  function updateMaxVestingAmount(uint256 _amountTransferred) external returns (bool);
}