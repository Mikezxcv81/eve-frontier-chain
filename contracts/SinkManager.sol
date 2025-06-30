pragma solidity ^0.8.24;
import "./FrontierToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SinkManager is AccessControl {
    bytes32 public constant SINK_CALLER = keccak256("SINK_CALLER");
    FrontierToken public immutable token;

    event Spent(address indexed player, string sinkId, uint256 amount);

    constructor(FrontierToken _token) {
        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function spendFor(string calldata sinkId, uint256 amount) external {
        require(
            hasRole(SINK_CALLER, msg.sender) || msg.sender == tx.origin,
            "no auth"
        );
        token.burnFrom(msg.sender, amount);
        emit Spent(msg.sender, sinkId, amount);
    }
}
