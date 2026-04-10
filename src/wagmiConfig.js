import { http, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

const alchemyKey  = import.meta.env.VITE_ALCHEMY_KEY;
const wcProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'fallback';

const walletList = [
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  injectedWallet,
];

const connectors = connectorsForWallets(
  [{ groupName: 'Recommended', wallets: walletList }],
  { appName: 'Bored Ape Gallery', projectId: wcProjectId }
);

const mainnetRpc = alchemyKey
  ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
  : 'https://ethereum.publicnode.com';

const polygonRpc = alchemyKey
  ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`
  : 'https://polygon-bor.publicnode.com';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon],
  connectors,
  transports: {
    [mainnet.id]:  http(mainnetRpc),
    [polygon.id]:  http(polygonRpc),
  },
});
