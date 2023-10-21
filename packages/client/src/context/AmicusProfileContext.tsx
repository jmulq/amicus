/* eslint-disable react-refresh/only-export-components */
import { contracts } from '@/web3/config';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { useAccount, useChainId, useContractRead } from 'wagmi';
import AmicusRegistry from '../abis/AmicusRegistry.json';

export const AmicusProfileContext = createContext<{
  connectedProfile: `0x${string}`;
  allProfiles: { id: string; name: string; image: string }[];
}>({
  connectedProfile: zeroAddress,
  allProfiles: [],
});

const profileQuery = `
query {
  amicusProfiles {
    id
    name
    image
  }
}
`;

const goerliClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/jmulq/amicus-goerli',
  cache: new InMemoryCache(),
});

const mumbaiClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/jmulq/amicus-mumbai',
  cache: new InMemoryCache(),
});

export const AmicusProfileProvider = ({ children }: { children: ReactNode }) => {
  const chainId = useChainId();
  const [profiles, setProfiles] = useState<{ id: string; name: string; image: string }[]>([]);
  const { address } = useAccount();
  const { data } = useContractRead({
    address: contracts[(chainId as 5) || 80001].registry,
    abi: AmicusRegistry,
    functionName: 'getUserProfileAddress',
    args: [address],
    enabled: Boolean(address),
  });

  useEffect(() => {
    // Create an array of promises for both queries
    const fetchProfilesPromises = [
      goerliClient.query({ query: gql(profileQuery) }),
      mumbaiClient.query({ query: gql(profileQuery) }),
    ];

    // Use Promise.all to wait for both queries to complete
    Promise.all(fetchProfilesPromises)
      .then((results) => {
        const combinedProfiles = results.flatMap((res) =>
          res.data.amicusProfiles.map((profile: { id: string; name: string; image: string }) => ({
            id: profile.id,
            name: profile.name,
            image: profile.image,
          })),
        );

        setProfiles(combinedProfiles);
      })
      .catch((err) => {
        console.log('Error fetching data: ', err);
      });
  }, []);

  return (
    <AmicusProfileContext.Provider
      value={{
        connectedProfile: data as `0x${string}`,
        allProfiles: profiles,
      }}
    >
      {children}
    </AmicusProfileContext.Provider>
  );
};
