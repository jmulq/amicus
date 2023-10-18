import { Navigate } from "react-router-dom";
import AmicusRegistry from "../abis/AmicusRegistry.json";
import { Route as RouteType } from "../types";
import { useAccount, useChainId, useContractRead } from "wagmi";
import { contracts } from "@/web3/config";
import { zeroAddress } from "viem";
import { useAmicusProfile } from "@/context/AmicusProfileContext";

const ProtectedRoute: React.FC<RouteType> = ({
  redirectTo = "/register",
  children,
}) => {
  const chainId = useChainId();
  const { address } = useAccount();
  const { setProfile } = useAmicusProfile();

  const { data, isLoading } = useContractRead({
    address: contracts[chainId === (5 || 80001) ? chainId : 5].registry,
    abi: AmicusRegistry,
    functionName: "getUserProfileAddress",
    args: [address],
    enabled: Boolean(address),
  });

  if (data == zeroAddress && !isLoading) {
    return <Navigate to={redirectTo} replace />;
  }
  setProfile(data as `0x${string}`);

  return <>{children}</>;
};

export default ProtectedRoute;
