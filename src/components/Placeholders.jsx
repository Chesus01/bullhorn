import { useState } from 'react'
import { VERIFICATION_MESSAGE, shortWallet } from '../utils'
import Badge from './Badge'
import { Ansem } from './TokenText'

export function CaptchaPlaceholder({ checked, onChange }) {
  return (
    <div className="captcha-box">
      <input
        type="checkbox"
        id="captcha"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="captcha" style={{ cursor: 'pointer' }}>
        <b>I'm not a robot</b>
        <span className="small muted" style={{ display: 'block' }}>Captcha placeholder — real captcha in Phase 3</span>
      </label>
    </div>
  )
}

// X account verification placeholder.
// Phase 3: replace with real X OAuth (backend holds the API keys, handles the
// callback, and confirms the handle). Optional trust signal — never a gate.
export function XConnectPlaceholder({ xHandle, onVerified }) {
  const [verified, setVerified] = useState(false)

  const connect = () => {
    setVerified(true)
    onVerified?.()
  }

  return (
    <div className="wallet-connect-box">
      <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>𝕏 Optional: verify your X account</h3>
      <p className="small muted" style={{ marginBottom: 14 }}>
        Connecting your X account proves you really own the handle you entered — a strong trust
        signal against impersonators and bots. Optional: you can submit without it.
      </p>
      {!verified ? (
        <button type="button" className="btn btn-outline" onClick={connect}>
          𝕏 Connect X Account <span className="small muted">(demo — live in Phase 3)</span>
        </button>
      ) : (
        <div className="badge-row" style={{ alignItems: 'center' }}>
          <Badge label="X Verified" />
          {xHandle && <span className="green small">{xHandle}</span>}
          <span className="small muted">Handle ownership will be confirmed via X when live.</span>
        </div>
      )}
    </div>
  )
}

// Read-only wallet verification placeholder.
// Phase 3: replace with Solana Wallet Adapter (Phantom, Backpack, Solflare, Magic Eden, etc.),
// signMessage() for ownership proof, and a token-account check for $ANSEM holdings.
export function WalletConnectPlaceholder({ walletAddress, onVerified }) {
  const [step, setStep] = useState('disconnected') // disconnected → connected → signed
  const demoAddress = walletAddress || 'Fk3B…demo wallet…9xQz'

  const connect = () => setStep('connected')
  const sign = () => {
    setStep('signed')
    onVerified?.()
  }

  return (
    <div className="wallet-connect-box">
      <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>🔐 Read-only wallet verification</h3>
      <p className="small muted" style={{ marginBottom: 14 }}>
        Connect your Solana wallet to prove ownership and verify whether you hold <Ansem />. This
        site cannot move your funds, request approvals, or access your seed phrase. Works with
        Phantom, Backpack, Solflare, Magic Eden Wallet, and other standard Solana wallets.
      </p>

      {step === 'disconnected' && (
        <>
          <button type="button" className="btn btn-primary" onClick={connect}>
            👛 Connect Solana Wallet <span className="small">(demo)</span>
          </button>
          <p className="small muted" style={{ marginTop: 10 }}>
            No transactions. No approvals. No custody.
          </p>
        </>
      )}

      {step === 'connected' && (
        <div className="form-grid">
          <div className="badge-row">
            <Badge label="Wallet Connected" />
            <span className="wallet-chip">{shortWallet(demoAddress)}</span>
          </div>
          <div className="notice safe small">
            <span aria-hidden>✍️</span>
            <div>
              <strong>You will be asked to sign this plain-text message:</strong>
              <br />“{VERIFICATION_MESSAGE}”
              <br />Signing is free and does not authorize any transaction.
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={sign}>
            Sign Verification Message <span className="small">(demo)</span>
          </button>
        </div>
      )}

      {step === 'signed' && (
        <div className="form-grid">
          <div className="badge-row">
            <Badge label="Wallet Connected" />
            <Badge label="Wallet Ownership Signed" />
            <Badge label="Wallet Verified" />
          </div>
          <p className="small muted">
            ✓ Ownership verified. When live, the site will now check your public token accounts —
            if the wallet holds the Black Bull / <Ansem /> token, the <b><Ansem /> Holder Verified</b>{' '}
            badge is added automatically. Holding <Ansem /> is a trust signal, not a requirement.
          </p>
        </div>
      )}
    </div>
  )
}
