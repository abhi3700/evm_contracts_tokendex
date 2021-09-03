// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MisBlockBase is ERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    struct LockFund {
        uint256 amount;
        uint256 releasetime;
    }
    
    mapping (address => bool) private _isTimeLockFromAddress;
    address[] private _timeLockFromAddresses;
    mapping (address => LockFund[]) private _lockFundsArray;
    
    constructor() ERC20("MisBlock", "XBA") {
        _mint(msg.sender, 1000000000000 * 10 ** uint256(decimals()));
        
        // Uniswap and Pancake Address should be in TimeLockFromAddress list
        _isTimeLockFromAddress[0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D] = true;
        _isTimeLockFromAddress[0x10ED43C718714eb63d5aA57B78B54704E256024E] = true;
        _timeLockFromAddresses.push(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        _timeLockFromAddresses.push(0x10ED43C718714eb63d5aA57B78B54704E256024E);
    }

    function getTimeLockFromAddress() public view returns (address[] memory){
        return _timeLockFromAddresses;
    }

    function addTimeLockFromAddress(address account) public onlyOwner() {
        require(!_isTimeLockFromAddress[account], "Account is already in list of from addresses for timelock");
        _isTimeLockFromAddress[account] = true;        
        _timeLockFromAddresses.push(account);
    }

    function removeTimeLockFromAddress(address account) public onlyOwner() {
        require(_isTimeLockFromAddress[account] == true, "Account is not in list of from addresses for timelock");
        for (uint256 i = 0; i < _timeLockFromAddresses.length; i++) {
            if (_timeLockFromAddresses[i] == account) {
                _timeLockFromAddresses[i] = _timeLockFromAddresses[_timeLockFromAddresses.length - 1];
                _isTimeLockFromAddress[account] = false;
                _timeLockFromAddresses.pop();
                break;
            }
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        LockFund[] storage lockFunds = _lockFundsArray[from];
        if(lockFunds.length < 1) return;
        uint256 lockedFundsSum = 0;
        for (uint i = 0; i < lockFunds.length; i++) {
            if(lockFunds[i].releasetime > block.timestamp)
            {
                lockedFundsSum += lockFunds[i].amount;
            }
        }
        require(balanceOf(from) - lockedFundsSum >= amount, "Some of your balances were locked. And you don't have enough unlocked balance for this transaction.");
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if(!_isTimeLockFromAddress[from]) return;
        LockFund[] storage lockFunds = _lockFundsArray[to];
        lockFunds.push(LockFund(amount.div(10), block.timestamp + 1 days));
        for (uint256 i = 1; i < 10; i++) {
            lockFunds.push(LockFund(amount.div(10), block.timestamp + 1 days + i * 1 weeks));
        }
    }
}