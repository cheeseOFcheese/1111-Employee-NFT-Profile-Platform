SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EmployeeOfTheMonthNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct EmployeeOfTheMonth {
        string employeeName;
        string monthYear;
        string department;
        string issuedBy;
        string awardDate;
        string verificationHash;
    }

    mapping(uint256 => EmployeeOfTheMonth) private _tokenDetails;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("Employee of the Month NFT", "EOM") {}

    // Function to mint a new NFT
    function mintNFT(
        address to,
        string memory employeeName,
        string memory monthYear,
        string memory department,
        string memory issuedBy,
        string memory awardDate,
        string memory verificationHash
    ) public onlyOwner {
        require(!_hasMinted[to], "This address has already minted an Employee of the Month NFT.");
        
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _tokenDetails[newTokenId] = EmployeeOfTheMonth(employeeName, monthYear, department, issuedBy, awardDate, verificationHash);
        _hasMinted[to] = true;
    }

    // Function to get details of the NFT
    function getEmployeeOfTheMonth(uint256 tokenId) public view returns (EmployeeOfTheMonth memory) {
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
