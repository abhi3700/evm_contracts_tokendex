# MIS Token contract unit testing
All the test functions illustrated below is done locally.

## Testing
* Inside `beforeEach` funtion:
	1. create signers `owner`, `addr1`, `addr2`, `addr3`, `addr4`, `vestingC`
	1. "`owner` create, deploy token contract"
	1. "`owner` mint 1 Trillion tokens to itself"
	1. "`owner` transfer 100 tokens to EOA - `addr1`"
	1. "`owner` assigns token allocation percentage for different purposes"
* "`addr1` transfer 10 tokens to another user successfully"
* "Reverts when `addr1` transfer more than 100 tokens to `addr2`"
* "`addr1` delegates `addr2` to transfer tokens to `addr3`"
* "Reverts when `addr1` delegates more than its balance to `addr2` to transfer tokens to `addr3`"
* "Reverts when `addr1` delegates `addr2` to transfer tokens to `addr1`"
* "Burning tokens successfully"
* "Reverts when tokens not held with `owner` is burned"
* "`owner` successfully distributes tokens as per the percentage to the `vestingC`"
* "Reverts when `owner` doesn't distribute tokens as per the percentage to the `vestingC`"
