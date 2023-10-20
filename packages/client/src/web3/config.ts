import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [polygonMumbai, goerli],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const validChains = chains.map((c) => c.id) as number[];

const { connectors } = getDefaultWallets({
  appName: "Amicus",
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

// Map normal chain IDs to wormhole chain IDs
// Ethereum/Goerli = 2
// Polygon/Mumbai = 5
const chainIdToWormholeIdMapping = {
  5: 2,
  80001: 5,
};

const wormholeIdToChainIdMapping = {
  2: 5,
  5: 80001,
};

export {
  chains,
  validChains,
  contracts,
  wagmiConfig,
  chainIdToWormholeIdMapping,
  wormholeIdToChainIdMapping,
};
