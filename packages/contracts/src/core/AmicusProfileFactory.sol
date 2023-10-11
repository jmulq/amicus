// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AmicusHub.sol";
import "./AmicusProfile.sol";
import "./AmicusRegistry.sol";

contract AmicusProfileFactory {
    AmicusRegistry private registry;
    AmicusHub private hub;

    event ProfileCreated(address indexed profile, address indexed owner);

    constructor(address _profileRegistry, address _hub) {
        registry = AmicusRegistry(_profileRegistry);
        hub =  AmicusHub(_hub);
    }

    function createUserProfile(string memory name, string memory image) external {
        AmicusProfile newProfile = new AmicusProfile(hub, msg.sender, name, image);

        registry.registerUserProfile(msg.sender, address(newProfile));

        emit ProfileCreated(address(newProfile), msg.sender);
    }
}
