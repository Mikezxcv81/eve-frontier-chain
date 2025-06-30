pragma solidity ^0.8.24;
import "./FrontierToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RewardMinter is AccessControl {
    bytes32 public constant GAME_SYSTEM = keccak256("GAME_SYSTEM");
    FrontierToken public immutable token;

    uint256 public dailyCap = 50_000 ether;
    mapping(uint256 => uint256) public mintedToday; // day => amount

    constructor(FrontierToken _token) {
        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function earn(address player, uint256 amount)
        external
        onlyRole(GAME_SYSTEM)
    {
        uint256 day = block.timestamp / 1 days;
        require(mintedToday[day] + amount <= dailyCap, "cap");
        mintedToday[day] += amount;
        token.mint(player, amount);
    }

    function setDailyCap(uint256 newCap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dailyCap = newCap;
    }
}
