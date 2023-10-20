import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import App from "./App.tsx";
import "./index.css";
import { chains, wagmiConfig } from "./web3/config.ts";
import { AmicusProfileProvider } from "./context/AmicusProfileContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <AmicusProfileProvider>
          <App />
        </AmicusProfileProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
