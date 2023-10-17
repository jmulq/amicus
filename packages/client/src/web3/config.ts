import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { goerli, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [polygonMumbai, goerli],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Amicus',
  projectId: import.meta.env.VITE_INFURA_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const contracts = {
  5: {
    factory: import.meta.env.VITE_GOERLI_FACTORY,
    registry: import.meta.env.VITE_GOERLI_REGISTRY,
    hub: import.meta.env.VITE_GOERLI_HUB,
  },
  80001: {
    factory: import.meta.env.VITE_MUMBAI_FACTORY,
    registry: import.meta.env.VITE_MUMBAI_REGISTRY,
    hub: import.meta.env.VITE_MUMBAI_HUB,
  },
};

export { chains, contracts, wagmiConfig };
