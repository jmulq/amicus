/ Core deploy
forge script ./script/Deploy.s.sol:DeployCoreContracts -vvv --broadcast --rpc-url polygonMumbai --sig "run(address,address,uint16)" -- <RELAYER> <WORMHOLE> <CHAIN ID> 

// Mumbai
forge script ./script/Deploy.s.sol:DeployCoreContracts -vvv --broadcast --rpc-url polygonMumbai --sig "run(address,address,uint16)" -- 0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 5
// Goerli
forge script ./script/Deploy.s.sol:DeployCoreContracts -vvv --broadcast --rpc-url ethereumGoerli --sig "run(address,address,uint16)" -- 0x28D8F1Be96f97C1387e94A53e00eCcFb4E75175a 0x706abc4E45D419950511e474C7B9Ed348A4a716c 2

/ Create User
forge script ./script/Deploy.s.sol:CreateUserProfile -vvv --broadcast --rpc-url polygonMumbai --sig "run(string,string,address)" -- <NAME> <IMAGE> <FACTORY>

// Mumbai
forge script ./script/Deploy.s.sol:CreateUserProfile -vvv --broadcast --rpc-url polygonMumbai --sig "run(string,string,address)" -- james.amicus testimage <FACTORY>
// Goerli
forge script ./script/Deploy.s.sol:CreateUserProfile -vvv --broadcast --rpc-url ethereumGoerli --sig "run(string,string,address)" -- geeb.amicus testimage <FACTORY>

/ Cross Chain Request

// Mumbai -> Goerli
forge script ./script/Deploy.s.sol:CrossChainFriendRequest -vvv --broadcast --rpc-url polygonMumbai --sig "run(address,address,uint16,address,address)" -- <PROFILE> <RECIPIENT> <DESTINATION_CHAIN> <SOURCE_HUB> <DESTINATION_HUB>

forge script ./script/Deploy.s.sol:CrossChainFriendRequest -vvv --broadcast --rpc-url polygonMumbai --sig "run(address,address,uint16,address,address)" -- 0xf6215aDF58d6c3380692D3E3ad8473B1FD090cE6 0x5dCb4FcF74de1bfd221F68CCbEffCD06CeDCB4E9 2 0xBcd3087C83FE009e1824F4c41fDE483f33AA411B 0xfc59Ce8DE9A00ca528BeACa968bB2B7748580265

/ Accept Cross chain request

// Goerli
forge script ./script/Deploy.s.sol:AcceptCrossChainFriendRequest -vvv --broadcast --rpc-url polygonMumbai --sig "run(address,address,uint16,address,address,)" -- <PROFILE> <SENDER> <CHAIN> <SOURCEHUB> <DESTHUB>

forge script ./script/Deploy.s.sol:AcceptCrossChainFriendRequest -vvv --broadcast --rpc-url ethereumGoerli --sig "run(address,address,uint16,address,address)" -- 0x5dCb4FcF74de1bfd221F68CCbEffCD06CeDCB4E9 0xf6215aDF58d6c3380692D3E3ad8473B1FD090cE6 5 0xfc59Ce8DE9A00ca528BeACa968bB2B7748580265 0xBcd3087C83FE009e1824F4c41fDE483f33AA411B


/  User Profile Data
// Verify that the source user profile has an outbound request in their profile
forge script ./script/Deploy.s.sol:UserProfileData -vvv --broadcast --rpc-url polygonMumbai --sig "run(address)" -- <PROFILE>

// Verify that the destination user profile has an inbound request in their profile
forge script ./script/Deploy.s.sol:UserProfileData -vvv --broadcast --rpc-url ethereumGoerli --sig "run(address)" -- <PROFILE>

// To view status of cross-chain request see https://wormholescan.io/#/?network=TESTNET

_______

Mumbai:
_______

Amicus Hub deployed at: 0xFE5bf7090ca401471F5420a6755f574A31eAef38.
Amicus Registry deployed at: 0x1548Bd9C523Eaa0E93D6B8d1C6FAb81922aE9ec4.
Amicus Profile Factory deployed at: 0x6F34BCeC383dC4cf440269AA58040539bbf922d5.
User Profile deployed at: 0xa112CaDBa3975a0df2c60144531b59f101DF3afa.


_______

Goerli:
_______

Amicus Hub deployed at: 0xFAaE372e7C43f2b6192ea2FE14D5E4B7f6C291d4.
Amicus Registry deployed at: 0x57ba087f1F04E161b7AbEf1012C0e80cAc6F6FD3.
Amicus Profile Factory deployed at: 0xB013d517a61162D1a52416A5bF645696cE363d79.
User Profile deployed at: 0xB75542bd7D016498a10BAdE4F571b56C1a88E693





The contract has been changed to forward value sent to profile cross-chain friend req function to the hub.
Need to:
- Redeploy core contract and users for mumbai and goerli
- Get value to send
    cast call <SOURCE_HUB> "quoteCrossChainGreeting(uint16) (uint256)" 5 --chain 80001 --rpc-url https://polygon-mumbai.g.alchemy.com/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF
- Send cross chain request


cast call 0xfc59Ce8DE9A00ca528BeACa968bB2B7748580265 "quoteCrossChainGreeting(uint16) (uint256)" 5 --rpc-url https://eth-goerli.g.alchemy.com/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF