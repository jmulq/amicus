// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmicusHub {
    // Mapping of UserProfile contract address to array of friends.
    // The UserProfile contract of each user will be responsible for
    // interacting with the AmicusHub functions.
    mapping(address => address[]) public friends;
    // Mapping to track outgoing friend requests for each user.
    mapping(address => mapping(address => bool)) public friendRequests;

    event FriendRequestSent(address indexed sender, address indexed recipient);
    event FriendRequestAccepted(address indexed sender, address indexed recipient);
    event FriendRequestRejected(address indexed sender, address indexed recipient);

    function getFriends(address user) external view returns (address[] memory) {
        return friends[user];
    }

    // TODO - Add access control so only auth contracts (UserProfiles) can call this function.
    function sendFriendRequest(address recipient) external {
        require(msg.sender != recipient, "You cannot send a friend request to yourself.");

        require(!friendRequests[msg.sender][recipient], "You have already sent a friend request to this user.");

        require(!_isFriend(msg.sender, recipient), "You are already friends with this user.");

        friendRequests[msg.sender][recipient] = true;

        emit FriendRequestSent(msg.sender, recipient);
    }

    function acceptFriendRequest(address sender) external {
        require(friendRequests[sender][msg.sender], "This user has not sent you a friend request.");

        require(!_isFriend(msg.sender, sender), "You are already friends with this user.");

        friendRequests[sender][msg.sender] = false;
        friends[msg.sender].push(sender);
        friends[sender].push(msg.sender);

        emit FriendRequestAccepted(sender, msg.sender);
    }

    function rejectFriendRequest (address sender) external {
        require(friendRequests[sender][msg.sender], "This user has not sent you a friend request.");

        friendRequests[sender][msg.sender] = false;

        emit FriendRequestRejected(sender, msg.sender);
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