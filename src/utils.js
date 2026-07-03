export function shortWallet(addr) {
  if (!addr) return '—'
  return addr.length > 12 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr
}

export function solscanUrl(addr) {
  return `https://solscan.io/account/${addr}`
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers / non-secure contexts
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(ta)
    }
  }
}

function csvField(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function storiesToCSV(stories) {
  const header = 'wallet_address,story_title,category,x_handle,trust_badges,received_support'
  const rows = stories.map((s) =>
    [
      s.walletAddress,
      s.title,
      s.category,
      s.xHandle || '',
      (s.badges || []).join('|'),
      s.receivedSupport ? 'yes' : 'no',
    ]
      .map(csvField)
      .join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadTextFile(text, filename = 'black-bull-wallets.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadCSV(csv, filename = 'black-bull-giving-list.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Loose Solana address shape check (base58, 32–44 chars). Real validation in Phase 3.
export function looksLikeSolanaAddress(addr) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test((addr || '').trim())
}

// Share a story to the X timeline via the web intent — no login or API needed.
export function shareOnXUrl(story) {
  const url = `${window.location.origin}${window.location.pathname}#/story/${story.id}`
  const text = `Real story from the Black Bull community 🐂\n\n"${story.title}"\n\nVerify the wallet and give directly — no middleman:\n${url}`
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`
}

// Ranks creator/builder submissions for the Spotlight page. Combines community
// signals (vouches, quality/vouch scores from admin review) with a small bonus
// for staff-featured stories. This ranks content visibility only — it never
// judges hardship or who "deserves" support (that language is banned sitewide).
export function spotlightScore(story) {
  return (
    story.vouchCount * 3 +
    (story.storyQualitySignal || 0) +
    (story.communityVouchSignal || 0) +
    (story.featured ? 20 : 0)
  )
}

export const VERIFICATION_MESSAGE =
  'I am verifying ownership of this wallet for Bullhorn. This does not authorize any transaction or token movement.'
