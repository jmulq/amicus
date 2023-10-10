// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AmicusHub.sol";

contract AmicusProfile {
    AmicusHub public amicusHub;
    
    string public name;
    string public image;

    
    constructor(address _amicusHub, string memory _name, string memory _image) {
        amicusHub = AmicusHub(_amicusHub);
        name = _name;
        image = _image;
    }

    function getFriends() external view returns (address[] memory) {
        return amicusHub.getFriends(address(this));
    }
 
    // Recipient is the address of the recipients UserProfile contract
    function sendFriendRequest(address recipient) external {
        amicusHub.sendFriendRequest(recipient);
    }
    
    // Sender is the address of the senders UserProfile contract
    function acceptFriendRequest(address sender) external {
        amicusHub.acceptFriendRequest(sender);
    }

    // Sender is the address of the senders UserProfile contract
    function rejectFriendRequest(address sender) external {
        amicusHub.rejectFriendRequest(sender);
    }
}
