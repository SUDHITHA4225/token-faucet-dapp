// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FaucetToken
 * @notice ERC-20 token with capped supply, mintable only by faucet
 */
contract FaucetToken is ERC20, Ownable {

    // Maximum supply: 1 million tokens (18 decimals)
    uint256 public constant MAX_SUPPLY = 1_000_000 ether;

    // Faucet contract address (only allowed minter)
    address public minter;

    /**
     * @param _minter Address of the faucet contract
     */
    constructor(address _minter)
    ERC20("FaucetToken", "FTK")
    Ownable(msg.sender)
{
    minter = _minter;
}


    /**
     * @notice Update faucet (minter) address
     * @dev Only owner (deployer) can change
     */
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    /**
     * @notice Mint new tokens (only faucet)
     * @param to Receiver address
     * @param amount Token amount (base units)
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only faucet can mint");
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Max supply exceeded"
        );

        _mint(to, amount);
    }
}
