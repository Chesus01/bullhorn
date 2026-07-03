import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StoryCard from '../components/StoryCard'
import DisclaimerBox from '../components/DisclaimerBox'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const SECTIONS = [
  { key: 'featured', icon: '★', title: 'Give to a featured story', filter: (s) => s.featured },
  { key: 'creator', icon: '🎨', title: 'Give to a creator', filter: (s) => s.category === 'Creator' || s.badges.includes('Creator') },
  { key: 'builder', icon: '🛠', title: 'Give to a builder', filter: (s) => s.category === 'Builder' || s.badges.includes('Builder') },
  { key: 'hardship', icon: '🏠', title: 'Give to someone in hardship', filter: (s) => ['Hardship', 'Medical', 'Housing', 'Food', 'Family'].includes(s.category) },
  { key: 'unsupported', icon: '🕯️', title: 'Give to someone who has not received support yet', filter: (s) => !s.receivedSupport },
]

export default function GiveBack() {
  usePageTitle('Give Back')
  const { stories } = useApp()
  const approved = useMemo(() => stories.filter((s) => s.status === 'approved'), [stories])
  const [active, setActive] = useState('featured')
  const [randomStory, setRandomStory] = useState(null)

  const activeSection = SECTIONS.find((s) => s.key === active)
  const sectionStories = approved.filter(activeSection.filter)

  const pickRandom = () => {
    const verified = approved.filter((s) => s.walletVerified)
    if (verified.length) setRandomStory(verified[Math.floor(Math.random() * verified.length)])
  }

  return (
    <div className="container">
      <SceneBackdrop src="/scene-giveback.jpg" side="left" opacity={0.35} />
      <div className="page-head">
        <h1>Ansem should not have to carry <span className="green">the whole weight</span>.</h1>
        <p>
          The Black Bull movement showed what happens when one person gives back. This page lets
          the community do the same — directly, transparently, and without a middleman.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 30 }}>
          <DisclaimerBox variant="safe" icon="🛡️" title="How giving works here">
            Bullhorn does not process donations or move funds. We only help supporters
            discover real stories and copy verified wallet addresses. All transfers happen
            manually from your own wallet and are irreversible. We will never ask you to connect
            a wallet to send funds.
          </DisclaimerBox>
        </div>

        {/* Section picker */}
        <div className="filter-tabs" style={{ marginBottom: 26 }}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`filter-tab ${active === s.key ? 'active' : ''}`}
              onClick={() => setActive(s.key)}
            >
              {s.icon} {s.title.replace('Give to ', '')}
            </button>
          ))}
        </div>

        <div className="section-head" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem' }}>{activeSection.icon} {activeSection.title}</h2>
        </div>

        {sectionStories.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🕊️</div>
            <p><b>No stories in this section right now.</b></p>
            <p className="small">Check back soon, or browse all stories.</p>
          </div>
        ) : (
          <div className="grid-3">
            {sectionStories.map((s) => <StoryCard key={s.id} story={s} />)}
          </div>
        )}

        {/* Random verified story */}
        <div className="final-cta" style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: '1.35rem' }}>🎲 Give to a random verified story</h2>
          <p className="muted" style={{ maxWidth: '34rem', margin: '10px auto 22px' }}>
            Can't decide? Let chance pick a wallet-verified story. Every verified person on this
            board is real signal above the bot noise.
          </p>
          <button className="btn btn-primary" onClick={pickRandom}>
            {randomStory ? 'Pick another' : 'Pick a random verified story'}
          </button>
          {randomStory && (
            <div style={{ maxWidth: 480, margin: '26px auto 0', textAlign: 'left' }}>
              <StoryCard story={randomStory} />
            </div>
          )}
        </div>

        <div className="center" style={{ marginTop: 36 }}>
          <p className="muted small" style={{ marginBottom: 14 }}>
            Want to build a list and give to several people at once — from your own wallet?
          </p>
          <Link to="/giving-list" className="btn btn-outline">Open your Giving List</Link>
        </div>
      </div>
    </div>
  )
}
