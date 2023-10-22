"use client"

import { useState } from "react"
import { env } from "@/env.mjs"
import { LuGrip } from "react-icons/lu"
import {
  useAccount,
  useChainId,
  useConnect,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const AmicusRegistry = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "dappId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "DappRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "profile",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ProfileRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "dappId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "profile",
        type: "address",
      },
    ],
    name: "UserConnectedToDapp",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dappId",
        type: "uint256",
      },
    ],
    name: "connectUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "dapps",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dappId",
        type: "uint256",
      },
    ],
    name: "getDappUsers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "profile",
        type: "address",
      },
    ],
    name: "getProfileWalletAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getUserProfileAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "profileToWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "registerDapp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "profile",
        type: "address",
      },
    ],
    name: "registerUserProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "walletToProfile",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export const AmicusProfile = [
  {
    inputs: [
      {
        internalType: "contract AmicusHub",
        name: "_amicusHub",
        type: "address",
      },
      {
        internalType: "contract AmicusRegistry",
        name: "_amicusRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_image",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "sourceChain",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
    ],
    name: "acceptCrossChainFriendRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "acceptFriendRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "dappId",
        type: "uint256",
      },
    ],
    name: "connectToDapp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getFriends",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "profile",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "chain",
            type: "uint16",
          },
        ],
        internalType: "struct AmicusLibrary.Friend[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInboundFriendRequests",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "profile",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "chain",
            type: "uint16",
          },
        ],
        internalType: "struct AmicusLibrary.Friend[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOutboundFriendRequests",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "profile",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "chain",
            type: "uint16",
          },
        ],
        internalType: "struct AmicusLibrary.Friend[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "image",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "sourceChain",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
    ],
    name: "rejectCrossChainFriendRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "rejectFriendRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "destinationChain",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
    ],
    name: "sendCrossChainFriendRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "sendFriendRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

interface ConnectButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  src?: string
}

const contracts = {
  5: {
    registry: "0x924baB7488e51d8B7A3BD845489520B539c405Fd",
  },
  80001: {
    registry: "0xC02b8826ebc5ba06c032265492017Ecb7e421EF3",
  },
}

export function ConnectButton({
  className,
  children,
  src,
  ...props
}: ConnectButtonProps) {
  const chainId = useChainId()
  const { address } = useAccount()
  const [hasConnected, setHasConnected] = useState(false)
  const { data: profile } = useContractRead({
    address: contracts[(chainId as 5) || 80001].registry as `0x${string}`,
    abi: AmicusRegistry,
    functionName: "getUserProfileAddress",
    args: [address],
    enabled: Boolean(address),
  })

  const { data: dappUsers } = useContractRead({
    address: contracts[(chainId as 5) || 80001].registry as `0x${string}`,
    abi: AmicusRegistry,
    functionName: "getDappUsers",
    args: [1],
    enabled: Boolean(address && profile),
  })

  const { data: friends } = useContractRead({
    address: profile as `0x${string}`,
    abi: AmicusProfile,
    functionName: "getFriends",
    account: address,
    enabled: Boolean(profile),
  })

  const { config, error } = usePrepareContractWrite({
    address: profile as `0x${string}`,
    abi: AmicusProfile,
    functionName: "connectToDapp",
    account: address,
    args: [1],
  })

  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const connectAmicus = () => {
    write?.()
  }

  const getText = () => {
    if (isLoading) return "Connecting..."
    if (isSuccess || error) return "Connected!"
    return "Connect"
  }

  const displayFriends = isSuccess && friends?.length > 0;

  return (
    <>
      <Button
        className={cn(
          "relative z-10 mt-5 flex h-14 items-center gap-x-2 bg-muted/50 py-4 font-mono text-lg text-muted-foreground hover:bg-muted/80 hover:text-accent-foreground",
          className
        )}
        variant="secondary"
        onClick={connectAmicus}
        {...props}
      >
        {getText()}
      </Button>
      {displayFriends && <table className="mt-7 w-full table-auto border-collapse text-left">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center text-lg text-muted-foreground">
              Friends List (address)
            </th>
          </tr>
        </thead>
        <tbody>
          {/* // @ts-ignore */}
          {friends?.map((friend: any) => {
            if (dappUsers.includes(friend.profile)) {
              return (
                <tr>
                  <td className="text-md px-4 py-2 text-center text-muted-foreground">
                    {JSON.stringify(friend.profile)}
                  </td>
                </tr>
              )
            } else {
              return null
            }
          })}
        </tbody>
      </table>}
    </>
  )
}
