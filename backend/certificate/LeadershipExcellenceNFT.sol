// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeadershipExcellenceNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct LeadershipExcellence {
        string employeeName;
        string projectOrDepartment;
        string issuedBy;
        string awardDate;
        string verificationHash;
    }

    mapping(uint256 => LeadershipExcellence) private _tokenDetails;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("Leadership Excellence Award NFT", "LEA") {}

    // Function to mint a new NFT
    function mintNFT(
        address to,
        string memory employeeName,
        string memory projectOrDepartment,
        string memory issuedBy,
        string memory awardDate,
        string memory verificationHash
    ) public onlyOwner {
        require(!_hasMinted[to], "This address has already minted a Leadership Excellence NFT.");
        
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _tokenDetails[newTokenId] = LeadershipExcellence(employeeName, projectOrDepartment, issuedBy, awardDate, verificationHash);
        _hasMinted[to] = true;
    }

    // Function to get details of the NFT
    function getLeadershipExcellence(uint256 tokenId) public view returns (LeadershipExcellence memory) {
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
