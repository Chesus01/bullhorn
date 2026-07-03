import { useState } from 'react'
import Badge from './Badge'

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
