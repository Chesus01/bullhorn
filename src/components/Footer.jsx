import { Link } from 'react-router-dom'
import { BullImage } from './BullArt'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-logo" style={{ marginBottom: 12 }}>
              <BullImage height={40} />
              <span className="logo-text">
                <span className="l1">Bull</span>
                <span className="l2">Horn</span>
              </span>
            </div>
            <p className="muted small" style={{ maxWidth: '26rem' }}>
              Real stories. Real wallets. Real people.
              <br />
              Community-built. Not official.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/guide">How It Works</Link>
              <Link to="/stories">Stories</Link>
              <Link to="/submit">Submit</Link>
              <Link to="/give-back">Give Back</Link>
              <Link to="/supporters">Supporters</Link>
              <Link to="/about">Disclaimer</Link>
            </div>
          </div>
          <div>
            <h4>Safety</h4>
            <p className="muted small">
              Never share seed phrases or private keys. This site never asks you to approve
              transactions, delegate authority, or send funds. All giving happens directly
              wallet-to-wallet, outside this platform.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            Bullhorn is a community-built platform and is not officially affiliated with
            Ansem, Black Bull, Pump.fun, or any token team.
          </span>
          <span>Built for discovery, not custody.</span>
        </div>
      </div>
    </footer>
  )
}
