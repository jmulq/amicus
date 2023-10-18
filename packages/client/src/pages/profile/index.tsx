/* eslint-disable @typescript-eslint/ban-ts-comment */
import AmicusProfile from "../../abis/AmicusProfile.json";
import profilePicture from "@/assets/profile-picture.png";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAmicusProfile } from "@/context/AmicusProfileContext";
import Layout from "@/layout";
import { truncateAddress } from "@/utils";
import { useState } from "react";
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

const ProfilePage = () => {
  const [friendToAdd, setFriendToAdd] = useState<string>("");
  const { profile } = useAmicusProfile();

  const { data } = useContractReads({
    contracts: [
      {
        address: profile,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        abi: AmicusProfile,
        functionName: "name",
      },
      {
        address: profile,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        abi: AmicusProfile,
        functionName: "image",
      },
      {
        address: profile,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        abi: AmicusProfile,
        functionName: "getFriends",
      },
      {
        address: profile,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        abi: AmicusProfile,
        functionName: "getInboundFriendRequests",
      },
      {
        address: profile,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        abi: AmicusProfile,
        functionName: "getOutboundFriendRequests",
      },
    ],
    enabled: Boolean(profile),
  });

  const { config } = usePrepareContractWrite({
    abi: AmicusProfile,
    address: profile,
    functionName: "sendFriendRequest",
    enabled: Boolean(profile),
    args: [friendToAdd],
  });

  const { write } = useContractWrite(config);

  if (!data) return;

  const profileName = data[0].result;
  const profileImage = data[1].result;
  const profileFriends = data[2].result;
  const profileInboundReqs = data[3].result;
  const profileOutboundReqs = data[4].result;

  return (
    <Layout>
      <div className="flex gap-x-10">
        <div className="flex flex-col gap-y-10 flex-1">
          <div className="h-fit relative overflow-hidden">
            <img src={profilePicture} alt="" className="w-full" />
            <p className="absolute bg-black font-bold py-3 bg-opacity-25 text-center bottom-0 right-0 left-0 text-white">
              {/* @ts-ignore */}
              {profileName ?? ""}
            </p>
          </div>

          <div className="space-y-7">
            <h3 className="font-bold border-b pb-4 border-primary-300">
              Friends
            </h3>
            <div className="space-y-4">
              {
                // @ts-ignore
                profileFriends.length
                  ? friends.map((friend, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-end"
                      >
                        <div className="gap-x-4 items-center flex">
                          <div className="rounded-full h-12 w-12 border bg-slate-300">
                            <img src={friend.image} alt="" />
                          </div>
                          <p>{friend.name}</p>
                        </div>
                        <Button
                          size="sm"
                          className="h-10 text-white bg-rose-500"
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  : "No friends yet"
              }
            </div>
          </div>
        </div>

        {/* Right half */}
        <div className="w-[40%] space-y-10">
          <form className="space-y-3">
            <Input
              name="address"
              label="Add Friend"
              placeholder="Enter an address you wish to send a friend request"
              detached
              className="w-full py-3"
              value={friendToAdd}
              onChange={(e) => setFriendToAdd(e.target.value)}
            />
            <Button
              size="sm"
              intent="secondary"
              className="h-10 text-white ml-auto"
              disabled={!friendToAdd || !write}
              onClick={() => write?.()}
            >
              Send Friend Request
            </Button>
          </form>

          <div className="border border-primary-300 rounded-lg h-[30vh]">
            <div>Inbound Requests</div>
            {/* @ts-ignore */}
            {profileInboundReqs.length
              ? profileInboundReqs.map((req) => (
                  <div className="flex space-x-4">
                    <div>{truncateAddress(req.profile)}</div>
                    <Button intent="secondary">Accept</Button>
                    <Button intent="danger">Reject</Button>
                  </div>
                ))
              : "No inbound requests"}
          </div>
          {/* height is 60% of the screen height */}
          <div className="border border-primary-300 rounded-lg h-[30vh]">
            <div>Outbound Requests</div>
            {/* @ts-ignore */}
            {profileOutboundReqs.length
              ? profileOutboundReqs.map((req) => (
                  <div className="flex space-x-4">
                    <div>{truncateAddress(req.profile)}</div>
                    <div>Pending</div>
                  </div>
                ))
              : "No inbound requests"}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
