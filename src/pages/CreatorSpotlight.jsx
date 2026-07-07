import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CREATED_OPTIONS } from '../data/mockData'
import { spotlightScore, shortWallet, copyText, shareOnXUrl } from '../utils'
import FilterMenu from '../components/FilterMenu'
import { BadgeRow } from '../components/Badge'
import { SceneBackdrop } from '../components/BullArt'
import { TokenText } from '../components/TokenText'
import DisclaimerBox from '../components/DisclaimerBox'
import Avatar from '../components/Avatar'
import { usePageTitle } from '../hooks/usePageTitle'

const CONTENT_TYPES = CREATED_OPTIONS.filter((c) => c !== 'None yet')
const TABS = ['All', ...CONTENT_TYPES]

function SpotlightCard({ story, rank }) {
  const { toast, inGivingList, addToGivingList, removeFromGivingList } = useApp()
  const listed = inGivingList(story.id)
  const madeThings = story.createdAnything.filter((c) => c !== 'None yet')

  const handleCopy = async () => {
    const ok = await copyText(story.walletAddress)
    toast(ok ? `Wallet copied: ${shortWallet(story.walletAddress)}` : 'Copy failed', ok ? 'success' : 'error')
  }
  const handleList = () => {
    if (listed) { removeFromGivingList(story.id); toast('Removed from Giving List') }
    else { addToGivingList(story.id); toast('Added to Giving List 🎁') }
  }

  return (
    <article className="card card-hover story-card">
      <div className="story-card-top">
        <span className="spotlight-rank">#{rank}</span>
        <span className="category-tag"><TokenText>{story.category}</TokenText></span>
      </div>
      <div className="story-card-identity">
        <Avatar url={story.avatarUrl} label={story.alias || story.xHandle} />
        <h3><Link to={`/story/${story.id}`}><TokenText>{story.title}</TokenText></Link></h3>
      </div>

      <div className="story-meta">
        <span>{story.alias}</span>
        {story.xHandle && <span className="green">{story.xHandle}</span>}
        <span className="vouch-chip">🤝 {story.vouchCount}</span>
      </div>

      {madeThings.length > 0 && (
        <p className="small muted">
          <b style={{ color: 'var(--text)' }}>Made for the community:</b> {madeThings.join(', ')}
        </p>
      )}

      <BadgeRow badges={story.badges} max={4} />

      <div className="story-actions">
        {story.walletAddress && (
          <>
            <button className="btn btn-outline btn-sm" onClick={handleCopy}>📋 Copy Wallet</button>
            <button className={`btn btn-sm ${listed ? 'btn-green' : 'btn-outline'}`} onClick={handleList}>
              {listed ? '✓ On Giving List' : '🎁 Add to Giving List'}
            </button>
          </>
        )}
        <Link to={`/story/${story.id}`} className="btn btn-primary btn-sm">View Story</Link>
        <a className="btn btn-ghost btn-sm" href={shareOnXUrl(story)} target="_blank" rel="noreferrer">
          𝕏 Share
        </a>
      </div>
    </article>
  )
}

export default function CreatorSpotlight() {
  usePageTitle('Creator Spotlight')
  const { stories } = useApp()
  const [type, setType] = useState('All')

  const ranked = useMemo(() => {
    let list = stories.filter(
      (s) => s.status === 'approved' && s.createdAnything.some((c) => c !== 'None yet')
    )
    if (type !== 'All') {
      list = list.filter((s) => s.createdAnything.includes(type))
    }
    return [...list].sort((a, b) => spotlightScore(b) - spotlightScore(a))
  }, [stories, type])

  return (
    <div className="container">
      <SceneBackdrop src="/scene-supporters.jpg" side="left" opacity={0.3} />
      <div className="page-head">
        <h1>Creator & builder <span className="green">spotlight</span>.</h1>
        <p>
          Real content people have made for the Black Bull / <TokenText>$ANSEM</TokenText> community —
          videos, tools, dashboards, threads, memes, and more. Ranked by community vouches and
          review signals, not by identity or popularity contests.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 22 }}>
          <DisclaimerBox variant="gold" icon="ℹ️">
            Ranking reflects community vouches and content-quality signals from review — it is a
            discovery tool, not a judgment of who deserves support.
          </DisclaimerBox>
        </div>

        <div style={{ marginBottom: 26 }}>
          <FilterMenu tabs={TABS} active={type} onChange={setType} label="Content type" />
        </div>

        {ranked.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎨</div>
            <p><b>No creator content in this category yet.</b></p>
            <p className="small">Check back soon, or browse all stories.</p>
          </div>
        ) : (
          <div className="grid-3">
            {ranked.map((s, i) => (
              <SpotlightCard key={s.id} story={s} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
