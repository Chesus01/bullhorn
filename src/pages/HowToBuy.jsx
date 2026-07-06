import DisclaimerBox from '../components/DisclaimerBox'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const STEPS = [
  {
    n: '1',
    title: 'Create a free Bullpen account',
    body: 'Sign up with your X account, Google, email, or a wallet if you already have one. You do not need to set up a separate crypto wallet first — Bullpen creates a secure, non-custodial wallet for you automatically, and there is no seed phrase to remember.',
  },
  {
    n: '2',
    title: 'Fund your account',
    body: 'Add money straight from a debit card or bank account. If you already hold crypto elsewhere, you can deposit SOL or USDC directly instead. Either way, funding happens entirely inside Bullpen — never on this site.',
  },
  {
    n: '3',
    title: 'Search for $ANSEM and buy',
    body: 'Use the search or trade screen, search "ANSEM," enter how much you want to spend, and confirm. That\'s it — you now hold $ANSEM in your own wallet.',
  },
]

export default function HowToBuy() {
  usePageTitle('How to Buy $ANSEM')
  return (
    <div className="container">
      <SceneBackdrop src="/scene-supporters.jpg" side="left" opacity={0.2} />
      <div className="page-head">
        <h1>Never bought a meme coin? <span className="green">Start here.</span></h1>
        <p>
          The easiest way to buy $ANSEM if you've never touched crypto before — no separate wallet
          app to install first.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24, maxWidth: 720, margin: '0 auto' }}>
        <div className="form-grid" style={{ gap: 18 }}>
          {STEPS.map((s) => (
            <div key={s.n} className="card card-elevated">
              <div className="badge-row" style={{ marginBottom: 10, alignItems: 'center' }}>
                <span className="wallet-chip" style={{ fontWeight: 800 }}>{s.n}</span>
                <h3 style={{ fontSize: '1.05rem' }}>{s.title}</h3>
              </div>
              <p className="muted small">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="final-cta" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Ready when you are.</h2>
          <p className="muted" style={{ margin: '10px auto 22px', maxWidth: '28rem' }}>
            Bullpen handles the wallet, the funding, and the trade — all in one place.
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <a href="https://bullpen.fi/@chesus" target="_blank" rel="noreferrer" className="btn btn-primary">
              Join $ANSEM ↗
            </a>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 28 }}>
          <DisclaimerBox variant="danger" icon="⚠️" title="Not financial advice">
            $ANSEM is a volatile meme coin. Only spend what you can afford to lose. Bullhorn does
            not process this purchase, hold your funds, or benefit financially from your trade —
            buying happens entirely on Bullpen's platform, outside this site.
          </DisclaimerBox>
        </div>
      </div>
    </div>
  )
}
