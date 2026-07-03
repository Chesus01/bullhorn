export default function DisclaimerBox({ variant = 'gold', icon = '🛡️', title, children }) {
  return (
    <div className={`notice ${variant}`}>
      <span style={{ fontSize: '1.2rem', lineHeight: 1.4 }} aria-hidden>{icon}</span>
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 4 }}>{title}</strong>}
        {children}
      </div>
    </div>
  )
}

export function GlobalDisclaimer() {
  return (
    <DisclaimerBox variant="gold" icon="ℹ️" title="Community-built. Not official.">
      Bullhorn is a community-built platform and is not officially affiliated with
      Ansem, Black Bull, Pump.fun, or any token team unless explicitly stated. This is not an
      airdrop, a claim page, or a rewards-eligibility tool — submitting a story does not guarantee
      rewards, donations, visibility, or support. Never share private keys,
      seed phrases, medical records, IDs, or sensitive personal documents publicly. Donations are
      direct wallet-to-wallet transfers and are irreversible. By uploading links or media, you
      grant Bullhorn permission to use them as promotional material for future
      activations and partnerships, including partner advertising.
    </DisclaimerBox>
  )
}
