//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "hardhat/console.sol";

import "./interfaces/IToken.sol";

contract StakingContract is Ownable, Pausable {
   modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, 'Caller should be beneficiary');
        _;
    }

    using SafeMath for uint256;

    address public beneficiary;
    IToken public vestingToken;

    uint256 public maxVestingAmount;
    uint256 public releaseTime;
    uint256 public totalClaimedAmount;

    // EVENTS
    event UpdateMaxVestingAmount(address caller, uint256 amount, uint256 currentTimestamp);
    event TokenClaimed(address indexed claimerAddress, uint256 amount, uint256 currentTimestamp);
    event ReleaseTimeChange(uint256 _releaseTime);

    /// @notice Constructor
    /// @param _token ERC20 token
    /// @param _beneficiary Beneficiary address
    /// @param _releaseTime Unlock time
    constructor(
        IToken _token,
        address _beneficiary,
        uint256 _releaseTime
    ) {
        require(address(_token) != address(0), "Invalid address");
        require(_beneficiary != address(0), 'Invalid address');

        beneficiary = _beneficiary;
        vestingToken = _token;
        releaseTime = _releaseTime;

        maxVestingAmount = 0;
        totalClaimedAmount = 0;
    }

    /// @notice Update vesting contract maximum amount after send transaction
    /// @param _amountTransferred Transferred amount. This can be modified by the caller 
    ///        so as to increase the max vesting amount
    function updateMaxVestingAmount(uint256 _amountTransferred) external whenNotPaused returns (bool) {
        require(msg.sender == address(vestingToken), "The caller is the token contract");

        maxVestingAmount = maxVestingAmount.add(_amountTransferred);

        emit UpdateMaxVestingAmount(msg.sender, _amountTransferred, block.timestamp);
        return true;
    }

    /// @notice Change unlock time
    /// @param _releaseTime Unlock time
    function setReleaseTime(uint256 _releaseTime) public onlyOwner whenNotPaused {
        releaseTime = _releaseTime;
        emit ReleaseTimeChange(releaseTime);
    }

    /// @notice Calculate claimable amount
    function claimableAmount() public view whenNotPaused returns(uint256) {
        if (releaseTime > block.timestamp) return 0;
        return maxVestingAmount;
    }

    /// @notice Claim
    function claim(IToken token) public onlyBeneficiary whenNotPaused {
        require(token == vestingToken, 'invalid token address');
        uint256 amount = claimableAmount();
        require(amount > 0, "Claimable amount must be positive");
        require(amount <= maxVestingAmount, "Can not withdraw more than total vested amount");

        vestingToken.transferByVestingC(msg.sender, amount);
        totalClaimedAmount = totalClaimedAmount.add(amount);
        emit TokenClaimed(msg.sender, amount, block.timestamp);
    }

    /// @notice Pause contract  
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    /// @notice Unpause contract
    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}