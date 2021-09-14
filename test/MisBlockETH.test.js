const { expect } = require("chai");

function convertTokenValue(token) {
    return ethers.BigNumber.from(10).pow(18).mul(token);
}

describe("MisBlockETH contract", function() {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let vestingC;
    
    beforeEach(async function () {        
        this.timeout(50000);
        // const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
      
        // await network.provider.request({
        //   method: "hardhat_reset",
        //   params: [
        //     {
        //       forking: {
        //         jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        //       },
        //     },
        //   ],
        // });
        
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("MisBlockETH");
        [owner, addr1, addr2, addr3, addr4, vestingC] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatToken = await Token.deploy();
        await hardhatToken.deployed();    
    });

    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the owner and it should be 1T", async function () {
          const ownerBalance = await hardhatToken.balanceOf(owner.address);
          expect(await hardhatToken.totalSupply()).to.equal(ownerBalance).to.equal(convertTokenValue(1000000000000));
        });
        it("Should push 2 addresses of uniswap and pancake into timelockfromaddresses", async function () {
          const expectedTimeLockFromAddresses = ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'];
          const actual = await hardhatToken.getTimeLockFromAddress();
          expect(expectedTimeLockFromAddresses[0]).to.equal(actual[0]);          
      });
    }); 
    
    describe("TimeLockFromAddresses", function () {
      it("Should add/remove timelock address successfully", async function () {
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        expect((await hardhatToken.getTimeLockFromAddress()).length).to.equal(2);
        expect(addr1.address).to.equal((await hardhatToken.getTimeLockFromAddress())[1]);
        await hardhatToken.removeTimeLockFromAddress(addr1.address);
        expect((await hardhatToken.getTimeLockFromAddress()).length).to.equal(1);
      });
    }); 
  

    describe("Transactions", function () {
      it("Should transfer tokens between accounts", async function () {
        // exclude from reward addr1 to calculate balance correctly.
        await hardhatToken.excludeFromReward(addr1.address);
        // Transfer 50 tokens from owner to addr1
        const tokenAmount = convertTokenValue(50);
        await hardhatToken.transfer(addr1.address, tokenAmount);
        const addr1Balance = await hardhatToken.balanceOf(
          addr1.address
        );
        expect(addr1Balance).to.equal(tokenAmount);        
      });
  
      it("Should fail if sender doesn’t have enough tokens", async function () {
        
        // exclude from reward addr1 to calculate balance correctly.
        await hardhatToken.excludeFromReward(addr1.address);
        // Transfer 50 tokens from owner to addr1
        const tokenAmount = convertTokenValue(50);
        await hardhatToken.transfer(addr1.address, tokenAmount);

        const initialOwnerBalance = await hardhatToken.balanceOf(
          owner.address
        );

        // Try to send 1 token from addr1 (0 tokens) to owner.
        // `require` will evaluate false and revert the transaction.
        const tokenAmount1 = convertTokenValue(100);
        await expect(
          hardhatToken.connect(addr1).transfer(owner.address, tokenAmount1)
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
        // exclude from reward addr1 to calculate balance correctly.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(owner.address);
        // Transfer 100 tokens from owner to addr1.
        
        const tokenAmount = convertTokenValue(100);
        await hardhatToken.transfer(addr1.address, tokenAmount);
  
        // Check balances.
        const finalOwnerBalance = await hardhatToken.balanceOf(
          owner.address
        );
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(tokenAmount));
  
        const addr1Balance = await hardhatToken.balanceOf(
          addr1.address
        );
        expect(addr1Balance).to.equal(tokenAmount);        
      });
    });
    describe("TimeLock", function () {
      it("Should fail when send locked funds", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromFee(addr1.address);
        await hardhatToken.excludeFromFee(addr2.address);
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        const tokenAmount = convertTokenValue(100);
        await hardhatToken.transfer(addr1.address, tokenAmount)
        // set addr1 as timelockfromaddress.
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        // send 50 token from addr to addr2, now 100 token from addr2 will be locked
        await hardhatToken.connect(addr1).transfer(addr2.address, tokenAmount)
        await expect(
          hardhatToken.connect(addr2).transfer(addr1.address, convertTokenValue(10))
        ).to.be.revertedWith("Some of your balances were locked. And you don't have enough unlocked balance for this transaction.");
      });

      it("Should success when send less than 10% after 25 hours", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromFee(addr1.address);
        await hardhatToken.excludeFromFee(addr2.address);
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        // set addr1 as timelockfromaddress.
        await hardhatToken.addTimeLockFromAddress(addr1.address);
        // send 50 token from addr to addr2, now 100 token from addr2 will be locked
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(0);
        await network.provider.send("evm_increaseTime", [3600 * 25]);
        await network.provider.send('evm_mine');
        await hardhatToken.connect(addr2).transfer(addr1.address, convertTokenValue(10))
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(convertTokenValue(10));
      });
    });

    describe("Taxes", function () {
      it("Should exclude from tax from or to owner", async function () {
        // send 100 token to addr1 from owner
        const initalBalanceOwner = await hardhatToken.balanceOf(owner.address);
        const tokenAmount = convertTokenValue(100);
        await hardhatToken.transfer(addr1.address, tokenAmount)
        // set addr1 as timelockfromaddress.
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(tokenAmount);
        // send 100 token to owner from addr1
        await hardhatToken.connect(addr1).transfer(owner.address, convertTokenValue(100))
        expect(await hardhatToken.balanceOf(
          owner.address
        )).to.be.equal(initalBalanceOwner);
      });

      it("Should take 15% tax fees at first month transactions", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        
        // send 100 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr2.address
        )).to.be.equal(convertTokenValue(100 - 15));
      });

      it("Should take 10% tax fees at second month transactions", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        
        await network.provider.send("evm_increaseTime", [3600 * 24 * 31]);
        await network.provider.send('evm_mine');
        // send 100 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr2.address
        )).to.be.equal(convertTokenValue(100 - 10));
      });

      it("Should take 5% tax fees at third month transactions", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        
        await network.provider.send("evm_increaseTime", [3600 * 24 * 61]);
        await network.provider.send('evm_mine');
        // send 100 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr2.address
        )).to.be.equal(convertTokenValue(100 - 5));
      });

      it("Should not take tax fees from fourth month transactions", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        
        await network.provider.send("evm_increaseTime", [3600 * 24 * 91]);
        await network.provider.send('evm_mine');
        // send 100 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr2.address
        )).to.be.equal(convertTokenValue(100));
      });

      it("Should not take tax fees from fourth month transactions", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        // send 100 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(100))
        
        await network.provider.send("evm_increaseTime", [3600 * 24 * 91]);
        await network.provider.send('evm_mine');
        // send 100 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(100))

        expect(await hardhatToken.balanceOf(
          addr2.address
        )).to.be.equal(convertTokenValue(100));
      });

      it("Should take 15% tax fees and 7.5% to liquidity", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr2.address);
        await hardhatToken.excludeFromReward(hardhatToken.address);
        // send 1000 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(1000))
        // send 1000 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(1000))

        // 7.5 % fee should be deposit to contract address for liquidity.
        expect(await hardhatToken.balanceOf(
          hardhatToken.address
        )).to.be.equal(convertTokenValue(75));
      });

      it("Should take 15% tax fees and 7.5% to account holders", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromReward(owner.address);
        await hardhatToken.excludeFromReward(addr2.address);
        await hardhatToken.excludeFromReward(hardhatToken.address);
        // send 2000 token to addr1
        await hardhatToken.transfer(addr1.address, convertTokenValue(2000))
        // send 1000 token from addr1 to addr2, now took 15% as fee
        await hardhatToken.connect(addr1).transfer(addr2.address, convertTokenValue(1000))

        // 7.5 % fee should be deposit to account holders. Currently addr1 is unique account holder.
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(convertTokenValue(1000 + 75));
      });
    });

    describe("Burn", function () {
      it("Should burn successfully", async function () {
        // send 100 token to addr1 from owner
        await hardhatToken.transfer(addr1.address, convertTokenValue(100));
        
        // burn 50 token from addr 1
        await hardhatToken.burn(addr1.address, convertTokenValue(50));
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(convertTokenValue(50));
      });

      it("Should revert when burn exceed balance", async function () {
        // send 100 token to addr1 from owner
        await hardhatToken.transfer(addr1.address, convertTokenValue(100));
        
        // burn 150 token from addr 1 should be failed.
        await expect(
          hardhatToken.burn(addr1.address, convertTokenValue(150))
        ).to.be.revertedWith("Burnning amount is exceed balance");        
      });
    });

    describe("Delegate Transfer", function () {
      it("Should delegate transfer successfully", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromFee(addr1.address);
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr3.address);
        
        // send 100 token to addr1 from owner
        await hardhatToken.transfer(addr1.address, convertTokenValue(100));
        
        // approve addr2 to send 50 token
        await hardhatToken.connect(addr1).approve(addr2.address, convertTokenValue(50));

        // delegate transfer from addr1 to addr3 by addr2
        await hardhatToken.connect(addr2).transferFrom(addr1.address, addr3.address, convertTokenValue(50));
        expect(await hardhatToken.balanceOf(
          addr1.address
        )).to.be.equal(convertTokenValue(50));
        expect(await hardhatToken.balanceOf(
          addr3.address
        )).to.be.equal(convertTokenValue(50));
      });

      it("Should revert when delegate transfer exceed balance", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromFee(addr1.address);
        await hardhatToken.excludeFromReward(addr1.address);
        await hardhatToken.excludeFromReward(addr3.address);
        
        // send 100 token to addr1 from owner
        await hardhatToken.transfer(addr1.address, convertTokenValue(50));
        
        // approve addr2 to send 50 token
        await hardhatToken.connect(addr1).approve(addr2.address, convertTokenValue(100));

        // delegate transfer from addr1 to addr3 by addr2 should be reverted
        await expect(
          hardhatToken.connect(addr2).transferFrom(addr1.address, addr3.address, convertTokenValue(100)
        )).to.be.revertedWith("transfer amount exceeds balance");
      });

      it("Should revert when delegate transfer between same addresses", async function () {
        // exclude from fee and reward.
        await hardhatToken.excludeFromFee(addr1.address);
        await hardhatToken.excludeFromReward(addr1.address);
        
        // send 100 token to addr1 from owner
        await hardhatToken.transfer(addr1.address, convertTokenValue(100));
        
        // approve addr2 to send 50 token
        await hardhatToken.connect(addr1).approve(addr2.address, convertTokenValue(50));

        // delegate transfer from addr1 to addr3 by addr2 should be reverted
        await expect(
          hardhatToken.connect(addr2).transferFrom(addr1.address, addr1.address, convertTokenValue(50)
        )).to.be.revertedWith("sender and recipient is same address");
      });
    });
});