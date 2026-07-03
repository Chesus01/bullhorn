import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { shortWallet, solscanUrl, copyText, shareOnXUrl } from '../utils'
import { BadgeRow } from './Badge'
import { TokenText } from './TokenText'

export default function StoryCard({ story, compact = false }) {
  const { toast, inGivingList, addToGivingList, removeFromGivingList } = useApp()
  const listed = inGivingList(story.id)

  const handleCopy = async () => {
    const ok = await copyText(story.walletAddress)
    toast(ok ? `Wallet copied: ${shortWallet(story.walletAddress)}` : 'Copy failed', ok ? 'success' : 'error')
  }

  const handleList = () => {
    if (listed) {
      removeFromGivingList(story.id)
      toast('Removed from Giving List')
    } else {
      addToGivingList(story.id)
      toast('Added to Giving List 🎁')
    }
  }

  const handleReport = () => toast('Report submitted. Our review team will take a look.', 'error')

  return (
    <article className="card card-hover story-card">
      <div className="story-card-top">
        <h3>
          <Link to={`/story/${story.id}`}><TokenText>{story.title}</TokenText></Link>
        </h3>
        <span className="category-tag"><TokenText>{story.category}</TokenText></span>
      </div>

      <p className="story-preview"><TokenText>{story.story}</TokenText></p>

      <div className="story-meta">
        <span>{story.alias}</span>
        {story.xHandle && <span className="green">{story.xHandle}</span>}
        <span className="wallet-chip">{shortWallet(story.walletAddress)}</span>
        <span className="vouch-chip">🤝 {story.vouchCount}</span>
        {story.receivedSupport && <span style={{ color: 'var(--green)' }}>💛 Supported</span>}
      </div>

      <BadgeRow badges={story.badges} max={compact ? 3 : 5} />

      <div className="story-actions">
        <button className="btn btn-outline btn-sm" onClick={handleCopy}>
          📋 Copy Wallet
        </button>
        {!compact && (
          <a className="btn btn-ghost btn-sm" href={solscanUrl(story.walletAddress)} target="_blank" rel="noreferrer">
            ↗ Solscan
          </a>
        )}
        <button className={`btn btn-sm ${listed ? 'btn-green' : 'btn-outline'}`} onClick={handleList}>
          {listed ? '✓ On Giving List' : '🎁 Add to Giving List'}
        </button>
        <Link to={`/story/${story.id}`} className="btn btn-primary btn-sm">
          View Story
        </Link>
        <a
          className="btn btn-ghost btn-sm"
          href={shareOnXUrl(story)}
          target="_blank"
          rel="noreferrer"
          title="Share this story on X"
        >
          𝕏 Share
        </a>
        {!compact && (
          <button className="btn btn-ghost btn-sm" onClick={handleReport} title="Report this story">
            ⚑ Report
          </button>
        )}
      </div>
    </article>
  )
}
