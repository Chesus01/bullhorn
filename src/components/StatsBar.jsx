import { useApp } from '../context/AppContext'

function formatAmount(n) {
  if (n <= 0) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n % 1 === 0 ? String(n) : n.toFixed(2)
}

// Glanceable proof strip on the homepage — every number here is real data
// already collected elsewhere on the site (stories, the on-chain giving
// ledger, and the community map), just surfaced in one place.
export default function StatsBar() {
  const { stories, confirmations } = useApp()
  const approved = stories.filter((s) => s.status === 'approved')

  const totalStories = approved.length
  const totalSol = confirmations.filter((c) => c.token === 'SOL').reduce((sum, c) => sum + c.amount, 0)
  const totalAnsem = confirmations.filter((c) => c.token === 'ANSEM').reduce((sum, c) => sum + c.amount, 0)
  const holders = approved.filter((s) => s.ansemHolder).length
  const countries = new Set(approved.filter((s) => s.country).map((s) => s.country)).size

  const stats = [
    { key: 'stories', value: totalStories, label: totalStories === 1 ? 'Story shared' : 'Stories shared' },
    { key: 'sol', value: `${formatAmount(totalSol)} SOL`, label: 'Confirmed on-chain' },
    { key: 'ansem', value: `${formatAmount(totalAnsem)} $ANSEM`, label: 'Confirmed on-chain' },
    { key: 'holders', value: holders, label: '$ANSEM holders verified' },
    { key: 'countries', value: countries, label: countries === 1 ? 'Country represented' : 'Countries represented' },
  ]

  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="card card-glow stats-bar">
          {stats.map((s) => (
            <div key={s.key} className="stats-bar-item">
              <div className="stats-bar-value">{s.value}</div>
              <div className="stats-bar-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
