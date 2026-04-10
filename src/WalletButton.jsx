import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEnsName, useBalance, useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Truncate 0x1234…abcd
function truncate(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// Format ETH balance to 4 decimal places
function fmtEth(val) {
  if (!val) return '—';
  return `${Number(val.formatted).toFixed(4)} ETH`;
}

export default function WalletButton() {
  const { address, isConnected } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: isConnected && !!address },
  });

  const { data: balance } = useBalance({
    address,
    chainId: mainnet.id,
    query: { enabled: isConnected && !!address },
  });

  // RainbowKit's ConnectButton.Custom lets us render our own button
  // while keeping all the modal/connection logic from RainbowKit.
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="text-sm font-bold px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.35)',
                  color: '#FFD700',
                  fontFamily: "'Space Grotesk',sans-serif",
                  whiteSpace: 'nowrap',
                }}
              >
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                className="text-sm font-bold px-4 py-2 rounded-lg"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  color: '#f87171',
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Chain pill */}
                <button
                  onClick={openChainModal}
                  className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#888',
                  }}
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img src={chain.iconUrl} alt={chain.name} className="w-3.5 h-3.5 rounded-full" />
                  )}
                  {chain.name}
                </button>

                {/* Account pill */}
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(255,215,0,0.1)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    color: '#FFD700',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                >
                  {/* Avatar dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#FFD700', boxShadow: '0 0 6px #FFD700' }}
                  />
                  <span className="font-semibold">
                    {ensName || truncate(account.address)}
                  </span>
                  {balance && (
                    <span
                      className="text-xs hidden sm:block"
                      style={{ color: '#C0A060', borderLeft: '1px solid rgba(255,215,0,0.2)', paddingLeft: 8 }}
                    >
                      {fmtEth(balance)}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
