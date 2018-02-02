var Utils = artifacts.require("./Utils.sol");
var MySimpleCoin = artifacts.require("./MySimpleCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Utils);
  deployer.link(Utils, MySimpleCoin);
  deployer.deploy(MySimpleCoin);
};
