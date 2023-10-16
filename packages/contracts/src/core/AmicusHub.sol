// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AmicusLibrary.sol";
import "@wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
import "@wormhole-solidity-sdk/WormholeRelayerSDK.sol";

contract AmicusHub is Base, IWormholeReceiver {
    using AmicusLibrary for AmicusLibrary.Friend;

    uint256 constant GAS_LIMIT = 550_000;
    uint16 internal immutable chain;

    enum CrossChainMessage {
        REQUEST,
        ACCEPT,
        REJECT
    }

    mapping(address => AmicusLibrary.Friend[]) friends;
    // mapping(address => address[]) friends;
    mapping(address => AmicusLibrary.Friend[]) inboundRequests;
    // mapping(address => address[]) inboundRequests;
    mapping(address => AmicusLibrary.Friend[]) outboundRequests;
    // mapping(address => address[]) outboundRequests;

    event FriendRequestSent(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);
    event FriendRequestAccepted(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);
    event FriendRequestRejected(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);
    event CrossChainRequestReceived(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);
    event CrossChainRequestAccepted(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);
    event CrossChainRequestRejected(address indexed sender, uint16 senderChain, address indexed recipient, uint16 recipientChain);

    constructor(address _wormholeRelayer, address _wormhole, uint16 _chain) Base(_wormholeRelayer, _wormhole) {
        chain = _chain;
    }

    // Called by the AmicusProfile contract of the user.
    function getFriends() external view returns (AmicusLibrary.Friend[] memory) {
        return friends[msg.sender];
    }

    // Called by the AmicusProfile contract of the user.
    function getInboundFriendRequests() external view returns (AmicusLibrary.Friend[] memory) {
        return inboundRequests[msg.sender];
    }
    
    // Called by the AmicusProfile contract of the user.
    function getOutboundFriendRequests() external view returns (AmicusLibrary.Friend[] memory) {
        return outboundRequests[msg.sender];
    }

    // TODO - Add access control so only auth contracts (UserProfiles) can call this function.
    function sendFriendRequest(address recipient) external {
        require(msg.sender != recipient, "You cannot send a friend request to yourself.");
        require(!_hasOutboundRequest(msg.sender, recipient, chain), "You have already sent a friend request to this user.");
        require(!_isFriend(msg.sender, recipient, chain), "You are already friends with this user.");

        // Add the recipient to the senders outbound requests.
        _addRequest(outboundRequests[msg.sender], AmicusLibrary.Friend(recipient, chain));
        // Add the sender to the recipients inbound requests.
        _addRequest(inboundRequests[recipient], AmicusLibrary.Friend(msg.sender, chain));

        emit FriendRequestSent(msg.sender, chain, recipient, chain);
    }

    function acceptFriendRequest(address sender) external {
        require(_hasInboundRequest(sender, msg.sender, chain), "This user has not sent you a friend request.");
        require(!_isFriend(msg.sender, sender, chain), "You are already friends with this user.");
        
        // Remove the friend request from the senders outbound requests.
        _removeFriendRequest(outboundRequests[sender], msg.sender, chain);
        // Remove the friend request from the recipients inbound requests.
        _removeFriendRequest(inboundRequests[msg.sender], sender, chain);

        // Add profiles to respective friends lists in storage.
        _addFriend(msg.sender, AmicusLibrary.Friend(sender, chain));
        _addFriend(sender, AmicusLibrary.Friend(msg.sender, chain));

        emit FriendRequestAccepted(sender, chain, msg.sender, chain);
    }

    function rejectFriendRequest (address sender) external {
        require(_hasInboundRequest(sender, msg.sender, chain), "This user has not sent you a friend request.");

        require(!_isFriend(msg.sender, sender, chain), "You are already friends with this user.");

        // Remove the friend request from the senders outbound requests.
        _removeFriendRequest(outboundRequests[sender], msg.sender, chain);
        // Remove the friend request from the recipients inbound requests.
        _removeFriendRequest(inboundRequests[msg.sender], sender, chain);

        emit FriendRequestRejected(sender, chain, msg.sender, chain);
    }

    function sendCrossChainFriendRequest(address recipient, uint16 destinationChain, address targetAddress) external payable {
        require(msg.sender != recipient, "You cannot send a friend request to yourself.");
        require(!_hasOutboundRequest(msg.sender, recipient, destinationChain), "You have already sent a friend request to this user.");
        require(!_isFriend(msg.sender, recipient, destinationChain), "You are already friends with this user.");
        
        // Add the recipient to the senders outbound requests.
        _addRequest(outboundRequests[msg.sender], AmicusLibrary.Friend(recipient, destinationChain));

        uint256 cost = quoteCrossChainGreeting(destinationChain);
        require(msg.value >= cost, "Insufficient amount to send cross-chain request.");
        
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            destinationChain,
            targetAddress, // Address of AmicusHub on dest chain
            abi.encode(CrossChainMessage.REQUEST, msg.sender, recipient),
            0,
            GAS_LIMIT
        );
        emit FriendRequestSent(msg.sender, chain, recipient, destinationChain);
    }

    // Source chain refers to the source of the friend request we are accepting.
    // Target address refers to the AmicusHub contract on source/other chain.
    function acceptCrossChainFriendRequest(address sender, uint16 sourceChain, address targetAddress) external payable {
        require(_hasInboundRequest(sender, msg.sender, sourceChain), "This user has not sent you a friend request.");
        require(!_isFriend(msg.sender, sender, sourceChain), "You are already friends with this user.");

        // Remove the friend request from the recipients inbound requests.
        _removeFriendRequest(inboundRequests[msg.sender], sender, sourceChain);
        // Add new friend (friend request sender on source/other chain) to msg.senders friends list.
        _addFriend(msg.sender, AmicusLibrary.Friend(sender, sourceChain));

        uint256 cost = quoteCrossChainGreeting(sourceChain);
        require(msg.value >= cost, "Insufficient amount to send cross-chain request.");
        
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            sourceChain,
            targetAddress,
            abi.encode(CrossChainMessage.ACCEPT, msg.sender, sender),
            0,
            GAS_LIMIT
        );
        emit FriendRequestAccepted(sender, sourceChain, msg.sender, chain);
    }

    function rejectCrossChainFriendRequest(address sender, uint16 sourceChain, address targetAddress) external payable {
        require(_hasInboundRequest(sender, msg.sender, sourceChain), "This user has not sent you a friend request.");
        require(!_isFriend(msg.sender, sender, sourceChain), "You are already friends with this user.");

        // Remove the friend request from the recipients inbound requests.
        _removeFriendRequest(inboundRequests[msg.sender], sender, sourceChain);

        uint256 cost = quoteCrossChainGreeting(sourceChain);
        require(msg.value >= cost, "Insufficient amount to send cross-chain request.");
        
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            sourceChain,
            targetAddress,
            abi.encode(CrossChainMessage.REJECT, msg.sender, sender),
            0,
            GAS_LIMIT
        );
        emit FriendRequestRejected(sender, sourceChain, msg.sender, chain);
    }

    function quoteCrossChainGreeting(uint16 targetChain) public view returns (uint256 cost) {
        (cost,) = wormholeRelayer.quoteEVMDeliveryPrice(targetChain, 0, GAS_LIMIT);
    }

    // Handles cross-chain friend requests send/accept/reject.
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalVaas,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");

        require(!seenDeliveryVaaHashes[deliveryHash], "Message already processed");
        seenDeliveryVaaHashes[deliveryHash] = true;

        // Parse the payload and do the corresponding actions!
        (CrossChainMessage messageType, address from, address to) = abi.decode(payload, (CrossChainMessage, address, address));
        
        if (messageType == CrossChainMessage.REQUEST) {
            // `from` is the friend request sender.
            // `to` is the friend request recipient.
            _addRequest(inboundRequests[to], AmicusLibrary.Friend(from, sourceChain));
            emit CrossChainRequestReceived(from, sourceChain, to, chain);
        } else if (messageType == CrossChainMessage.ACCEPT) {
            // `to` is the friend request sender.
            // `from` is the friend request recipient.
            _removeFriendRequest(outboundRequests[to], from, sourceChain);
            _addFriend(to, AmicusLibrary.Friend(from, sourceChain));
            emit CrossChainRequestAccepted(to, chain, from, sourceChain);
        } else if (messageType == CrossChainMessage.REJECT) {
            // `to` is the friend request sender.
            // `from` is the friend request recipient.
            _removeFriendRequest(outboundRequests[to], from, sourceChain);
            emit CrossChainRequestRejected(to, chain, from, sourceChain);
        }
    }

    function _hasOutboundRequest(address sender, address recipient, uint16 chainId) internal view returns (bool) {
        AmicusLibrary.Friend[] memory senderOutboundRequests = outboundRequests[sender];
        for (uint i = 0; i < senderOutboundRequests.length; i++) {
            if (
                senderOutboundRequests[i].profile == recipient &&
                senderOutboundRequests[i].chain == chainId
            ) {
                return true;
            }
        }
        return false;
    }

    function _hasInboundRequest(address sender, address recipient, uint16 chainId) internal view returns (bool) {
        AmicusLibrary.Friend[] memory recipientInboundRequests = inboundRequests[recipient];
        for (uint i = 0; i < recipientInboundRequests.length; i++) {
            if (
                recipientInboundRequests[i].profile == sender &&
                recipientInboundRequests[i].chain == chainId
            ) {
                return true;
            }
        }
        return false;
    }

    function _isFriend(address user, address friend, uint16 chainId) internal view returns (bool) {
        AmicusLibrary.Friend [] memory userFriends = friends[user];
        for (uint i = 0; i < userFriends.length; i++) {
            if (
                userFriends[i].profile == friend &&
                userFriends[i].chain == chainId
            ) {
                return true;
            }
        }
        return false;
    }

    function _addFriend(address user, AmicusLibrary.Friend memory friend) internal {
        friends[user].push(friend);
    }

    function _addRequest(AmicusLibrary.Friend[] storage requests, AmicusLibrary.Friend memory request) internal {
        requests.push(request);
    }

    function _removeFriendRequest(AmicusLibrary.Friend[] storage requests, address profile, uint16 profileChain) internal {
        uint length = requests.length;
        for (uint i = 0; i < length; i++) {
            if (
                requests[i].profile == profile &&
                requests[i].chain == profileChain
            ) {
                requests[i] = requests[length - 1];
                requests.pop();
                break;
            }
        }
    }
}