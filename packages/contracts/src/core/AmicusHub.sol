// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmicusHub {
    mapping(address => address[]) friends;
    mapping(address => address[]) inboundRequests;
    mapping(address => address[]) outboundRequests;

    event FriendRequestSent(address indexed sender, address indexed recipient);
    event FriendRequestAccepted(address indexed sender, address indexed recipient);
    event FriendRequestRejected(address indexed sender, address indexed recipient);

    // Called by the AmicusProfile contract of the user.
    function getFriends() external view returns (address[] memory) {
        return friends[msg.sender];
    }

    // Called by the AmicusProfile contract of the user.
    function getInboundFriendRequests() external view returns (address[] memory) {
        return inboundRequests[msg.sender];
    }
    
    // Called by the AmicusProfile contract of the user.
    function getOutboundFriendRequests() external view returns (address[] memory) {
        return outboundRequests[msg.sender];
    }

    // TODO - Add access control so only auth contracts (UserProfiles) can call this function.
    function sendFriendRequest(address recipient) external {
        require(msg.sender != recipient, "You cannot send a friend request to yourself.");
        require(!_hasOutboundRequest(msg.sender, recipient), "You have already sent a friend request to this user.");
        require(!_isFriend(msg.sender, recipient), "You are already friends with this user.");

        // Add the recipient to the senders outbound requests.
        outboundRequests[msg.sender].push(recipient);
        // Add the sender to the recipients inbound requests.
        inboundRequests[recipient].push(msg.sender);

        emit FriendRequestSent(msg.sender, recipient);
    }

    function acceptFriendRequest(address sender) external {
        require(_hasInboundRequest(sender, msg.sender), "This user has not sent you a friend request.");
        require(!_isFriend(msg.sender, sender), "You are already friends with this user.");
        
        // Remove the friend request from the senders outbound requests.
        address[] storage senderReqs = outboundRequests[sender];
        uint senderReqLength = senderReqs.length;
        for (uint i = 0; i < senderReqLength; i++) {
            if (senderReqs[i] == msg.sender) {
                senderReqs[i] = senderReqs[senderReqLength - 1];
                senderReqs.pop();
                break;
            }
        }

        // Remove the friend request from the recipients inbound requests.
        address[] storage recipReqs = inboundRequests[msg.sender];
        uint recipReqLength = recipReqs.length;
        for (uint i = 0; i < recipReqLength; i++) {
            if (recipReqs[i] == sender) {
                recipReqs[i] = recipReqs[recipReqLength - 1];
                recipReqs.pop();
                break;
            }
        }
        
        // Add profiles to respective friends lists.
        friends[msg.sender].push(sender);
        friends[sender].push(msg.sender);

        emit FriendRequestAccepted(sender, msg.sender);
    }

    function rejectFriendRequest (address sender) external {
        require(_hasInboundRequest(sender, msg.sender), "This user has not sent you a friend request.");

        require(!_isFriend(msg.sender, sender), "You are already friends with this user.");

        // Remove the friend request from the senders outbound requests.
        address[] storage senderReqs = outboundRequests[sender];
        uint senderReqLength = senderReqs.length;
        for (uint i = 0; i < senderReqLength; i++) {
            if (senderReqs[i] == msg.sender) {
                senderReqs[i] = senderReqs[senderReqLength - 1];
                senderReqs.pop();
                break;
            }
        }

        // Remove the friend request from the recipients inbound requests.
        address[] storage recipReqs = inboundRequests[msg.sender];
        uint recipReqLength = recipReqs.length;
        for (uint i = 0; i < recipReqLength; i++) {
            if (recipReqs[i] == sender) {
                recipReqs[i] = recipReqs[recipReqLength - 1];
                recipReqs.pop();
                break;
            }
        }
        
        emit FriendRequestRejected(sender, msg.sender);
    }

    function _hasOutboundRequest(address sender, address recipient) internal view returns (bool) {
        address[] memory senderOutboundRequests = outboundRequests[sender];
        for (uint i = 0; i < senderOutboundRequests.length; i++) {
            if (senderOutboundRequests[i] == recipient) {
                return true;
            }
        }
        return false;
    }

    function _hasInboundRequest(address sender, address recipient) internal view returns (bool) {
        address[] memory recipientInboundRequests = inboundRequests[recipient];
        for (uint i = 0; i < recipientInboundRequests.length; i++) {
            if (recipientInboundRequests[i] == sender) {
                return true;
            }
        }
        return false;
    }

    function _isFriend(address user, address friend) internal view returns (bool) {
        address [] memory userFriends = friends[user];

        for (uint i = 0; i < userFriends.length; i++) {
            if (userFriends[i] == friend) {
                return true;
            }
        }
        return false;
    }
}