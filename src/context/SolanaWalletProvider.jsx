import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { clusterApiUrl } from '@solana/web3.js'

// Read-only by design: this only ever connects and requests a message
// signature. No transaction is ever built or sent from this provider.
export default function SolanaWalletProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])
  // Phantom + Solflare explicit adapters; Backpack, Magic Eden, and other
  // Wallet Standard wallets are auto-detected by wallet-adapter-react.
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
