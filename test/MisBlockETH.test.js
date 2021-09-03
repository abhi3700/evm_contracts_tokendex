const { expect } = require("chai");

describe("MisBlockETH contract", function() {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("MisBlockETH");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatToken = await Token.deploy();
        await hardhatToken.deployed();
    
        // We can interact with the contract by calling `hardhatToken.method()`
        await hardhatToken.deployed();
    });

    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the owner and it should be 1T", async function () {
          const ownerBalance = await hardhatToken.balanceOf(owner.address);
          expect(await hardhatToken.totalSupply()).to.equal(ownerBalance).to.equal(ethers.BigNumber.from('10').pow(await hardhatToken.decimals()).mul(1000000000000));
        });
        it("Should push 2 addresses of uniswap and pancake into timelockfromaddresses", async function () {
          const expectedTimeLockFromAddresses = ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', '0x10ED43C718714eb63d5aA57B78B54704E256024E'];
          const actual = await hardhatToken.getTimeLockFromAddress();
          expect(expectedTimeLockFromAddresses[0]).to.equal(actual[0]);
          expect(expectedTimeLockFromAddresses[1]).to.equal(actual[1]);
      });
    }); 
    
    describe("TimeLockFromAddresses", function () {
      it("Should add/remove timelock address successfully", async function () {
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        expect((await hardhatToken.getTimeLockFromAddress()).length).to.equal(3);
        expect(addr1.address).to.equal((await hardhatToken.getTimeLockFromAddress())[2]);
        await hardhatToken.removeTimeLockFromAddress(addr1.address);
        expect((await hardhatToken.getTimeLockFromAddress()).length).to.equal(2);
      });
    }); 
  

    describe("Transactions", function () {
      it("Should transfer tokens between accounts", async function () {
        // Transfer 50 tokens from owner to addr1
        await hardhatToken.transfer(addr1.address, 50);
        const addr1Balance = await hardhatToken.balanceOf(
          addr1.address
        );
        expect(addr1Balance).to.equal(50);
  
        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        await hardhatToken.connect(addr1).transfer(addr2.address, 50);
        const addr2Balance = await hardhatToken.balanceOf(
          addr2.address
        );
        expect(addr2Balance).to.equal(50);
      });
  
      it("Should fail if sender doesn’t have enough tokens", async function () {
        const initialOwnerBalance = await hardhatToken.balanceOf(
          owner.address
        );
  
        // Try to send 1 token from addr1 (0 tokens) to owner.
        // `require` will evaluate false and revert the transaction.
        await expect(
          hardhatToken.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWith("transfer amount exceeds balance");
  
        // Owner balance shouldn't have changed.
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(
          initialOwnerBalance
        );
      });
  
      it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await hardhatToken.balanceOf(
          owner.address
        );
  
        // Transfer 100 tokens from owner to addr1.
        await hardhatToken.transfer(addr1.address, 100);
  
        // Transfer another 50 tokens from owner to addr2.
        await hardhatToken.transfer(addr2.address, 50);
  
        // Check balances.
        const finalOwnerBalance = await hardhatToken.balanceOf(
          owner.address
        );
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
  
        const addr1Balance = await hardhatToken.balanceOf(
          addr1.address
        );
        expect(addr1Balance).to.equal(100);
  
        const addr2Balance = await hardhatToken.balanceOf(
          addr2.address
        );
        expect(addr2Balance).to.equal(50);
      });
    });
    describe("TimeLock", function () {
      it("Should fail when send locked funds", async function () {
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, 100)
        // set addr1 as timelockfromaddress.
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        // send 50 token from addr to addr2, now 100 token from addr2 will be locked
        await hardhatToken.connect(addr1).transfer(addr2.address, 100)
        await expect(
          hardhatToken.connect(addr2).transfer(addr1.address, 10)
        ).to.be.revertedWith("Some of your balances were locked. And you don't have enough unlocked balance for this transaction.");
      });

      it("Should success when send less than 10% after 25 hours", async function () {
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, 100)
        // set addr1 as timelockfromaddress.
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        // send 50 token from addr to addr2, now 100 token from addr2 will be locked
        await hardhatToken.connect(addr1).transfer(addr2.address, 100)

        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(0);
        await network.provider.send("evm_increaseTime", [3600 * 25]);
        await network.provider.send('evm_mine');
        await hardhatToken.connect(addr2).transfer(addr1.address, 10)
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(10);
      });
    });
});