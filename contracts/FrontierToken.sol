// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Frontier Token – primary currency for Eve Frontier
contract FrontierToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @param issuer Address that will receive the premint *and* hold MINTER_ROLE
    constructor(address issuer) ERC20("Frontier Token", "FT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // deployer is admin
        _grantRole(MINTER_ROLE, issuer);            // game treasury
        _mint(issuer, 1_000_000 ether);             // 1 000 000 FT preminted
    }

    /// Mint new tokens (used by the game economy)
    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
    {
        _mint(to, amount);
    }
}
