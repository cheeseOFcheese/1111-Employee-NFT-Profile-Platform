// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillBadgeNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct SkillBadge {
        string employeeName;
        string skillSet;
        string[] skillsCertified;
        string issuedBy;
        string certificationDate;
        string verificationHash;
    }

    mapping(uint256 => SkillBadge) private _tokenDetails;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("Certified Skill Badge NFT", "CSB") {}

    // Function to mint a new NFT
    function mintNFT(
        address to,
        string memory employeeName,
        string memory skillSet,
        string[] memory skillsCertified,
        string memory issuedBy,
        string memory certificationDate,
        string memory verificationHash
    ) public onlyOwner {
        require(!_hasMinted[to], "This address has already minted a badge.");
        
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _tokenDetails[newTokenId] = SkillBadge(employeeName, skillSet, skillsCertified, issuedBy, certificationDate, verificationHash);
        _hasMinted[to] = true;
    }

    // Function to get details of the NFT
    function getSkillBadge(uint256 tokenId) public view returns (SkillBadge memory) {
        require(_exists(tokenId), "Token does not exist.");
        return _tokenDetails[tokenId];
    }

    // Override the transfer function to make the token non-transferable (Soulbound)
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal pure override {
        require(false, "This token is non-transferable.");
    }
}
