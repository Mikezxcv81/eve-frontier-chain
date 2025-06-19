// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title FrontierToken (TRIBE) – EVE Frontier-ready ERC-20
/// @notice Adds EIP-2612, snapshot voting and role-gated minting so Smart
///         Assemblies or your Tribe DAO can mint rewards on Redstone / Garnet.
contract FrontierToken is
    ERC20Permit,
    ERC20Burnable,
    ERC20Votes,
    AccessControl
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @param treasury address that will hold the initial 1 000 000 supply
    constructor(address treasury)
        ERC20("Tribe Token", "TRIBE")
        ERC20Permit("Tribe Token")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, treasury);

        _mint(treasury, 1_000_000 ether); // 18-decimals
    }

    /* ────────────  external mint  ──────────── */
    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
    {
        _mint(to, amount);
    }

    /* ────────────  ERC20Votes hooks  ──────────── */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address from, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(from, amount);
    }
}
