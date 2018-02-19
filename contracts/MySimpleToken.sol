pragma solidity ^0.4.13;

import "./ERC20Basics.sol";

contract MySimpleToken is MintableToken, LimitedTransferToken {

    string public constant name = "MySimpleToken";
    string public constant symbol = "MST";
    uint8 public constant decimals = 18;

    uint256 public endTimeICO;

    function MySimpleToken(uint256 _endTimeICO) {
        endTimeICO = _endTimeICO;
    }

    function transferableTokens(address holder, uint64 time) public constant returns (uint256) {
        // allow transfers after the end of ICO
        return (time > endTimeICO) ? balanceOf(holder) : 0;
    }

}
