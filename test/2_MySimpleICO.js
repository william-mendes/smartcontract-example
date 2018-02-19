let utils = require('./Utils.js')
let ico = artifacts.require("./MySimpleICO.sol");
let token = artifacts.require("./MySimpleToken.sol");
const fixtures = require('../TestFixtures.json')

let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
let endTime = startTime + 60 * (60 * 60 * 24); // 60 days
let timings = [
  startTime + 7 * (60 * 60 * 24),
  startTime + 14 * (60 * 60 * 24),
  startTime + 28 * (60 * 60 * 24)
]
let bonuses = fixtures.BONUSES
const ETHER_CAP_IN_WEI = fixtures.ETHER_CAP * (10 ** 18);
const TOKEN_CAP = fixtures.TOKEN_CAP * (10 ** 18); // 130000000000000000000000000000
const TEAM_SUPPLY_PERCENTAGE = fixtures.TEAM_SUPPLY_PERCENTAGE
const TEAM_SUPPLY = (TOKEN_CAP/100)*TEAM_SUPPLY_PERCENTAGE //* (10 ** 18); // 10000000000000000000000000000
const ICO_RATE = fixtures.ICO_RATE * (10 ** 18);
const MIN_TO_INVEST = fixtures.MIN_TO_INVEST;
const TOKEN_SYMBOL = fixtures.TOKEN_SYMBOL;

let ownerAddress, vaultWallet, teamWallet, buyerOne

contract('MySimpleICO', accounts => {

  before(async() => {
    ownerAddress = accounts[0]
    vaultWallet = accounts[1]
    teamWallet = accounts[2]
    buyerOne = accounts[3]
  });

  describe('Contructor and Initialization', () => {

    before(async() => {
      tokenInstance = await token.new(endTime);
      icoInstance = await ico.new(startTime,endTime,timings,bonuses,vaultWallet,teamWallet,endTime+1000);
    });

    it("Should TOKEN_CAP be: " + TOKEN_CAP, async() => {
      let actual = await icoInstance.TOKEN_CAP.call();
      assert.equal(actual.toNumber(), TOKEN_CAP);
    });

    it("Should startTime be: " + startTime, async() => {
      let actual = await icoInstance.startTime.call();
      assert.equal(actual.toNumber(), startTime);
    });

    it("Should endTime be: " + endTime, async() => {
      let actual = await icoInstance.endTime.call();
      assert.equal(actual.toNumber(), endTime);
    });

    it("Should vaultWallet be: " + vaultWallet, async() => {
      let actual = await icoInstance.vaultWallet.call();
      assert.equal(actual, vaultWallet);
    });

    it("Should ICO_RATE be: " + ICO_RATE, async() => {
      let actual = await icoInstance.ICO_RATE.call();
      assert.equal(actual.toNumber(), (ICO_RATE/ (10 ** 18)));
    });

    it("Should ETHER_CAP_IN_WEI be: " + ETHER_CAP_IN_WEI, async() => {
      let actual = await icoInstance.CAP.call();
      assert.equal(actual.toNumber(), ETHER_CAP_IN_WEI);
    });

    it("Should TEAM_SUPPLY be: " + TEAM_SUPPLY_PERCENTAGE + " % of TOKEN_CAP", async() => {
      let actual = await icoInstance.TEAM_SUPPLY.call();
      assert.equal(actual.toNumber(), TEAM_SUPPLY);
    });

    it("Should weiRaised be 0 on initialization", async() => {
      let actual = await icoInstance.weiRaised.call();
      assert.equal(actual.toNumber(), 0);
    });

    it("Should tokenSold be 0 on initialization", async() => {
      let actual = await icoInstance.weiRaised.call();
      assert.equal(actual.toNumber(), 0);
    });

    it("Should hasEnded be false", async() => {
      let actual = await icoInstance.hasEnded.call();
      assert.equal(actual, false);
    });


  })

  describe('Token Calculation Tests', () => {

    beforeEach(async() => {
      tokenInstance = await token.new(endTime);
      icoInstance = await ico.new(startTime,endTime,timings,bonuses,vaultWallet,teamWallet,endTime+1000);
    });

    it("Should return the correct amount of tokens + "+bonuses[0]+" % during first timing window", async() => {
      let result = await icoInstance.getNumTokens.call(web3.toWei(1, "ether"));
      assert.equal(result.toNumber(), ICO_RATE + (ICO_RATE*bonuses[0]/100));
    });

    // it("Should return the correct amount of tokens + "+bonuses[1]+" % during second timing window", async() => {
      // utils.increaseTime(800 * (60 * 60 * 24))
      // let result = await icoInstance.getNumTokens.call(web3.toWei(1, "ether"));
      // console.log("\n******result:", result.toNumber(), "\n")
      // assert.equal(result.toNumber(), ICO_RATE + (ICO_RATE*bonuses[1]/100));
    // });

  })

  describe('Investment Tests', () => {

    beforeEach(async() => {
      tokenInstance = await token.new(endTime);
      icoInstance = await ico.new(startTime,endTime,timings,bonuses,vaultWallet,teamWallet,endTime+1000);
    });

    it("should investment increase amount of wei raised", async() => {
      let lastWeiPosition = await icoInstance.weiRaised.call();
      let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(1, "ether")});
      let actual = await icoInstance.weiRaised.call();
      assert.equal(
        actual.toNumber() - lastWeiPosition.toNumber(),
        web3.toWei(1, "ether"))
    });

    it("should investment increase amount of token sold", async() => {
      let lastTokenSoldPosition = await icoInstance.tokenSold.call();
      let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(1, "ether")});
      let actual = await icoInstance.tokenSold.call();
      assert.equal(
        actual.toNumber() - lastTokenSoldPosition.toNumber(),
        ICO_RATE + (ICO_RATE*bonuses[0]/100))
    });

    it("should investment of 2 ETH receives " + (ICO_RATE + (ICO_RATE*bonuses[0]/100))*2, async() => {
      let lastTokenSoldPosition = await icoInstance.tokenSold.call();
      let etherQuantity = 2
      let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(etherQuantity, "ether")});
      let actual = await icoInstance.tokenSold.call();
      assert.equal(
        actual.toNumber() - lastTokenSoldPosition.toNumber(),
        (ICO_RATE + (ICO_RATE*bonuses[0]/100))*etherQuantity)
    });

    it("should investment of 50 ETH receives " + (ICO_RATE + (ICO_RATE*bonuses[0]/100))*50, async() => {
      let lastTokenSoldPosition = await icoInstance.tokenSold.call();
      let etherQuantity = 50
      let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(etherQuantity, "ether")});
      let actual = await icoInstance.tokenSold.call();
      assert.equal(
        actual.toNumber() - lastTokenSoldPosition.toNumber(),
        (ICO_RATE + (ICO_RATE*bonuses[0]/100))*etherQuantity)
    });

    it("should investment less than 0.01 ETH fail", async() => {
      let lastTokenSoldPosition = await icoInstance.tokenSold.call();
      let etherQuantity = 0.009
      try {
        let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(etherQuantity, "ether")});
        assert.equal(true,false)
      } catch (error) {
        let actual = await icoInstance.tokenSold.call();
        assert.equal( actual.toNumber(), lastTokenSoldPosition.toNumber() )
      }
    });

    it("should investment of 0.01 ETH receives " + (ICO_RATE + (ICO_RATE*bonuses[0]/100))*0.01, async() => {
      let lastTokenSoldPosition = await icoInstance.tokenSold.call();
      let etherQuantity = 0.01
      let result = await icoInstance.buyTokens(buyerOne, {value: web3.toWei(etherQuantity, "ether")});
      let actual = await icoInstance.tokenSold.call();
      assert.equal(
        actual.toNumber() - lastTokenSoldPosition.toNumber(),
        (ICO_RATE + (ICO_RATE*bonuses[0]/100))*etherQuantity)
    });
  })

  // describe('Buys Limitation Tests', () => {

  //   it("should invest a value lower than 0.01 ETH throws error", async() => {
  //     let previousBalance = (await tokenInstance.balanceOf.call(accountFourAddress)).toNumber()
  //     try {
  //       let result = await icoInstance.invest(accountFourAddress, {value: web3.toWei(0.009, "ether")});
  //       let bal = await tokenInstance.balanceOf.call(accountFourAddress)
  //       assert.equal(bal.toNumber(), 0);
  //     } catch (error) {
  //       let bal = await tokenInstance.balanceOf.call(accountFourAddress);
  //       assert.equal(bal.toNumber(), previousBalance);
  //     }
  //   });

  //   it("should fail to buy tokens because of the max goal", async() => {
  //     let investorBalance = await tokenInstance.balanceOf.call(accountTwoAddress);
  //     try {
  //       let result = await icoInstance.invest(accountTwoAddress, {value: web3.toWei(maxGoal+1, "ether")});
  //       let bal = await tokenInstance.balanceOf.call(accountTwoAddress)
  //       assert.equal(bal.toNumber(), 0);
  //     } catch (error) {
  //       let bal = await tokenInstance.balanceOf.call(accountTwoAddress);
  //       assert.equal(bal.toNumber(), investorBalance.toNumber());
  //     }
  //   });

  // })

  // describe('Crowdsale finalizations', () => {
  //   beforeEach(async() => {
  //     tokenInstance = await token.new(ownerAddress, tokenStartTime);
  //     icoInstance = await ico.new(tokenInstance.address,ownerAddress,ownerAddress,startTime,endTime);
  //   });

  //   it("should fail to close crowdsale because too early", async() => {
  //     await icoInstance.checkGoalReached({from: ownerAddress});
  //     let reached = await icoInstance.crowdsaleClosed.call();
  //     assert.equal(reached, false);
  //   });

  //   it("should close the crowdsale. goal should be reached. Should burn unsold tokens.", async() => {
  //     // let startTime = await tokenInstance.startTime();
  //     // utils.increaseTime(startTime.toNumber() - web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1)
  //     // let result = await icoInstance.checkGoalReached({from: ownerAddress});
  //     // let event = result.logs[0].args;
  //     // assert.equal(event._tokenOwner, accounts[0]);
  //     // assert.equal(event._amountRaised.toNumber(), web3.toWei(softCapInEther, "ether"));
  //     // let closed = await icoInstance.crowdsaleClosed.call();
  //     // assert.equal(closed, true);
  //     // let supply = await tokenInstance.totalSupply.call();
  //     // assert.equal(supply.toNumber(), totalSupply);
  //     // let bal = await tokenInstance.balanceOf(accounts[0]);
  //     // assert.equal(bal.toNumber(), reserved);
  //   });

  //   it("should fund the crowdsale contract from the owner's wallet", async() => {
  //     await icoInstance.sendTransaction({value: web3.toWei(1, "ether")});
  //     assert.equal(web3.eth.getBalance(icoInstance.address).toNumber(), web3.toWei(1, "ether"));
  //   });

  //   it("should withdraw the invested amount", async() => {
  //     // let result = await icoInstance.safeWithdrawal({from: accountOneAddress});
  //     // let event = result.logs[0].args;
  //     // assert.equal(event.backer, accountOneAddress);
  //     // assert.equal(event.amount.toNumber(), web3.toWei(28010, "ether"));
  //     // assert.equal(event.isContribution, false);
  //     // assert.equal(web3.eth.getBalance(icoInstance.address).toNumber(), web3.toWei(30000 - 28010, "ether"));
  //     // let bal = await icoInstance.balanceOf.call(accountOneAddress);
  //     // assert.equal(bal.toNumber(), 0);
  //   });
  // })

});
