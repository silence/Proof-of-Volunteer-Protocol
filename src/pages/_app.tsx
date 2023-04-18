import { createContext, useEffect, useState } from 'react';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { GlobalState } from '@/types/global';
import { GlobalStateContext, SetGlobalStateContext } from '@/hooks/globalContext';

const GLOBAL_STATE_KEY = 'GLOBAL_STATE_KEY';

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [polygon, polygonMumbai];

const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    version: '1',
    appName: 'web3Modal',
    chains,
    projectId
  }),
  provider
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> component
export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const [globalState, setGlobalState] = useState<GlobalState>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(GLOBAL_STATE_KEY) || '');
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(globalState));
  }, [globalState]);

  return (
    <GlobalStateContext.Provider value={globalState}>
      <SetGlobalStateContext.Provider value={setGlobalState}>
        {ready && (
          <WagmiConfig client={wagmiClient}>
            <Component {...pageProps} />
          </WagmiConfig>
        )}

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </SetGlobalStateContext.Provider>
    </GlobalStateContext.Provider>
  );
}
