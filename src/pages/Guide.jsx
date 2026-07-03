import { Link } from 'react-router-dom'
import { BullBackdrop } from '../components/BullArt'
import DisclaimerBox from '../components/DisclaimerBox'
import { usePageTitle } from '../hooks/usePageTitle'

function GuideStep({ n, title, children }) {
  return (
    <div className="guide-step">
      <span className="guide-step-num">{n}</span>
      <div>
        <h4>{title}</h4>
        <p className="muted small">{children}</p>
      </div>
    </div>
  )
}

function GuideTrack({ icon, title, ctaTo, ctaLabel, children }) {
  return (
    <div className="card card-elevated">
      <div className="icon-tile">{icon}</div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: 16 }}>{title}</h3>
      {children}
      <Link to={ctaTo} className="btn btn-primary btn-sm" style={{ marginTop: 20, alignSelf: 'flex-start' }}>
        {ctaLabel}
      </Link>
    </div>
  )
}

export default function Guide() {
  usePageTitle('How It Works')
  return (
    <div className="container">
      <BullBackdrop side="right" opacity={0.1} size={420} />
      <div className="page-head">
        <h1>How to use <span className="green">Bullhorn</span>.</h1>
        <p>
          A quick walkthrough for sharing a story or supporting one — no jargon, no wallet
          approvals, just the basics.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div className="grid-3">
          <GuideTrack icon="📝" title="Sharing your story" ctaTo="/submit" ctaLabel="Submit Your Story">
            <GuideStep n="1" title="Connect &amp; verify your wallet">
              Read-only. It proves you own the wallet — it can never move funds or approve anything.
            </GuideStep>
            <GuideStep n="2" title="Tell your real story">
              Who you are, what you're building, or what would help. Real detail builds trust.
            </GuideStep>
            <GuideStep n="3" title="Submit for review">
              A reviewer checks it before it goes public — this keeps bots and spam off the board.
            </GuideStep>
            <GuideStep n="4" title="Get discovered">
              Once approved, supporters can vouch for you, copy your wallet, and give directly.
            </GuideStep>
          </GuideTrack>

          <GuideTrack icon="🔎" title="Finding & supporting people" ctaTo="/stories" ctaLabel="Browse Stories">
            <GuideStep n="1" title="Browse verified stories">
              Use the Filter button to narrow by category, $ANSEM holders, or newest.
            </GuideStep>
            <GuideStep n="2" title="Check the trust signals">
              Wallet verification, community vouches, and the Fraud Risk Review are all on every story.
            </GuideStep>
            <GuideStep n="3" title="Copy the wallet">
              Every story has a Copy Wallet button and a link to view it on Solscan.
            </GuideStep>
            <GuideStep n="4" title="Give from your own wallet">
              Send directly, at your own discretion. This site never touches or moves your funds.
            </GuideStep>
          </GuideTrack>

          <GuideTrack icon="🎁" title="Using your Giving List" ctaTo="/giving-list" ctaLabel="Open Giving List">
            <GuideStep n="1" title="Add stories as you browse">
              Tap "Add to Giving List" on any story card — build a shortlist as you go.
            </GuideStep>
            <GuideStep n="2" title="Open your list">
              Find it anytime via the gift icon in the top nav.
            </GuideStep>
            <GuideStep n="3" title="Copy everything at once">
              Copy all wallets as plain text, or download them as a simple wallet list.
            </GuideStep>
            <GuideStep n="4" title="Mark stories as supported">
              After you send something, mark it supported and optionally add the transaction hash.
            </GuideStep>
          </GuideTrack>
        </div>

        <div className="final-cta" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Want to give back at scale?</h2>
          <p className="muted" style={{ margin: '10px auto 22px', maxWidth: '30rem' }}>
            Influencers, whales, founders, and projects can join as public or anonymous supporters.
          </p>
          <Link to="/become-supporter" className="btn btn-gold">Become a Supporter</Link>
        </div>

        <div style={{ marginTop: 24 }}>
          <DisclaimerBox variant="safe" icon="🛡️" title="Keep it safe">
            Never share your seed phrase or private key — not with this site, not with anyone. We
            only ever ask for a public wallet address and a free signature. All giving happens
            wallet-to-wallet and is irreversible, so always double-check the address before you send.
          </DisclaimerBox>
        </div>
      </div>
    </div>
  )
}
