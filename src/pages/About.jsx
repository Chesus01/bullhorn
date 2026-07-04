import { Link } from 'react-router-dom'
import DisclaimerBox, { GlobalDisclaimer } from '../components/DisclaimerBox'
import { TokenText } from '../components/TokenText'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const DOES = [
  'Helps people share stories',
  'Verifies Solana wallet ownership',
  'Helps identify $ANSEM holders',
  'Helps supporters browse stories',
  'Helps supporters copy wallets',
  'Helps supporters build giving lists',
  'Helps admins filter spam and fraud',
]

const DOES_NOT = [
  'Does not guarantee rewards',
  'Does not custody funds',
  'Does not process donations',
  'Does not build transactions',
  'Does not send funds',
  'Does not ask for seed phrases',
  'Does not require token approvals',
  'Does not represent Ansem officially',
]

export default function About() {
  usePageTitle('About & Disclaimer')
  return (
    <div className="container">
      <SceneBackdrop src="/scene-giveback.jpg" side="right" opacity={0.25} />
      <div className="page-head">
        <h1>Built to help real people rise above <span className="green">bot noise</span>.</h1>
      </div>

      <div className="section" style={{ paddingTop: 24, maxWidth: 820, margin: '0 auto' }}>
        {/* Mission */}
        <div className="card card-elevated" style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Why this exists</h2>
          <p className="muted" style={{ marginBottom: 12 }}>
            Bullhorn exists because real people are getting buried under bot spam.
          </p>
          <p className="muted" style={{ marginBottom: 12 }}>
            Ansem's giving has shown what is possible when crypto becomes human again, but one
            person should not have to carry the full weight of helping everyone.
          </p>
          <p className="muted">
            This platform gives real people a place to share real stories connected to real
            Solana wallets, while giving the community a cleaner way to discover, vouch for, and
            support people directly.
          </p>
        </div>

        {/* Does / does not */}
        <div className="grid-2" style={{ marginBottom: 22 }}>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: 14, color: 'var(--green)' }}>✓ What the platform does</h3>
            <div className="footer-links">
              {DOES.map((d) => <span key={d} className="muted small">✓ <TokenText>{d}</TokenText></span>)}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: 14, color: 'var(--danger)' }}>✕ What the platform does not do</h3>
            <div className="footer-links">
              {DOES_NOT.map((d) => <span key={d} className="muted small">✕ {d}</span>)}
            </div>
          </div>
        </div>

        {/* Safety sections */}
        <div className="form-grid">
          <DisclaimerBox variant="safe" icon="🔐" title="Wallet safety">
            Wallet connection on this site is read-only. We use it to verify ownership with a
            plain-text signature and to read public token data — nothing more. We will never ask
            you to approve a transaction, delegate authority, approve token spending, or reveal a
            seed phrase or private key. Anyone who asks for those things is trying to steal from
            you.
          </DisclaimerBox>

          <DisclaimerBox variant="safe" icon="💛" title="Donation safety">
            All giving is direct, wallet-to-wallet, and happens entirely outside this platform.
            We do not custody funds, process payments, build transactions, or take any fee.
            Transfers on Solana are irreversible — always verify the full wallet address before
            sending anything.
          </DisclaimerBox>

          <DisclaimerBox variant="gold" icon="ℹ️" title="Not official">
            Bullhorn is a community-built platform and is not officially affiliated
            with Ansem, Black Bull, Pump.fun, or any token team unless explicitly stated. Ansem
            sparked the movement; this tool belongs to the community.
          </DisclaimerBox>

          <DisclaimerBox variant="danger" icon="⚠️" title="No guaranteed rewards">
            Submitting a story does not guarantee rewards, donations, visibility, or support.
            This is a discovery board, not a claim site, an airdrop, or a payout program. Anyone
            promising guaranteed money for a submission is not us.
          </DisclaimerBox>

          <DisclaimerBox variant="gold" icon="📣" title="Promotional use of submissions">
            By uploading links or any media to Bullhorn, you give the site permission
            to use that content as promotional material for future activations and partnerships.
            Your submission — including story excerpts, linked content, and media — may be
            featured in partner advertising. If you are not comfortable with that, do not include
            the content in your submission.
          </DisclaimerBox>

          <DisclaimerBox variant="danger" icon="🔒" title="Privacy and safety warning">
            Stories are public once approved. Never include private keys, seed phrases, medical
            records, government IDs, home addresses, or sensitive personal documents. Share only
            what you are comfortable with the entire internet seeing, forever.
          </DisclaimerBox>

          <GlobalDisclaimer />
        </div>

        <div className="final-cta" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Real stories. Real wallets. Real people.</h2>
          <p className="muted" style={{ margin: '10px auto 22px', maxWidth: '30rem' }}>
            We help you find real people. You choose how to give.
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/stories" className="btn btn-primary">Browse Stories</Link>
            <Link to="/submit" className="btn btn-outline">Submit Your Story</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
