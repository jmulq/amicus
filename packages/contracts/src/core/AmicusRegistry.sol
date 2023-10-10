// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmicusRegistry {
    // Wallet address to UserProfile contract instance.
    // For the MVP we assume that the owner will be a wallet,
    // hence walletToProfile.
    mapping(address => address) public walletToProfile;

    event ProfileRegistered(address indexed profile, address indexed owner);

    function registerUserProfile(address owner, address profile) external {
        require(walletToProfile[owner] == address(0), "Profile already registered");

        walletToProfile[owner] = profile;

        emit ProfileRegistered(profile, owner);
    }

    function getUserProfileAddress(address owner) external view returns (address) {
        return walletToProfile[owner];
    }
}
