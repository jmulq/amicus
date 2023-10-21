// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AmicusHub.sol";
import "./AmicusLibrary.sol";
import "./AmicusRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract AmicusProfile is Ownable {
    using AmicusLibrary for AmicusLibrary.Friend;

    AmicusHub private amicusHub;
    AmicusRegistry private amicusRegistry;
    
    string public name;
    string public image;

    constructor(
        AmicusHub _amicusHub, AmicusRegistry _amicusRegistry, address _owner, string memory _name, string memory _image
    ) Ownable(_owner) {
        amicusHub = _amicusHub;
        amicusRegistry = _amicusRegistry;
        name = _name;
        image = _image;
    }

    function getFriends() external view onlyOwner returns (AmicusLibrary.Friend[] memory) {
        return amicusHub.getFriends();
    }

    function getInboundFriendRequests() external view onlyOwner returns (AmicusLibrary.Friend[] memory) {
        return amicusHub.getInboundFriendRequests();
    }
    
    function getOutboundFriendRequests() external view onlyOwner returns (AmicusLibrary.Friend[] memory) {
        return amicusHub.getOutboundFriendRequests();
    }
 
    // Recipient is the address of the recipients UserProfile contract
    function sendFriendRequest(address recipient) external onlyOwner {
        amicusHub.sendFriendRequest(recipient);
    }
    
    // Sender is the address of the senders UserProfile contract
    function acceptFriendRequest(address sender) external onlyOwner {
        amicusHub.acceptFriendRequest(sender);
    }

    // Sender is the address of the senders UserProfile contract
    function rejectFriendRequest(address sender) external onlyOwner {
        amicusHub.rejectFriendRequest(sender);
    }

    // Recipient is the address of the recipients UserProfile contract
    // DestinationChain is the wormhole chain ID the request will be sent to
    // Target address is the AmicusHub contract address on the target chain
    function sendCrossChainFriendRequest(address recipient, uint16 destinationChain, address targetAddress) external payable onlyOwner {
        amicusHub.sendCrossChainFriendRequest{value: msg.value}(recipient, destinationChain, targetAddress);
    }

    // Sender is the address of the request senders UserProfile contract
    // SourceChain is the wormhole chain ID the request was sent from
    // Target address is the AmicusHub contract address on the target chain (the chain the request was sent from)
    function acceptCrossChainFriendRequest(address sender, uint16 sourceChain, address targetAddress) external payable onlyOwner {
        amicusHub.acceptCrossChainFriendRequest{value: msg.value}(sender, sourceChain, targetAddress);
    }

    // Sender is the address of the request senders UserProfile contract
    // SourceChain is the wormhole chain ID the request was sent from
    // Target address is the AmicusHub contract address on the target chain (the chain the request was sent from)
    function rejectCrossChainFriendRequest(address sender, uint16 sourceChain, address targetAddress) external payable onlyOwner {
        amicusHub.rejectCrossChainFriendRequest{value: msg.value}(sender, sourceChain, targetAddress);
    }

    function connectToDapp(uint256 dappId) external onlyOwner {
        amicusRegistry.connectUser(dappId);
    }
}
