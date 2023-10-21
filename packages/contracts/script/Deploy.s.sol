//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/core/AmicusHub.sol";
import "../src/core/AmicusLibrary.sol";
import "../src/core/AmicusProfile.sol";
import "../src/core/AmicusProfileFactory.sol";
import "../src/core/AmicusRegistry.sol";

import "forge-std/Script.sol";



contract DeployCoreContracts is Script {
    function run(address relayer, address wormhole, uint16 chain) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        AmicusRegistry registry = new AmicusRegistry();
        AmicusHub hub = new AmicusHub(relayer, wormhole, chain);
        AmicusProfileFactory factory = new AmicusProfileFactory(address(registry), address(hub));
        
        registry.registerDapp("Demo Dapp");

        console.logString(
            string.concat(
                "Amicus Hub deployed at: ",
                vm.toString(address(hub)),
                ".\nAmicus Registry deployed at: ",
                vm.toString(address(registry)),
                ".\nAmicus Profile Factory deployed at: ",
                vm.toString(address(factory)),
                ".\nContracts deployed on on chain ID: ",
                vm.toString(chain)
            )
        );
        vm.stopBroadcast();
    }
}

contract CreateUserProfile is Script {
    function run(string memory name, string memory image, address factory) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);
        vm.recordLogs();

        AmicusProfileFactory profileFactory = AmicusProfileFactory(factory);
        profileFactory.createUserProfile(name, image);

       VmSafe.Log[] memory entries = vm.getRecordedLogs();

        console.logString(
            string.concat(
                "Entries length is: ",
                vm.toString(entries.length),
                ".\nProfile address is: ",
                vm.toString(entries[0].emitter),
                ".\nOwner address is: ",
                vm.toString(entries[0].topics[2])
            )
        );
        vm.stopBroadcast();
    }
}

contract CrossChainFriendRequest is Script {
    function run(address profile, address recipient, uint16 destinationChain, address sourceHub, address destinationHub) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        AmicusHub hub = AmicusHub(sourceHub);
        uint256 cost = hub.quoteCrossChainGreeting(destinationChain);
        console.logString(
            string.concat(
                "Cost of cross-chain greeting is: ",
                vm.toString(cost)
            )
        );
        AmicusProfile profileContract = AmicusProfile(profile);
        profileContract.sendCrossChainFriendRequest{value: cost}(recipient, destinationChain, destinationHub);

        console.logString(
            string.concat(
                "Cross-chain friend request sent from ",
                vm.toString(profile),
                " to ",
                vm.toString(recipient)
            )        
        );
        vm.stopBroadcast();
    }
}

contract AcceptCrossChainFriendRequest is Script {
    function run(address profile, address sender, uint16 destinationChain, address sourceHub, address destinationHub) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        AmicusHub hub = AmicusHub(sourceHub);
        uint256 cost = hub.quoteCrossChainGreeting(destinationChain);
        console.logString(
            string.concat(
                "Cost of cross-chain greeting is: ",
                vm.toString(cost)
            )
        );
        AmicusProfile profileContract = AmicusProfile(profile);
        profileContract.acceptCrossChainFriendRequest{value: cost}(sender, destinationChain, destinationHub);

        console.logString(
            string.concat(
                "Cross-chain friend request that was sent from ",
                vm.toString(sender),
                " has been accepted by ",
                vm.toString(profile)
            )
        );
        vm.stopBroadcast();
    }
}

contract UserProfileData is Script {
    using AmicusLibrary for AmicusLibrary.Friend;

    function run(address profile) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);
 
        AmicusProfile profileContract = AmicusProfile(profile);
        string memory name = profileContract.name();
        AmicusLibrary.Friend[] memory friends = profileContract.getFriends();
        AmicusLibrary.Friend[] memory outbounds = profileContract.getOutboundFriendRequests();
        AmicusLibrary.Friend[] memory inbounds = profileContract.getInboundFriendRequests();

        console.logString(
            string.concat(
                "User Profile: ",
                name,
                "\n"
            )
        );

        for (uint256 i = 0; i < friends.length; i++) {
            AmicusLibrary.Friend memory friend = friends[i];
            console.logString(
                string.concat(
                    "Friend #",
                    vm.toString(i),
                    "\nRecipient: ",
                    vm.toString(friend.profile),
                    "\nChain: ",
                    vm.toString(friend.chain)
                )
            );
        }

        for (uint256 i = 0; i < outbounds.length; i++) {
            AmicusLibrary.Friend memory outbound = outbounds[i];
            console.logString(
                string.concat(
                    "Outbound #",
                    vm.toString(i),
                    "\nRecipient: ",
                    vm.toString(outbound.profile),
                    "\nChain: ",
                    vm.toString(outbound.chain)
                )
            );
        }
        
        for (uint256 i = 0; i < inbounds.length; i++) {
            AmicusLibrary.Friend memory inbound = inbounds[i];
            console.logString(
                string.concat(
                    "Inbound #",
                    vm.toString(i),
                    "\nSender: ",
                    vm.toString(inbound.profile),
                    "\nChain: ",
                    vm.toString(inbound.chain)
                )
            );
        }


        vm.stopBroadcast();
    }
}
