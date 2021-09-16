// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;

  modifier whenNotPaused() {
    if (paused) revert();
    _;
  }

  modifier whenPaused {
    if (!paused) revert();
    _;
  }

  function pause() onlyOwner whenNotPaused external returns (bool) {
    paused = true;
    emit Pause();
    return true;
  }

  function unpause() onlyOwner whenPaused external returns (bool) {
    paused = false;
    emit Unpause();
    return true;
  }
}