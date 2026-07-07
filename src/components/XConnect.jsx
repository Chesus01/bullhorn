import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Badge from './Badge'

const STORAGE_KEY = 'bullhorn_form_snapshot'

// Real X (Twitter) OAuth via Supabase Auth (provider 'x', the newer OAuth 2.0
// integration, PKCE flow — see supabaseClient.js for why). This redirects the
// whole page to X and back, so the caller's in-progress form is snapshotted
// first and restored after the round trip.
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

// Shared session state. Uses onAuthStateChange (not just a one-time
// getSession() check) because the session often isn't finished being
// established the instant we land back from X's redirect — the auth-state
// event is what reliably fires once it's actually ready.
export function useXSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const meta = session?.user?.user_metadata
  const userName = meta?.user_name || meta?.preferred_username
  const handle = userName ? `@${userName}` : null
  const avatarUrl = meta?.avatar_url || meta?.picture || null

  return { handle, avatarUrl, loading, connected: !!handle }
}

export function connectX() {
  return supabase.auth.signInWithOAuth({
    provider: 'x',
    options: { redirectTo: window.location.href },
  })
}

export function disconnectX() {
  return supabase.auth.signOut()
}

// Compact version for the navbar (top-right, every page) — same real OAuth
// session, just no form to snapshot/restore. Lets people connect X once from
// anywhere on the site; forms pick up the same verified session automatically.
export function XNavButton() {
  const { handle, loading } = useXSession()
  if (loading) return null

  return handle ? (
    <div className="badge-row" style={{ alignItems: 'center', gap: 10 }}>
      <span className="giving-list-pill" title="X account verified">
        𝕏 {handle}
      </span>
      <button type="button" className="btn btn-ghost btn-sm" onClick={disconnectX}>
        Disconnect
      </button>
    </div>
  ) : (
    <button type="button" className="btn btn-outline btn-sm" onClick={connectX}>
      𝕏 Connect X
    </button>
  )
}

export default function XConnect({ onVerified, formSnapshot, page }) {
  const { handle, avatarUrl, loading, connected } = useXSession()
  const [error, setError] = useState('')

  useEffect(() => {
    if (connected) onVerified?.(handle, avatarUrl)
  }, [connected]) // eslint-disable-line react-hooks/exhaustive-deps

  const connect = async () => {
    setError('')
    saveFormSnapshot(page, formSnapshot)
    const { error: err } = await connectX()
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

      {loading ? null : connected ? (
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
