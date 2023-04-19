// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POVP is ERC721 , Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Proof Of Volunteer Protocol", "POVP") {
    }
    /*
     to comply with opensea, data stored in metadataURI should be 

    I think this is done in the frontend to store it
    One thing good about using IPFS is that it cannot be tampered or modified, because if tampered the metadataURI will change
     */
    function mint(address owner, string memory metadataURI)
    public
    returns (uint256)
    {   
        
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);

        return id;
    }
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _baseURI() internal pure override returns (string memory) {
        return ".ipfs.w3s.link/povpsbt.json"; // assume we store in IPFS
    }
    function _burn(uint256 tokenId) internal onlyOwner override(ERC721)  {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    // should be compliant with Opensea standard
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
          return string(abi.encodePacked( _tokenURIs[tokenId],_baseURI()));
    }
}