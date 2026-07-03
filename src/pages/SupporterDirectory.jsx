import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SupporterCard from '../components/SupporterCard'
import { BullBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

export default function SupporterDirectory() {
  usePageTitle('Supporter Directory')
  const { supporters } = useApp()
  const listed = supporters.filter((s) => s.publicListing)

  return (
    <div className="container">
      <BullBackdrop side="right" opacity={0.1} size={440} />
      <div className="page-head">
        <h1>Supporter <span className="green">Directory</span>.</h1>
        <p>
          Creators, founders, whales, projects, and community members who have stepped up to give
          back. Wallet balances are never shown, and wallet addresses stay private unless a
          supporter chooses otherwise.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div className="stat-row" style={{ marginBottom: 30 }}>
          <div className="stat">
            <b>{listed.length}</b>
            <span>public supporters</span>
          </div>
          <div className="stat">
            <b>{listed.reduce((sum, s) => sum + (s.storiesSupported || 0), 0)}</b>
            <span>stories supported</span>
          </div>
          <div className="stat">
            <b>{listed.filter((s) => s.anonymous).length}</b>
            <span>giving anonymously</span>
          </div>
        </div>

        <div className="grid-3">
          {listed.map((s) => (
            <SupporterCard key={s.id} supporter={s} />
          ))}
        </div>

        <div className="final-cta" style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: '1.35rem' }}>Want to be on this wall?</h2>
          <p className="muted" style={{ maxWidth: '32rem', margin: '10px auto 22px' }}>
            Join as a supporter — publicly or anonymously — and help real people get discovered.
          </p>
          <Link to="/become-supporter" className="btn btn-primary">Become a Supporter</Link>
        </div>
      </div>
    </div>
  )
}
