// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NiceToMeetYou is ERC1155, Ownable {
    constructor() ERC1155("NiceToMeetYou") {}

    string public name = "Help&Grow";

    mapping (address => mapping(uint256 => string)) public _tokenURIs;

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, string memory tokenURI) public {
        _mint(account, id, 1, new bytes(0));
        _tokenURIs[account][id] = tokenURI;
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Transfers are disabled"
        );
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
