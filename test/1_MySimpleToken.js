let utils = require('./Utils.js')
const fixtures = require('../TestFixtures.json')

let token = artifacts.require("./MySimpleToken.sol");
let tokenInstance;

let tokenName = fixtures.TOKEN_NAME
let tokenSymbol = fixtures.TOKEN_SYMBOL
let tokenDecimals = fixtures.TOKEN_DECIMALS

let ownerAddress, vaultWallet, teamWallet, buyerOne

contract('MySimpleToken', accounts => {

  before(async() => {
    ownerAddress = accounts[0]
    vaultWallet = accounts[1]
    teamWallet = accounts[2]
    buyerOne = accounts[3]
  });

  describe('Contructor Tests', () => {

    before(async() => {
      tokenInstance = await token.deployed();
    });

    it("Should Token Name be: " + tokenName, async() => {
      let actual = await tokenInstance.name();
      assert.equal(actual, tokenName);
    });

    it("Should Token Symbol be: " + tokenSymbol, async() => {
      let actual = await tokenInstance.symbol();
      assert.equal(actual, tokenSymbol);
    });

    it("Should Token Decimals be: " + tokenDecimals, async() => {
      let actual = await tokenInstance.decimals();
      assert.equal(actual.toNumber(), tokenDecimals);
    });

  })
});
