import { Link } from 'react-router-dom'

// A persistent, always-visible strip under the navbar (not buried in the
// hamburger menu) pointing brand-new-to-crypto visitors at the buy guide.
export default function BuyBanner() {
  return (
    <Link to="/how-to-buy" className="buy-banner">
      🐂 New to crypto? <span className="green">Buy $ANSEM in 3 steps →</span>
    </Link>
  )
}
