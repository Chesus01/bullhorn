import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { ANSEM_TOKEN_MINT } from '../config'
import { VERIFICATION_MESSAGE, shortWallet } from '../utils'
import Badge from './Badge'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

// Real read-only Solana wallet connect: connect → sign a plain-text ownership
// message → optionally check public token accounts for $ANSEM. Never builds
// or sends a transaction — connect and signMessage only.
export default function SolanaWalletConnect({ onVerified, onHolderChecked }) {
  const { connection } = useConnection()
  const { wallets, wallet, select, connect, disconnect, connecting, connected, publicKey, signMessage } = useWallet()
  const [signed, setSigned] = useState(false)
  const [signing, setSigning] = useState(false)
  const [ansemHolder, setAnsemHolder] = useState(false)
  const [checkingHoldings, setCheckingHoldings] = useState(false)
  const [error, setError] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const detected = useMemo(
    () => wallets.filter((w) => w.readyState === 'Installed' || w.readyState === 'Loadable'),
    [wallets]
  )

  const handlePick = async (walletName) => {
    setError('')
    select(walletName)
    setShowPicker(false)
  }

  // Auto-connect once a wallet is selected via handlePick
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch((e) => setError(e?.message || 'Connection was cancelled.'))
    }
  }, [wallet]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSign = useCallback(async () => {
    if (!signMessage) {
      setError('This wallet does not support message signing.')
      return
    }
    setSigning(true)
    setError('')
    try {
      const encoded = new TextEncoder().encode(VERIFICATION_MESSAGE)
      await signMessage(encoded)
      setSigned(true)
      onVerified?.({ publicKey: publicKey.toBase58() })

      // Optional trust signal — read-only token account check, never a gate.
      if (ANSEM_TOKEN_MINT) {
        setCheckingHoldings(true)
        try {
          const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
          })
          const holds = accounts.value.some(
            (a) =>
              a.account.data.parsed.info.mint === ANSEM_TOKEN_MINT &&
              a.account.data.parsed.info.tokenAmount.uiAmount > 0
          )
          setAnsemHolder(holds)
          onHolderChecked?.(holds)
        } catch {
          // RPC hiccup — not fatal, just skip the holder badge
        } finally {
          setCheckingHoldings(false)
        }
      }
    } catch (e) {
      setError(e?.message || 'Signature request was rejected.')
    } finally {
      setSigning(false)
    }
  }, [signMessage, publicKey, connection, onVerified, onHolderChecked])

  const handleDisconnect = () => {
    disconnect()
    setSigned(false)
    setAnsemHolder(false)
    setShowPicker(false)
  }

  return (
    <div className="wallet-connect-box">
      <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>🔐 Read-only wallet verification</h3>
      <p className="small muted" style={{ marginBottom: 14 }}>
        Connect your Solana wallet to prove ownership and verify whether you hold $ANSEM. This
        site cannot move your funds, request approvals, or access your seed phrase. Works with
        Phantom, Solflare, Backpack, Magic Eden Wallet, and other standard Solana wallets.
      </p>
      <p className="small muted" style={{ marginBottom: 14 }}>
        Want a deeper holder verification? Check your $ANSEM standing on{' '}
        <a href="https://bullpen.fi/@chesus" target="_blank" rel="noreferrer" className="green">Bullpen ↗</a>.
      </p>

      {error && (
        <div className="notice danger small" style={{ marginBottom: 12 }}>
          <span aria-hidden>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!connected && (
        <div className="form-grid">
          {!showPicker ? (
            <button type="button" className="btn btn-primary" onClick={() => setShowPicker(true)}>
              👛 Connect Solana Wallet
            </button>
          ) : detected.length === 0 ? (
            <div className="notice amber small">
              <span aria-hidden>⚠️</span>
              <span>
                No Solana wallet extension detected. Install{' '}
                <a href="https://phantom.app" target="_blank" rel="noreferrer" className="green">Phantom</a> or{' '}
                <a href="https://solflare.com" target="_blank" rel="noreferrer" className="green">Solflare</a> and refresh.
              </span>
            </div>
          ) : (
            <div className="badge-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              {detected.map((w) => (
                <button
                  key={w.adapter.name}
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => handlePick(w.adapter.name)}
                  style={{ justifyContent: 'flex-start', gap: 10 }}
                >
                  <img src={w.adapter.icon} alt="" width={20} height={20} />
                  {w.adapter.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {connected && !signed && (
        <div className="form-grid">
          <div className="badge-row">
            <Badge label="Wallet Connected" />
            <span className="wallet-chip">{shortWallet(publicKey?.toBase58())}</span>
          </div>
          <div className="notice safe small">
            <span aria-hidden>✍️</span>
            <div>
              <strong>You will be asked to sign this plain-text message:</strong>
              <br />“{VERIFICATION_MESSAGE}”
              <br />Signing is free and does not authorize any transaction.
            </div>
          </div>
          <div className="story-actions">
            <button type="button" className="btn btn-primary" onClick={handleSign} disabled={signing}>
              {signing ? 'Waiting for signature…' : 'Sign Verification Message'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      )}

      {connected && signed && (
        <div className="form-grid">
          <div className="badge-row">
            <Badge label="Wallet Connected" />
            <Badge label="Wallet Ownership Signed" />
            <Badge label="Wallet Verified" />
            {checkingHoldings && <span className="small muted">Checking $ANSEM balance…</span>}
            {!checkingHoldings && ansemHolder && <Badge label="$ANSEM Holder Verified" />}
          </div>
          <p className="small muted">
            ✓ Ownership verified for <span className="wallet-chip">{shortWallet(publicKey?.toBase58())}</span>.{' '}
            {ansemHolder
              ? 'This wallet holds $ANSEM — trust badge applied automatically.'
              : 'Holding $ANSEM is a trust signal, not a requirement — you can submit either way.'}
          </p>
          <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
