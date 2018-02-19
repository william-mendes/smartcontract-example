var token = artifacts.require("./MySimpleToken.sol");
var ico = artifacts.require("./MySimpleICO.sol");
const fixtures = require('../TestFixtures.json')

module.exports = function(deployer) {
  const accounts = web3.eth.accounts;
  let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp - 1;
  let endTime = startTime + 60 * (60 * 60 * 24); // 60 days
  let timings = [
    startTime + 7 * (60 * 60 * 24),
    startTime + 14 * (60 * 60 * 24),
    startTime + 28 * (60 * 60 * 24)
  ]
  let bonuses = fixtures.BONUSES

  deployer.deploy(token, endTime).then(function(){
    return deployer.deploy(ico,
      startTime,
      endTime,
      timings,
      bonuses,
      accounts[1],
      accounts[2],
      endTime+1000
    )
  });

};
