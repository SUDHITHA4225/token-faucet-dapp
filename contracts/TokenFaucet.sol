// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @notice Minimal interface for mintable ERC-20 token
 */
interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

/**
 * @title TokenFaucet
 * @notice ERC-20 faucet with cooldown, lifetime limit, and pause control
 */
contract TokenFaucet {

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant FAUCET_AMOUNT = 100 ether;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 ether;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    IERC20Mintable public token;
    address public admin;
    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event TokensClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    event FaucetPaused(bool paused);

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Invalid token address");
        token = IERC20Mintable(tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    /*//////////////////////////////////////////////////////////////
                            FAUCET LOGIC
    //////////////////////////////////////////////////////////////*/

    function requestTokens() external {
    require(!paused, "Faucet is paused");

    require(
        totalClaimed[msg.sender] + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT,
        "Lifetime claim limit reached"
    );

    require(
        block.timestamp >= lastClaimAt[msg.sender] + COOLDOWN_TIME,
        "Cooldown period not elapsed"
    );

    // effects
    lastClaimAt[msg.sender] = block.timestamp;
    totalClaimed[msg.sender] += FAUCET_AMOUNT;

    // interaction
    token.mint(msg.sender, FAUCET_AMOUNT);

    emit TokensClaimed(
        msg.sender,
        FAUCET_AMOUNT,
        block.timestamp
    );
}


    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        return true;
    }

    function remainingAllowance(address user)
        external
        view
        returns (uint256)
    {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return 0;
        }
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN CONTROLS
    //////////////////////////////////////////////////////////////*/

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}
