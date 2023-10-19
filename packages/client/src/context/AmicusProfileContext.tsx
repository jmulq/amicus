/* eslint-disable react-refresh/only-export-components */
import { contracts } from '@/web3/config';
import { ReactNode, createContext } from 'react';
import { zeroAddress } from 'viem';
import { useAccount, useChainId, useContractRead } from 'wagmi';
import AmicusRegistry from '../abis/AmicusRegistry.json';

export const AmicusProfileContext = createContext<`0x${string}`>(zeroAddress);

export const AmicusProfileProvider = ({ children }: { children: ReactNode }) => {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contracts[chainId === (5 || 80001) ? chainId : 5].registry,
    abi: AmicusRegistry,
    functionName: 'getUserProfileAddress',
    args: [address],
    enabled: Boolean(address),
  });

  return (
    <AmicusProfileContext.Provider value={data as `0x${string}`}>
      {children}
    </AmicusProfileContext.Provider>
  );
};
