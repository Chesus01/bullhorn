import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Badge from './Badge'

const STORAGE_KEY = 'bullhorn_form_snapshot'

// Real X (Twitter) OAuth via Supabase Auth (provider 'x', the newer OAuth 2.0
// integration). This redirects the whole page to X and back, so the caller's
// in-progress form is snapshotted first and restored after the round trip —
// otherwise everything they'd typed would be wiped out by the reload.
export function saveFormSnapshot(page, data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ page, data }))
}

export function restoreFormSnapshot(page) {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  sessionStorage.removeItem(STORAGE_KEY)
  try {
    const parsed = JSON.parse(raw)
    return parsed.page === page ? parsed.data : null
  } catch {
    return null
  }
}

export default function XConnect({ onVerified, formSnapshot, page }) {
  const [handle, setHandle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const meta = session?.user?.user_metadata
      const userName = meta?.user_name || meta?.preferred_username
      if (userName) {
        const h = `@${userName}`
        setHandle(h)
        onVerified?.(h)
      }
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const connect = async () => {
    setError('')
    saveFormSnapshot(page, formSnapshot)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'x',
      options: { redirectTo: window.location.href },
    })
    if (err) setError(err.message)
  }

  return (
    <div className="wallet-connect-box">
      <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>𝕏 Optional: verify your X account</h3>
      <p className="small muted" style={{ marginBottom: 14 }}>
        Connecting your X account proves you really own the handle you entered — a strong trust
        signal against impersonators and bots. Optional: you can submit without it.
      </p>

      {error && (
        <div className="notice danger small" style={{ marginBottom: 12 }}>
          <span aria-hidden>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? null : handle ? (
        <div className="badge-row" style={{ alignItems: 'center' }}>
          <Badge label="X Verified" />
          <span className="green small">{handle}</span>
        </div>
      ) : (
        <button type="button" className="btn btn-outline" onClick={connect}>
          𝕏 Connect X Account
        </button>
      )}
    </div>
  )
}
