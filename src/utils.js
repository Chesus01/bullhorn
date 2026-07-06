import { ANSEM_TOKEN_MINT } from './config'

export function shortWallet(addr) {
  if (!addr) return '—'
  return addr.length > 12 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr
}

export function solscanUrl(addr) {
  return `https://solscan.io/account/${addr}`
}

export function solscanTxUrl(sig) {
  return `https://solscan.io/tx/${sig}`
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
  // Points at the generated share-card page (see scripts/generate-share-cards.mjs)
  // instead of the raw #/story/ hash URL, so X actually renders a card with
  // this story's own title/description instead of the generic site card.
  const url = `${window.location.origin}/s/${story.id}.html`
  const text = `Bullhorn 🐂 — verified wallets, real stories, direct giving. No bots, no middleman, no custody.\n\n${url}\n\nWhat's your story?`
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

// Verifies a pasted transaction signature actually paid the story's wallet,
// by reading balance deltas straight from the public Solana ledger — never
// trusts a pasted number, only what the chain confirms. Checks both a native
// SOL transfer and a direct $ANSEM (SPL token) transfer, since community
// members might give in either.
export async function verifyReceivedOnChain(connection, signature, walletAddress) {
  let tx
  try {
    tx = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 0 })
  } catch {
    return { ok: false, reason: 'Could not reach the Solana network. Try again in a moment.' }
  }
  if (!tx) {
    return { ok: false, reason: "Transaction not found on-chain yet — it may still be confirming. Try again shortly." }
  }
  if (tx.meta?.err) {
    return { ok: false, reason: 'That transaction failed on-chain.' }
  }

  const keys = tx.transaction.message.getAccountKeys().staticAccountKeys
  const idx = keys.findIndex((k) => k.toBase58() === walletAddress)

  if (idx !== -1) {
    const pre = tx.meta?.preBalances?.[idx]
    const post = tx.meta?.postBalances?.[idx]
    if (pre != null && post != null && post - pre > 0) {
      return { ok: true, amount: (post - pre) / 1e9, token: 'SOL' }
    }
  }

  if (ANSEM_TOKEN_MINT) {
    const preAmount = (tx.meta?.preTokenBalances || [])
      .find((b) => b.mint === ANSEM_TOKEN_MINT && b.owner === walletAddress)?.uiTokenAmount?.uiAmount || 0
    const postAmount = (tx.meta?.postTokenBalances || [])
      .find((b) => b.mint === ANSEM_TOKEN_MINT && b.owner === walletAddress)?.uiTokenAmount?.uiAmount || 0
    if (postAmount - preAmount > 0) {
      return { ok: true, amount: postAmount - preAmount, token: 'ANSEM' }
    }
  }

  const involvesWallet =
    idx !== -1 || (tx.meta?.postTokenBalances || []).some((b) => b.owner === walletAddress)
  if (!involvesWallet) {
    return { ok: false, reason: "This transaction doesn't involve this story's wallet." }
  }

  return { ok: false, reason: "This wallet didn't receive SOL or $ANSEM in that transaction." }
}
