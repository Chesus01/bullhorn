import { TRUST_BADGE_STYLES } from '../data/mockData'

const BADGE_ICONS = {
  'Wallet Verified': '✓',
  'X Verified': '𝕏',
  '$ANSEM Holder': '🐂',
  '$ANSEM Holder Verified': '🐂',
  Creator: '🎨',
  Builder: '🛠',
  'Community Vouched': '🤝',
  Featured: '★',
  'Needs Review': '⚠',
  'Received Support': '💛',
  'New Wallet': '🕐',
  'Duplicate Risk': '⚠',
  'Verified Supporter': '✓',
  'Whale / Holder': '🐋',
  'Anonymous Donor': '🎭',
}

export default function Badge({ label }) {
  const cls = TRUST_BADGE_STYLES[label] || ''
  const icon = BADGE_ICONS[label]
  return (
    <span className={`badge ${cls}`}>
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </span>
  )
}

export function BadgeRow({ badges, max }) {
  const list = max ? badges.slice(0, max) : badges
  return (
    <div className="badge-row">
      {list.map((b) => (
        <Badge key={b} label={b} />
      ))}
      {max && badges.length > max && <span className="badge">+{badges.length - max}</span>}
    </div>
  )
}

export function StatusPill({ status }) {
  const labels = {
    approved: 'Approved',
    pending: 'Pending',
    featured: 'Featured',
    hidden: 'Hidden',
    needs_review: 'Needs Review',
  }
  return <span className={`status-pill status-${status}`}>{labels[status] || status}</span>
}

export function RiskBadge({ value, label }) {
  const color = value >= 60 ? 'var(--danger)' : value >= 30 ? 'var(--amber)' : 'var(--green)'
  return (
    <div className="risk-meter" title={`${label}: ${value}/100`}>
      <span className="small muted">{label}: <b style={{ color }}>{value}</b></span>
      <div className="bar">
        <div style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}
