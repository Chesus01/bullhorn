import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useConnection } from '@solana/wallet-adapter-react'
import { useApp } from '../context/AppContext'
import { MOCK_VOUCHES } from '../data/mockData'
import { shortWallet, solscanUrl, solscanTxUrl, copyText, shareOnXUrl, verifyReceivedOnChain, looksLikeSolanaAddress } from '../utils'
import Badge, { BadgeRow } from '../components/Badge'
import { TokenText } from '../components/TokenText'
import { usePageTitle } from '../hooks/usePageTitle'
import StoryCard from '../components/StoryCard'
import DisclaimerBox from '../components/DisclaimerBox'
import TweetEmbed from '../components/TweetEmbed'
import { useXSession, connectX } from '../components/XConnect'
import { SceneBackdrop } from '../components/BullArt'
import Avatar from '../components/Avatar'

function ClaimWallet({ story }) {
  const { claimStoryWallet, toast } = useApp()
  const { handle, avatarUrl, connected, loading } = useXSession()
  const [wallet, setWallet] = useState('')
  const [saving, setSaving] = useState(false)

  if (!story.xHandle) {
    return <p className="small muted">This creator hasn't added a wallet yet — check back soon.</p>
  }
  if (loading) return null

  const storyHandle = story.xHandle.replace('@', '').toLowerCase()
  const isMatch = connected && handle?.replace('@', '').toLowerCase() === storyHandle

  const handleSave = async () => {
    if (!looksLikeSolanaAddress(wallet)) {
      toast('Enter a valid Solana wallet address.', 'error')
      return
    }
    setSaving(true)
    const { error } = await claimStoryWallet(story.id, wallet.trim(), avatarUrl)
    setSaving(false)
    if (error) toast(error.message || 'Could not save — try again.', 'error')
    else toast('Wallet added! 🎉')
  }

  if (!connected) {
    return (
      <>
        <p className="small muted" style={{ marginBottom: 12 }}>
          This creator hasn't added a wallet yet. Is this your story? Connect {story.xHandle} to verify and add it.
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={connectX}>𝕏 Connect X to Claim</button>
      </>
    )
  }

  if (!isMatch) {
    return (
      <p className="small muted">
        This creator hasn't added a wallet yet. Connected as {handle}, which doesn't match {story.xHandle}.
      </p>
    )
  }

  return (
    <>
      <p className="small muted" style={{ marginBottom: 12 }}>Verified as {handle}. Add your Solana wallet:</p>
      <input
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="Your Solana wallet address"
        style={{ width: '100%', background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: 10 }}
      />
      <button type="button" className="btn btn-green btn-sm" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Wallet'}
      </button>
    </>
  )
}

function FraudRiskCard({ story }) {
  // Public fraud-risk review — flags risk signals only. Never judges who deserves help.
  const signals = []
  if (story.fraudRisk === 'low') signals.push({ label: 'Low Review Risk', cls: 'badge-green' })
  if (story.status === 'needs_review' || story.badges.includes('Needs Review'))
    signals.push({ label: 'Needs Review', cls: 'badge-amber' })
  if (story.badges.includes('Duplicate Risk')) signals.push({ label: 'Duplicate Risk', cls: 'badge-red' })
  if (story.badges.includes('Community Vouched')) signals.push({ label: 'Community Vouched', cls: 'badge-gold' })
  if (story.walletVerified) signals.push({ label: 'Wallet Verified', cls: 'badge-green' })

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>🧾 Fraud Risk Review</h3>
      <div className="badge-row" style={{ marginBottom: 12 }}>
        {signals.map((s) => (
          <span key={s.label} className={`badge ${s.cls}`}>{s.label}</span>
        ))}
      </div>
      <p className="small muted">
        This review flags bots, duplicates, spam, and suspicious wallet patterns. It never judges
        who deserves support — that choice is always yours.
      </p>
    </div>
  )
}

export default function StoryDetail() {
  const { id } = useParams()
  const { stories, toast, updateStory, inGivingList, addToGivingList, removeFromGivingList, confirmations, addConfirmation } = useApp()
  const { connection } = useConnection()
  const [txHash, setTxHash] = useState('')
  const [verifying, setVerifying] = useState(false)
  const story = stories.find((s) => s.id === id)
  usePageTitle(story?.title)

  if (!story) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="icon">🐂</div>
          <p><b>Story not found.</b></p>
          <Link to="/stories" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Browse stories</Link>
        </div>
      </div>
    )
  }

  const vouches = MOCK_VOUCHES[story.id] || []
  const storyConfirmations = confirmations.filter((c) => c.storyId === story.id)
  const listed = inGivingList(story.id)
  const related = stories
    .filter((s) => s.id !== story.id && s.status === 'approved' && (s.category === story.category || s.badges.some((b) => story.badges.includes(b) && ['Creator', 'Builder'].includes(b))))
    .slice(0, 3)

  const handleCopy = async () => {
    await copyText(story.walletAddress)
    toast(`Wallet copied: ${shortWallet(story.walletAddress)}`)
  }

  const handleList = () => {
    if (listed) { removeFromGivingList(story.id); toast('Removed from Giving List') }
    else { addToGivingList(story.id); toast('Added to Giving List 🎁') }
  }

  const handleSupported = async () => {
    const signature = txHash.trim()
    if (!signature) {
      toast('Paste the transaction signature from your transfer first.', 'error')
      return
    }
    setVerifying(true)
    const result = await verifyReceivedOnChain(connection, signature, story.walletAddress)
    setVerifying(false)
    if (!result.ok) {
      toast(result.reason, 'error')
      return
    }
    const { error } = await addConfirmation(story.id, signature, result.amount, result.token)
    if (error) {
      toast(error.code === '23505' ? 'That transaction was already confirmed.' : 'Verified on-chain, but failed to save.', 'error')
      return
    }
    updateStory(story.id, (s) => ({
      receivedSupport: true,
      badges: s.badges.includes('Received Support') ? s.badges : [...s.badges, 'Received Support'],
      supportTransactions: [...s.supportTransactions, signature],
    }))
    setTxHash('')
    toast(`Verified on-chain: ${result.amount.toFixed(4)} ${result.token === 'ANSEM' ? '$ANSEM' : 'SOL'} received 💛`)
  }

  return (
    <div className="container">
      <SceneBackdrop src="/scene-giveback.jpg" side="right" opacity={0.2} />
      <div className="page-head">
        <div className="badge-row" style={{ marginBottom: 14 }}>
          <span className="category-tag"><TokenText>{story.category}</TokenText></span>
          {story.receivedSupport && <Badge label="Received Support" />}
        </div>
        <div className="story-card-identity">
          <Avatar url={story.avatarUrl} label={story.alias || story.xHandle} size={48} />
          <h1><TokenText>{story.title}</TokenText></h1>
        </div>
        <div className="story-meta" style={{ marginTop: 10 }}>
          <span>{story.alias}</span>
          {story.xHandle && (
            <a className="green" href={`https://x.com/${story.xHandle.replace('@', '')}`} target="_blank" rel="noreferrer">
              {story.xHandle}
            </a>
          )}
          <span className="muted small">Submitted {story.createdAt}</span>
        </div>
      </div>

      <div className="section detail-grid" style={{ paddingTop: 24 }}>
        {/* ===== Main column ===== */}
        <div className="form-grid">
          <div className="card card-elevated">
            <BadgeRow badges={story.badges} />
            <p style={{ margin: '18px 0', whiteSpace: 'pre-line' }}><TokenText>{story.story}</TokenText></p>
            {story.need && (
              <>
                <hr className="divider" style={{ margin: '14px 0' }} />
                <p className="small"><b className="green">What would help most:</b> <span className="muted"><TokenText>{story.need}</TokenText></span></p>
              </>
            )}
          </div>

          {story.featuredPostUrl && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>𝕏 Featured post</h3>
              <TweetEmbed url={story.featuredPostUrl} />
            </div>
          )}

          {story.proofLinks.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>🔗 Proof links</h3>
              <div className="footer-links">
                {story.proofLinks.map((l) => (
                  <a key={l} href={l} target="_blank" rel="noreferrer" className="green small">{l} ↗</a>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🤝 Community vouches</h3>
            {vouches.length === 0 ? (
              <p className="small muted">No vouches yet. Vouches from known community members are a strong trust signal.</p>
            ) : (
              <div className="form-grid">
                {vouches.map((v) => (
                  <div key={v.id} className="vouch-item">
                    <p className="small" style={{ marginBottom: 2 }}>“{v.message}”</p>
                    <p className="small muted">— {v.voucherAlias} <span className="green">{v.voucherXHandle}</span> · {v.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: '10px 0 14px' }}>Similar stories</h3>
              <div className="grid-3" style={{ gridTemplateColumns: '1fr' }}>
                {related.map((s) => <StoryCard key={s.id} story={s} compact />)}
              </div>
            </div>
          )}
        </div>

        {/* ===== Side column ===== */}
        <div className="form-grid">
          <div className="card card-glow">
            <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>👛 Wallet</h3>
            {story.walletAddress ? (
              <>
                <p className="wallet-chip" style={{ display: 'block', wordBreak: 'break-all', padding: '10px 12px', marginBottom: 14, fontSize: '0.8rem' }}>
                  {story.walletAddress}
                </p>
                <div className="form-grid" style={{ gap: 10 }}>
                  <button className="btn btn-primary btn-block" onClick={handleCopy}>📋 Copy Wallet</button>
                  <a className="btn btn-outline btn-block" href={solscanUrl(story.walletAddress)} target="_blank" rel="noreferrer">
                    ↗ Open in Solscan
                  </a>
                  <button className={`btn btn-block ${listed ? 'btn-green' : 'btn-outline'}`} onClick={handleList}>
                    {listed ? '✓ On Giving List' : '🎁 Add to Giving List'}
                  </button>
                  <a
                    className="btn btn-outline btn-block"
                    href={shareOnXUrl(story)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    𝕏 Share on X
                  </a>
                </div>
                <p className="small muted" style={{ marginTop: 14 }}>
                  Always verify the address before sending. Transfers are direct wallet-to-wallet and irreversible.
                </p>
              </>
            ) : (
              <ClaimWallet story={story} />
            )}
          </div>

          <FraudRiskCard story={story} />

          {story.walletAddress && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>💛 Confirm a gift</h3>
              <p className="small muted" style={{ marginBottom: 12 }}>
                Paste the transaction signature from a transfer to this wallet. We check it directly
                against the Solana chain — no self-reported amounts, no trust required.
              </p>
              <div className="form-grid" style={{ gap: 10 }}>
                <input
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Transaction signature"
                  style={{ width: '100%', background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <button className="btn btn-green btn-block" onClick={handleSupported} disabled={verifying}>
                  {verifying ? 'Verifying on-chain…' : 'Verify & Confirm'}
                </button>
              </div>

              {storyConfirmations.length > 0 && (
                <div className="form-grid" style={{ gap: 8, marginTop: 16 }}>
                  <hr className="divider" style={{ margin: '4px 0' }} />
                  <p className="small muted">✅ {storyConfirmations.length} confirmed gift{storyConfirmations.length > 1 ? 's' : ''}</p>
                  {storyConfirmations.map((c) => (
                    <a key={c.txSignature} href={solscanTxUrl(c.txSignature)} target="_blank" rel="noreferrer" className="small green">
                      {c.amount.toFixed(4)} {c.token === 'ANSEM' ? '$ANSEM' : 'SOL'} · {new Date(c.confirmedAt).toLocaleDateString()} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => toast('Report submitted. Our review team will take a look.', 'error')}
          >
            ⚑ Report this story
          </button>

          <DisclaimerBox variant="safe" icon="🛡️" title="No custody. No claims.">
            Bullhorn does not process donations or move funds. Giving happens directly
            from your own wallet, at your own discretion.
          </DisclaimerBox>
        </div>
      </div>
    </div>
  )
}
