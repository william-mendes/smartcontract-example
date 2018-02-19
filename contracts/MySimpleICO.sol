pragma solidity ^0.4.13;

import "./SafeMath.sol";
import "./ERC20Basics.sol";
import "./MySimpleToken.sol";

contract MySimpleICO is Ownable {
    using SafeMath for uint256;
    // The token being sold
    MintableToken public token;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public startTime;
    uint256 public endTime;
    uint256[3] public timings;
    uint8[3] public bonuses;

    // address where funds are collected
    address public vaultWallet;

    // how many token units a buyer gets per wei
    uint256 public constant ICO_RATE = 10000;

    /* the minimum amount to invest 0.01 ether */
	uint constant public minToInvest = 10 finney;

    // amount of raised money in wei
    uint256 public weiRaised;

    uint256 public tokenSold;

    uint256 public constant CAP = 12000 ether; // 12000000000000000000000 WEI
    uint256 public constant TOKEN_CAP = 130000000000 * (10 ** uint256(18)); // 130000000000000000000000000000 LLN

    TokenTimelock public teamTokenTimelock;
    uint256 public constant TEAM_SUPPLY = (TOKEN_CAP.mul(10)).div(100); // 10% = 10000000000000000000000000000 LLN

    function MySimpleICO(
        uint64 _startTime,
        uint64 _endTime,
        uint256[3] _timings,
        uint8[3] _bonuses,
        address _vaultWallet,
        address teamWallet,
        uint64 teamReleaseTime
        ) {
            require(_endTime >= _startTime);
            require(teamReleaseTime >= _endTime);
            require(_vaultWallet != 0x0);
            require(teamWallet != 0x0);

            require(_timings[0] >= now);

            for(uint i = 1; i < timings.length; i++) {
              require(_timings[i] >= _timings[i-1]);
            }

            startTime = _startTime;
            endTime = _endTime;
            vaultWallet = _vaultWallet;
            timings = _timings;
            bonuses = _bonuses;

            token = new MySimpleToken(endTime);

            // teamTokenTimelock = new TokenTimelock(token, teamWallet, teamReleaseTime);
            token.mint(teamWallet, TEAM_SUPPLY);
            TokenPurchase(msg.sender, teamWallet, 0, TEAM_SUPPLY);

        }

        /**
        * event for token purchase logging
        * @param purchaser who paid for the tokens
        * @param beneficiary who got the tokens
        * @param value weis paid for purchase
        * @param amount amount of tokens purchased
        */
        event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

        // creates the token to be sold.
        function createTokenContract() internal returns (MintableToken) {
            return new MintableToken();
        }

        // fallback function can be used to buy tokens
        function () payable {
            buyTokens(msg.sender);
        }

        // low level token purchase function
        function buyTokens(address beneficiary) public payable {
            require(beneficiary != 0x0);
            require(msg.value >= minToInvest);

            uint256 weiAmount = msg.value;
            uint256 tokens = getNumTokens(weiAmount);

            // update state
            weiRaised = weiRaised.add(weiAmount);
            tokenSold = tokenSold.add(tokens);

            require(validPurchase());

            token.mint(beneficiary, tokens);
            TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

            forwardFunds();
        }

        // send ether to the fund collection wallet
        function forwardFunds() internal {
          vaultWallet.transfer(msg.value);
        }

        // return right amount of tokens
        function getNumTokens(uint256 weiAmount) public returns (uint256) {
            uint256 periodBonus;
            // uint256 weiCoeficient = 1000000000000000000;

            for (uint8 i = 1; i < timings.length; i++) {
              if ( now < timings[i] ) {
                periodBonus = ICO_RATE.mul(uint256(bonuses[i-1])).div(100);
                break;
              }
            }

            uint256 actualRate = ICO_RATE.add(periodBonus);

            // return (weiAmount.mul(actualRate)).div(weiCoeficient);
            return weiAmount.mul(actualRate);
        }

        // add off chain contribution. BTC address of contribution added for transparency on the transaction
        function addOffChainContribution(address beneficiar, uint256 weiAmount, uint256 tokenAmount, string btcAddress) onlyOwner public {
            require(beneficiar != 0x0);
            require(weiAmount > 0);
            require(tokenAmount > 0);
            weiRaised += weiAmount;
            tokenSold += tokenAmount;
            require(validPurchase());
            token.mint(beneficiar, tokenAmount);
        }


        // @return true if investors can buy at the moment
        function validPurchase() internal constant returns (bool) {
            bool withinCap = weiRaised <= CAP;
            bool withinPeriod = now >= startTime && now <= endTime;
            bool withinTokenCap = tokenSold <= TOKEN_CAP;
            return withinPeriod && withinCap && withinTokenCap;
        }

        // @return true if crowdsale event has ended
        function hasEnded() public constant returns (bool) {
            bool capReached = weiRaised >= CAP;
            return now > endTime || capReached;
        }

    }
