// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmicusRegistry {
    // Wallet address to UserProfile contract instance.
    // For the MVP we assume that the owner will be a wallet,
    // hence walletToProfile.
    mapping(address => address) public walletToProfile;
    mapping(address => address) public profileToWallet;

    struct Dapp {
        uint256 id;
        string name;
        address[] connectedProfiles;
    }

    mapping(uint256 => Dapp) public dapps;
    uint256 dappCount;

    event ProfileRegistered(address indexed profile, address indexed owner);
    event DappRegistered(uint256 dappId, string name);
    event UserConnectedToDapp(uint256 dappId, address profile);

    function registerUserProfile(address owner, address profile) external {
        require(walletToProfile[owner] == address(0), "Profile already registered");

        walletToProfile[owner] = profile;
        profileToWallet[profile] = owner;

        emit ProfileRegistered(profile, owner);
    }

    function getUserProfileAddress(address owner) external view returns (address) {
        return walletToProfile[owner];
    }
    
    function getProfileWalletAddress(address profile) external view returns (address) {
        return profileToWallet[profile];
    }

    function registerDapp(string memory _name) external {
        require(bytes(_name).length > 0, "Dapp name cannot be empty");

        uint256 dappId = dappCount + 1;
        dappCount++;

        Dapp storage newDapp = dapps[dappId];
        newDapp.id = dappId;
        newDapp.name = _name;

        emit DappRegistered(dappId, _name);
    }

    function connectUser(uint256 _dappId) external {
        require(_dappId > 0 && _dappId <= dappCount, "Invalid Dapp ID");

        Dapp storage dapp = dapps[_dappId];
        dapp.connectedProfiles.push(msg.sender);

        for (uint i = 0; i < dapp.connectedProfiles.length; i++) {
            require(dapp.connectedProfiles[i] != msg.sender, "User already connected to Dapp");
        }

        emit UserConnectedToDapp(_dappId, msg.sender);
    }

    function getDappUsers(uint256 _dappId) external view returns (address[] memory) {
        require(_dappId > 0 && _dappId <= dappCount, "Invalid Dapp ID");
        return dapps[_dappId].connectedUsers;
    }
}
