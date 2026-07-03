import { useEffect, useState } from 'react'
import { ANSEM_TOKEN_MINT } from '../config'

function formatPrice(p) {
  if (p == null || Number.isNaN(p)) return '—'
  if (p >= 1) return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${Number(p).toPrecision(3).replace(/\.?0+$/, '')}`
}

function Change({ value }) {
  if (value == null || Number.isNaN(value)) return null
  const up = value >= 0
  return (
    <span className={up ? 'up' : 'down'}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export default function PriceTicker() {
  const [sol, setSol] = useState(null)
  const [ansem, setAnsem] = useState(null)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true'
        )
        const j = await res.json()
        if (alive && j?.solana?.usd != null) {
          setSol({ price: j.solana.usd, change: j.solana.usd_24h_change })
        }
      } catch { /* keep last known price */ }

      try {
        const url = ANSEM_TOKEN_MINT
          ? `https://api.dexscreener.com/latest/dex/tokens/${ANSEM_TOKEN_MINT}`
          : 'https://api.dexscreener.com/latest/dex/search?q=ANSEM'
        const res = await fetch(url)
        const j = await res.json()
        const pairs = (j?.pairs || []).filter(
          (p) =>
            p.chainId === 'solana' &&
            (ANSEM_TOKEN_MINT || p.baseToken?.symbol?.toUpperCase() === 'ANSEM')
        )
        pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
        const top = pairs[0]
        if (alive && top?.priceUsd != null) {
          setAnsem({ price: Number(top.priceUsd), change: top.priceChange?.h24 })
        }
      } catch { /* keep last known price */ }
    }

    load()
    const t = setInterval(load, 60_000)
    return () => { alive = false; clearInterval(t) }
  }, [])

  return (
    <div className="price-ticker" role="status" aria-label="Token prices">
      <span className="pair">
        <span className="ansem-token">$ANSEM</span>
        <b>{formatPrice(ansem?.price)}</b>
        <Change value={ansem?.change} />
      </span>
      <span className="tick-sep" aria-hidden>·</span>
      <span className="pair">
        <span className="ansem-token" style={{ color: 'var(--aqua)', textShadow: 'none' }}>$SOL</span>
        <b>{formatPrice(sol?.price)}</b>
        <Change value={sol?.change} />
      </span>
    </div>
  )
}
