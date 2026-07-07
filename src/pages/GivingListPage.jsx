import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { shortWallet, copyText, downloadTextFile, solscanUrl } from '../utils'
import { BadgeRow } from '../components/Badge'
import DisclaimerBox from '../components/DisclaimerBox'
import Avatar from '../components/Avatar'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

export default function GivingListPage() {
  usePageTitle('Your Giving List')
  const {
    stories, givingList, toast,
    removeFromGivingList, clearGivingList, setGivingNote,
  } = useApp()

  const items = givingList
    .map((g) => ({ ...g, story: stories.find((s) => s.id === g.storyId) }))
    .filter((g) => g.story)

  const copyAllPlain = async () => {
    const text = items.map((g) => g.story.walletAddress).join('\n')
    const ok = await copyText(text)
    toast(ok ? `Copied ${items.length} wallet address${items.length === 1 ? '' : 'es'} 📋` : 'Copy failed', ok ? 'success' : 'error')
  }

  const handleDownload = () => {
    // Wallets only, one per line — nothing else ends up in the file
    downloadTextFile(items.map((g) => g.story.walletAddress).join('\n'))
    toast('Wallet list downloaded ⬇️')
  }

  const handleClear = () => {
    clearGivingList()
    toast('Giving List cleared')
  }

  return (
    <div className="container">
      <SceneBackdrop src="/scene-browse.jpg" side="left" opacity={0.2} />
      <div className="page-head">
        <h1>Your <span className="green">Giving List</span>.</h1>
        <p>
          A temporary list of stories you may want to support. Copy the wallets, then give
          directly from your own wallet — this site never touches funds.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 26 }}>
          <DisclaimerBox variant="safe" icon="🛡️">
            Bullhorn does not process donations or move funds. We only help supporters
            discover real stories and copy verified wallet addresses. All transfers happen
            manually from your own wallet and are irreversible. Always verify addresses before sending.
          </DisclaimerBox>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎁</div>
            <p><b>Your Giving List is empty.</b></p>
            <p className="small" style={{ margin: '6px 0 18px' }}>
              Browse stories and tap “Add to Giving List” on any story you might want to support.
            </p>
            <Link to="/stories" className="btn btn-primary">Browse Stories</Link>
          </div>
        ) : (
          <div className="giving-grid">
            <div className="form-grid">
              {items.map(({ story, note }) => (
                <div key={story.id} className="card story-card">
                  <div className="story-card-top">
                    <div className="story-card-identity">
                      <Avatar url={story.avatarUrl} label={story.alias || story.xHandle} />
                      <h3><Link to={`/story/${story.id}`}>{story.title}</Link></h3>
                    </div>
                    <span className="category-tag">{story.category}</span>
                  </div>
                  <div className="story-meta">
                    {story.xHandle && <span className="green">{story.xHandle}</span>}
                    <span className="wallet-chip" title="Full wallet available via Copy">{shortWallet(story.walletAddress)}</span>
                    {story.receivedSupport && <span style={{ color: 'var(--green)' }}>💛 Supported</span>}
                  </div>
                  <BadgeRow badges={story.badges} max={4} />
                  <input
                    value={note}
                    onChange={(e) => setGivingNote(story.id, e.target.value)}
                    placeholder="Private note to yourself (e.g. amount you plan to send)…"
                    style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: '0.85rem', width: '100%' }}
                  />
                  <div className="story-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={async () => {
                        await copyText(story.walletAddress)
                        toast(`Wallet copied: ${shortWallet(story.walletAddress)}`)
                      }}
                    >
                      📋 Copy Wallet
                    </button>
                    <a className="btn btn-ghost btn-sm" href={solscanUrl(story.walletAddress)} target="_blank" rel="noreferrer">↗ Solscan</a>
                    <button className="btn btn-ghost btn-sm" onClick={() => { removeFromGivingList(story.id); toast('Removed from Giving List') }}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Wallet copy panel */}
            <div className="giving-panel">
              <div className="card card-glow">
                <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>👛 Wallet copy panel</h3>
                <p className="small muted" style={{ marginBottom: 16 }}>
                  {items.length} stor{items.length === 1 ? 'y' : 'ies'} on your list. Copy the
                  wallets, then send from your own wallet or preferred tool.
                </p>
                <div className="form-grid" style={{ gap: 10 }}>
                  <button className="btn btn-primary btn-block" onClick={copyAllPlain}>📋 Copy All Wallets</button>
                  <button className="btn btn-outline btn-block" onClick={handleDownload}>⬇️ Download Wallet List</button>
                  <button className="btn btn-danger btn-block" onClick={handleClear}>🗑 Clear List</button>
                </div>
                <p className="small muted" style={{ marginTop: 16 }}>
                  Wallet addresses only, one per line — ready to paste anywhere.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
