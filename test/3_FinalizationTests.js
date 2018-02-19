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
let ownerAddress, vaultWallet, teamWallet, buyerOne

contract('Finalization Tests', accounts => {

  beforeEach(async() => {
    ownerAddress = accounts[0]
    vaultWallet = accounts[1]
    teamWallet = accounts[2]
    buyerOne = accounts[3]

    // tokenInstance = await token.new(endTime);
    // icoInstance = await ico.new(startTime,endTime,timings,bonuses,vaultWallet,teamWallet,endTime+1000);

  });

  describe('Investments within first time window', () => {

  });

  describe('Investments within second time window', () => {

  });

});
