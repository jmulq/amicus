// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AmicusHub.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract AmicusProfile is Ownable {
    AmicusHub private amicusHub;
    
    address public owner;
    string public name;
    string public image;

    // TODO - Format solidity code
    constructor(
        AmicusHub _amicusHub, address _owner, string memory _name, string memory _image
    ) Ownable(_owner) {
        amicusHub = _amicusHub;
        owner = _owner;
        name = _name;
        image = _image;
    }

    function getFriends() external view onlyOwner returns (address[] memory) {
        return amicusHub.getFriends(address(this));
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
}
