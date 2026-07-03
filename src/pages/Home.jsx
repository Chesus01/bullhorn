import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StoryCard from '../components/StoryCard'
import { BadgeRow } from '../components/Badge'
import { ChartLines } from '../components/BullArt'
import { Ansem, TokenText } from '../components/TokenText'
import { usePageTitle } from '../hooks/usePageTitle'
import { shortWallet, copyText } from '../utils'

function HeroPreviewCard() {
  const { stories, toast, addToGivingList, inGivingList } = useApp()
  const featured = stories.find((s) => s.featured && s.status === 'approved') || stories[0]

  if (!featured) {
    return (
      <div className="card card-elevated card-glow story-card">
        <span className="eyebrow" style={{ marginBottom: 4, alignSelf: 'flex-start' }}>🐮 Be the first</span>
        <h3>Real stories start here.</h3>
        <p className="story-preview">
          No stories yet — be the first to share yours and get discovered by the community.
        </p>
        <div className="story-actions">
          <Link to="/submit" className="btn btn-primary btn-sm">Submit Your Story</Link>
        </div>
      </div>
    )
  }

  const handleCopy = async () => {
    await copyText(featured.walletAddress)
    toast(`Wallet copied: ${shortWallet(featured.walletAddress)}`)
  }
  const handleList = () => {
    addToGivingList(featured.id)
    toast('Added to Giving List 🎁')
  }

  return (
    <div className="card card-elevated card-glow story-card">
      <span className="eyebrow" style={{ marginBottom: 4, alignSelf: 'flex-start' }}>★ Featured story</span>
      <div className="story-card-top">
        <h3><Link to={`/story/${featured.id}`}><TokenText>{featured.title}</TokenText></Link></h3>
        <span className="category-tag"><TokenText>{featured.category}</TokenText></span>
      </div>
      <p className="story-preview"><TokenText>{featured.story}</TokenText></p>
      <div className="story-meta">
        <span>{featured.alias}</span>
        <span className="green">{featured.xHandle}</span>
        <span className="wallet-chip">{shortWallet(featured.walletAddress)}</span>
      </div>
      <BadgeRow badges={['Wallet Verified', '$ANSEM Holder', 'Community Vouched']} />
      <div className="story-actions">
        <button className="btn btn-outline btn-sm" onClick={handleCopy}>📋 Copy Wallet</button>
        <button className={`btn btn-sm ${inGivingList(featured.id) ? 'btn-green' : 'btn-primary'}`} onClick={handleList}>
          {inGivingList(featured.id) ? '✓ On Giving List' : '🎁 Add to Giving List'}
        </button>
      </div>
    </div>
  )
}

const SAFETY_CARDS = [
  { icon: '🏦', text: 'We do not hold funds' },
  { icon: '💸', text: 'We do not process donations' },
  { icon: '🚫', text: 'We do not ask for token approvals' },
  { icon: '🔑', text: 'We do not ask for seed phrases' },
  { icon: '🔎', text: 'We only help supporters review stories and copy verified wallets' },
]

export default function Home() {
  usePageTitle()
  const { stories } = useApp()
  const featured = stories.filter((s) => s.featured && s.status === 'approved').slice(0, 6)
  const spotlight = stories
    .filter((s) => s.status === 'approved' && (s.badges.includes('Creator') || s.badges.includes('Builder')))
    .slice(0, 3)

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <ChartLines opacity={0.08} style={{ bottom: 0, left: '4%' }} />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Community-built for The Black Bull movement</span>
            <h1>
              Real stories.<br />
              Real wallets.<br />
              <span className="green-grad">Real people.</span>
            </h1>
            <p className="hero-sub">
              A community-powered giving board built to help supporters find genuine people,
              creators, builders, and holders worth supporting — without rewarding bots.
            </p>
            <div className="hero-ctas">
              <Link to="/submit" className="btn btn-primary">Submit Your Story</Link>
              <Link to="/stories" className="btn btn-outline">Browse Stories</Link>
            </div>
            <p className="hero-safety">
              🛡️ No claims. No guarantees. No custody.
            </p>
          </div>
          <div className="hero-card-wrap">
            <span className="hero-bull" style={{ opacity: 0.4 }}>
              <img
                src="/scene-supporters.jpg"
                alt=""
                aria-hidden="true"
                className="horn-pulse"
                style={{ height: 440, width: 340, objectFit: 'cover', objectPosition: 'center 25%', borderRadius: 20 }}
              />
            </span>
            <div className="float-slow" style={{ position: 'relative', zIndex: 1 }}>
              <HeroPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why this exists ===== */}
      <section className="section">
        <div className="container">
          <div className="card card-elevated" style={{ padding: '36px 28px' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h2>Bots are loud. <span className="green">Real people</span> need a better signal.</h2>
              <p style={{ marginTop: 12 }}>
                Ansem's giving showed what happens when crypto becomes human again. But one person
                should not have to filter thousands of replies, bots, fake stories, and copy-paste
                comments alone. Bullhorn gives real people a cleaner place to share their
                story, verify a wallet, and be discovered by the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>How it works</h2>
            <p>Three steps. No custody, no claims, no middleman.</p>
          </div>
          <div className="grid-3">
            <div className="card card-hover">
              <div className="step-num">1</div>
              <h3 style={{ marginBottom: 8, fontSize: '1.05rem' }}>Verify a Solana wallet</h3>
              <p className="muted small">
                Connect or submit a Solana wallet and prove ownership with a read-only signature.
              </p>
            </div>
            <div className="card card-hover">
              <div className="step-num">2</div>
              <h3 style={{ marginBottom: 8, fontSize: '1.05rem' }}>Share a real story</h3>
              <p className="muted small">
                Tell the community who you are, what you are building, what you need, or how you
                have shown up.
              </p>
            </div>
            <div className="card card-hover">
              <div className="step-num">3</div>
              <h3 style={{ marginBottom: 8, fontSize: '1.05rem' }}>Get discovered and supported</h3>
              <p className="muted small">
                Supporters can review stories, copy wallets, create giving lists, and give
                manually from their own wallet.
              </p>
            </div>
          </div>
          <div className="center" style={{ marginTop: 28 }}>
            <Link to="/guide" className="btn btn-outline">Read the full guide</Link>
          </div>
        </div>
      </section>

      {/* ===== Not just Ansem ===== */}
      <section className="section">
        <div className="container">
          <div className="final-cta">
            <span className="eyebrow">Not Just Ansem. All of Us.</span>
            <h2>Ansem sparked it. <span className="green">The community can carry it.</span></h2>
            <p className="muted" style={{ maxWidth: '38rem', margin: '0 auto 24px' }}>
              The Black Bull movement became bigger than one wallet. If you are a creator, founder,
              whale, project, or community member who wants to give back, you can join as a
              supporter and help real people directly.
            </p>
            <div className="hero-ctas" style={{ justifyContent: 'center' }}>
              <Link to="/become-supporter" className="btn btn-primary">Become a Supporter</Link>
              <Link to="/stories" className="btn btn-outline">Browse Verified Stories</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured stories ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Featured stories</h2>
            <p>Reviewed, wallet-verified, and vouched by the community.</p>
          </div>
          <div className="grid-3">
            {featured.map((s) => (
              <StoryCard key={s.id} story={s} compact />
            ))}
          </div>
          <div className="center" style={{ marginTop: 28 }}>
            <Link to="/stories" className="btn btn-outline">View all stories</Link>
          </div>
        </div>
      </section>

      {/* ===== Creator / Builder spotlight ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Creator & builder <span className="green">spotlight</span></h2>
            <p>
              The people making content, tools, dashboards, threads, memes, videos, and resources
              for the <Ansem /> / Black Bull community.
            </p>
          </div>
          <div className="grid-3">
            {spotlight.map((s) => (
              <div key={s.id} className="card card-hover story-card">
                <div className="icon-tile">{s.badges.includes('Builder') ? '🛠' : '🎨'}</div>
                <h3 style={{ fontSize: '1.02rem' }}><Link to={`/story/${s.id}`}>{s.title}</Link></h3>
                <div className="story-meta">
                  <span>{s.alias}</span>
                  <span className="green">{s.xHandle}</span>
                </div>
                <p className="small muted">Made for the community: {s.createdAnything.join(', ')}</p>
                <BadgeRow badges={s.badges} max={3} />
                <Link to={`/story/${s.id}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  View spotlight
                </Link>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 28 }}>
            <Link to="/spotlight" className="btn btn-outline">See full Spotlight</Link>
          </div>
        </div>
      </section>

      {/* ===== Safety promise ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <h2>Built for <span className="green">discovery</span>, not custody.</h2>
            <p>Our safety promise to everyone who uses this platform.</p>
          </div>
          <div className="grid-4" style={{ gridTemplateColumns: undefined }}>
            {SAFETY_CARDS.map((c) => (
              <div key={c.text} className="card" style={{ textAlign: 'center', padding: 18 }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{c.icon}</div>
                <p className="small" style={{ fontWeight: 600 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="section">
        <div className="container center">
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', marginBottom: 18 }}>
            Help real people rise above the noise.
          </h2>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/submit" className="btn btn-primary">Submit Your Story</Link>
            <Link to="/give-back" className="btn btn-outline">Give Back</Link>
          </div>
        </div>
      </section>
    </>
  )
}
