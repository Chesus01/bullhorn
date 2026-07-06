import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { MOCK_VOUCHES, CREATED_OPTIONS } from '../data/mockData'
import { shortWallet, solscanUrl, looksLikeXPostUrl, looksLikeSolanaAddress } from '../utils'
import { BadgeRow, StatusPill, RiskBadge } from '../components/Badge'
import FilterMenu from '../components/FilterMenu'
import DisclaimerBox from '../components/DisclaimerBox'
import { useXSession, connectX } from '../components/XConnect'
import { usePageTitle } from '../hooks/usePageTitle'

// Must match the is_site_owner() check in supabase/schema.sql — this is
// only a UX gate; the database itself is what actually enforces this.
const ADMIN_X_HANDLE = 'chesus'

const FILTERS = [
  'All', 'Pending', 'Approved', 'Featured', 'Needs Review', 'Hidden',
  'High Duplicate Risk', 'High Spam Risk', 'New Wallets', '$ANSEM Holders',
  'Creators', 'Builders', 'Hardship',
]

function riskLabel(v) {
  return v >= 60 ? 'High' : v >= 30 ? 'Medium' : 'Low'
}

// Rule-based mock of the Phase 3 AI fraud review. Flags risk signals only —
// never judges who deserves support.
function suggestedAction(story) {
  if (story.spamRisk >= 60 || story.duplicateRisk >= 60) return 'Keep in Needs Review — high spam/duplicate signals. Request proof links or vouches before approval.'
  if (!story.walletVerified) return 'Ask submitter to complete read-only wallet signature before approval.'
  if (story.humanConfidence >= 85 && story.communityVouchSignal >= 60) return 'Strong human + vouch signals. Safe to approve or feature.'
  if (story.status === 'pending') return 'Signals look clean. Approve and monitor early vouches.'
  return 'No action needed.'
}

const QUICK_ADD_INITIAL = {
  alias: '', xHandle: '', walletAddress: '', title: '', featuredPostUrl: '', created: [],
}

function QuickAddCreator() {
  const { addStory, toast } = useApp()
  const [form, setForm] = useState(QUICK_ADD_INITIAL)
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleCreated = (opt) =>
    set('created', form.created.includes(opt) ? form.created.filter((c) => c !== opt) : [...form.created, opt])

  const handleAdd = async (ev) => {
    ev.preventDefault()
    if (!form.alias.trim() || !form.title.trim()) {
      toast('Name and title are required.', 'error')
      return
    }
    if (form.walletAddress.trim() && !looksLikeSolanaAddress(form.walletAddress)) {
      toast('That wallet address doesn\'t look valid — leave it blank if you don\'t have it yet.', 'error')
      return
    }
    if (!looksLikeXPostUrl(form.featuredPostUrl)) {
      toast('Paste a link to a specific X post (e.g. x.com/handle/status/123...).', 'error')
      return
    }
    addStory({
      title: form.title.trim(),
      alias: form.alias.trim(),
      xHandle: form.xHandle.trim(),
      walletAddress: form.walletAddress.trim(),
      category: 'Creator',
      story: '',
      need: '',
      proofLinks: [],
      createdAnything: form.created.length ? form.created : ['Content'],
      country: null,
      region: null,
      featuredPostUrl: form.featuredPostUrl.trim(),
      badges: ['Wallet Submitted'],
      vouchCount: 0,
      receivedSupport: false,
      supportTransactions: [],
      featured: false,
      status: 'approved',
      fraudRisk: 'pending',
      duplicateRisk: 0,
      spamRisk: 0,
      walletFreshnessRisk: 0,
      storyQualitySignal: 0,
      communityVouchSignal: 0,
      humanConfidence: 0,
      ansemHolder: false,
      walletVerified: false,
      walletSigned: false,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
    toast('Creator added — live on Community Content')
    setForm(QUICK_ADD_INITIAL)
  }

  return (
    <div className="card card-elevated" style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 6 }}>🎬 Quick-Add Creator Content</h3>
      <p className="small muted" style={{ marginBottom: 14 }}>
        For creators who haven't submitted their own story yet. Shows up instantly on Community
        Content and the story board, with their post embedded.
      </p>
      <form className="form-grid" onSubmit={handleAdd} style={{ gap: 10 }}>
        <input value={form.alias} onChange={(e) => set('alias', e.target.value)} placeholder="Creator name / alias *" />
        <input value={form.xHandle} onChange={(e) => set('xHandle', e.target.value)} placeholder="X handle (optional)" />
        <input value={form.walletAddress} onChange={(e) => set('walletAddress', e.target.value)} placeholder="Creator's Solana wallet address (optional — add later if needed)" style={{ fontFamily: 'monospace' }} />
        <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Title for their story card *" />
        <input value={form.featuredPostUrl} onChange={(e) => set('featuredPostUrl', e.target.value)} placeholder="Link to their X post *" />
        <div className="checkbox-grid">
          {CREATED_OPTIONS.filter((c) => c !== 'None yet').map((opt) => (
            <label key={opt} className={`pill-check ${form.created.includes(opt) ? 'checked' : ''}`}>
              <input type="checkbox" checked={form.created.includes(opt)} onChange={() => toggleCreated(opt)} />
              {opt}
            </label>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>+ Add Creator</button>
      </form>
    </div>
  )
}

function ToolsManager() {
  const { tools, addTool, removeTool, toast } = useApp()
  const [form, setForm] = useState({ name: '', url: '', description: '', sharedBy: '' })
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleAdd = async (ev) => {
    ev.preventDefault()
    if (!form.name.trim() || !form.url.trim()) {
      toast('Name and link are required.', 'error')
      return
    }
    const { error } = await addTool({
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim() || null,
      sharedBy: form.sharedBy.trim() || null,
    })
    if (error) toast('Failed to save tool.', 'error')
    else {
      toast('Tool added')
      setForm({ name: '', url: '', description: '', sharedBy: '' })
    }
  }

  return (
    <div className="card card-elevated" style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 14 }}>🧰 Manage Community Tools</h3>
      <form className="form-grid" onSubmit={handleAdd} style={{ gap: 10, marginBottom: 20 }}>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Tool name *" />
        <input value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="Link (https://...) *" />
        <input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description (optional)" />
        <input value={form.sharedBy} onChange={(e) => set('sharedBy', e.target.value)} placeholder="Shared by (optional, e.g. Ansem)" />
        <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>+ Add Tool</button>
      </form>

      {tools.length === 0 ? (
        <p className="small muted">No tools listed yet.</p>
      ) : (
        <div className="form-grid" style={{ gap: 10 }}>
          {tools.map((t) => (
            <div key={t.id} className="story-meta" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span>
                <b>{t.name}</b> — <a href={t.url} target="_blank" rel="noreferrer" className="green small">{t.url}</a>
                {t.sharedBy && <span className="muted small"> · shared by {t.sharedBy}</span>}
              </span>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeTool(t.id)}>🗑 Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminDetail({ story, onAction }) {
  const [txHash, setTxHash] = useState('')
  const [featuredPostUrl, setFeaturedPostUrl] = useState(story.featuredPostUrl || '')
  const [walletAddress, setWalletAddress] = useState(story.walletAddress || '')
  const vouches = MOCK_VOUCHES[story.id] || []

  return (
    <div className="card card-elevated" style={{ marginTop: 20 }}>
      <div className="story-card-top" style={{ marginBottom: 14 }}>
        <div>
          <h3 style={{ marginBottom: 6 }}>{story.title}</h3>
          <div className="story-meta">
            <span>{story.alias}</span>
            {story.xHandle && <span className="green">{story.xHandle}</span>}
            <span className="category-tag">{story.category}</span>
            <StatusPill status={story.status} />
            {story.featured && <StatusPill status="featured" />}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="form-grid">
          <div>
            <p className="small muted" style={{ marginBottom: 6 }}><b style={{ color: 'var(--text)' }}>Full story</b></p>
            <p className="small muted" style={{ whiteSpace: 'pre-line' }}>{story.story}</p>
          </div>
          {story.need && (
            <p className="small muted"><b style={{ color: 'var(--text)' }}>What would help:</b> {story.need}</p>
          )}
          <div>
            <p className="small muted" style={{ marginBottom: 6 }}><b style={{ color: 'var(--text)' }}>Proof links</b></p>
            {story.proofLinks.length === 0 ? (
              <p className="small" style={{ color: 'var(--amber)' }}>⚠ No proof links provided</p>
            ) : (
              story.proofLinks.map((l) => (
                <a key={l} href={l} target="_blank" rel="noreferrer" className="green small" style={{ display: 'block' }}>{l} ↗</a>
              ))
            )}
          </div>
          <div>
            <p className="small muted" style={{ marginBottom: 6 }}><b style={{ color: 'var(--text)' }}>Vouches ({vouches.length})</b></p>
            {vouches.length === 0 ? (
              <p className="small muted">None yet.</p>
            ) : (
              vouches.map((v) => (
                <div key={v.id} className="vouch-item" style={{ marginBottom: 8 }}>
                  <p className="small">“{v.message}”</p>
                  <p className="small muted">— {v.voucherAlias} {v.voucherXHandle}</p>
                </div>
              ))
            )}
          </div>
          <BadgeRow badges={story.badges} />
        </div>

        <div className="form-grid">
          {/* Wallet signals (admin-only) */}
          <div className="card" style={{ background: 'var(--card)' }}>
            <p className="small" style={{ fontWeight: 700, marginBottom: 10 }}>👛 Wallet signals (admin only)</p>
            {story.walletAddress ? (
              <p className="wallet-chip small" style={{ display: 'block', wordBreak: 'break-all', marginBottom: 10 }}>{story.walletAddress}</p>
            ) : (
              <p className="small" style={{ color: 'var(--amber)', marginBottom: 10 }}>⚠ No wallet added yet</p>
            )}
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Add or update Solana wallet address…"
              style={{ width: '100%', background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.78rem', marginBottom: 8 }}
            />
            <button
              className="btn btn-outline btn-sm"
              style={{ marginBottom: 10 }}
              onClick={() => onAction('walletAddress', walletAddress.trim())}
            >
              Save Wallet Address
            </button>
            <div className="footer-links small muted">
              <span>Ownership signed: {story.walletSigned ? '✓ Yes' : '✕ No'}</span>
              <span>$ANSEM holder: {story.ansemHolder ? '✓ Yes' : '✕ No'}</span>
              <span>Wallet age estimate: {story.walletFreshnessRisk >= 60 ? '⚠ Days old (recently created)' : story.walletFreshnessRisk >= 30 ? 'Months old' : '1+ years'}</span>
              <span>Tx count / token accounts: mock data — live in Phase 3</span>
              {story.duplicateRisk >= 60 && <span style={{ color: 'var(--danger)' }}>⚠ Duplicate wallet submission pattern detected</span>}
              {story.walletFreshnessRisk >= 60 && <span style={{ color: 'var(--amber)' }}>⚠ Recently created wallet warning</span>}
            </div>
            {story.walletAddress && (
              <a className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} href={solscanUrl(story.walletAddress)} target="_blank" rel="noreferrer">↗ Open in Solscan</a>
            )}
          </div>

          {/* AI review */}
          <div className="card" style={{ background: 'var(--card)' }}>
            <p className="small" style={{ fontWeight: 700, marginBottom: 12 }}>🧾 AI Fraud Risk Review</p>
            <div className="form-grid" style={{ gap: 10 }}>
              <RiskBadge value={story.humanConfidence} label="Human Confidence Score" />
              <RiskBadge value={story.duplicateRisk} label="Duplicate Risk" />
              <RiskBadge value={story.spamRisk} label="Spam Risk" />
              <RiskBadge value={story.walletFreshnessRisk} label="Wallet Freshness Risk" />
              <RiskBadge value={story.storyQualitySignal} label="Story Quality Signal" />
              <RiskBadge value={story.communityVouchSignal} label="Community Vouch Signal" />
            </div>
            <hr className="divider" style={{ margin: '14px 0' }} />
            <p className="small"><b className="green">Suggested action:</b> <span className="muted">{suggestedAction(story)}</span></p>
            <p className="small muted" style={{ marginTop: 8 }}>
              AI flags bots, duplicates, spam, and suspicious wallet patterns. It never decides
              who deserves support.
            </p>
          </div>

          {/* Actions */}
          <div className="card" style={{ background: 'var(--card)' }}>
            <p className="small" style={{ fontWeight: 700, marginBottom: 10 }}>Actions</p>
            <div className="story-actions">
              <button className="btn btn-green btn-sm" onClick={() => onAction('approve')}>✓ Approve</button>
              <button className="btn btn-primary btn-sm" onClick={() => onAction('feature')}>★ {story.featured ? 'Unfeature' : 'Feature'}</button>
              <button className="btn btn-outline btn-sm" onClick={() => onAction('needs_review')}>⚠ Needs Review</button>
              <button className="btn btn-outline btn-sm" onClick={() => onAction('hide')}>👁 Hide</button>
              <button className="btn btn-green btn-sm" onClick={() => onAction('supported')}>💛 Mark Received Support</button>
              <button className="btn btn-danger btn-sm" onClick={() => onAction('delete')}>🗑 Delete</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <input
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Add transaction hash…"
                style={{ width: '100%', background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => { if (txHash.trim()) { onAction('txhash', txHash.trim()); setTxHash('') } }}
              >
                Attach tx hash
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <input
                value={featuredPostUrl}
                onChange={(e) => setFeaturedPostUrl(e.target.value)}
                placeholder="Featured X post URL…"
                style={{ width: '100%', background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => onAction('featuredPost', featuredPostUrl.trim())}
              >
                Save Featured Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  usePageTitle('Admin Review Dashboard')
  const { stories, updateStory, toast } = useApp()
  const { handle, connected, loading } = useXSession()
  const [filter, setFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)
  const [deleted, setDeleted] = useState([])

  const isOwner = connected && handle?.replace('@', '').toLowerCase() === ADMIN_X_HANDLE

  // All hooks must run on every render regardless of auth state — never put
  // a hook after a conditional return, or React loses track of hook order
  // the moment isOwner flips and crashes the whole tree.
  const list = useMemo(() => {
    let l = stories.filter((s) => !deleted.includes(s.id))
    switch (filter) {
      case 'Pending': l = l.filter((s) => s.status === 'pending'); break
      case 'Approved': l = l.filter((s) => s.status === 'approved'); break
      case 'Featured': l = l.filter((s) => s.featured); break
      case 'Needs Review': l = l.filter((s) => s.status === 'needs_review'); break
      case 'Hidden': l = l.filter((s) => s.status === 'hidden'); break
      case 'High Duplicate Risk': l = l.filter((s) => s.duplicateRisk >= 60); break
      case 'High Spam Risk': l = l.filter((s) => s.spamRisk >= 60); break
      case 'New Wallets': l = l.filter((s) => s.walletFreshnessRisk >= 60); break
      case '$ANSEM Holders': l = l.filter((s) => s.ansemHolder); break
      case 'Creators': l = l.filter((s) => s.category === 'Creator'); break
      case 'Builders': l = l.filter((s) => s.category === 'Builder'); break
      case 'Hardship': l = l.filter((s) => ['Hardship', 'Medical', 'Housing', 'Food', 'Family'].includes(s.category)); break
      default: break
    }
    return l
  }, [stories, filter, deleted])

  const selected = list.find((s) => s.id === selectedId) || stories.find((s) => s.id === selectedId && !deleted.includes(s.id))

  const handleAction = (action, payload) => {
    const s = selected
    if (!s) return
    switch (action) {
      case 'approve':
        updateStory(s.id, { status: 'approved' }); toast(`Approved: ${s.title}`); break
      case 'feature':
        updateStory(s.id, (st) => ({ featured: !st.featured, status: 'approved' })); toast(s.featured ? 'Removed from featured' : `Featured: ${s.title}`); break
      case 'needs_review':
        updateStory(s.id, { status: 'needs_review' }); toast('Marked as Needs Review'); break
      case 'hide':
        updateStory(s.id, { status: 'hidden', featured: false }); toast('Story hidden'); break
      case 'supported':
        updateStory(s.id, (st) => ({ receivedSupport: true, badges: st.badges.includes('Received Support') ? st.badges : [...st.badges, 'Received Support'] })); toast('Marked as Received Support 💛'); break
      case 'txhash':
        updateStory(s.id, (st) => ({ supportTransactions: [...st.supportTransactions, payload] })); toast('Transaction hash attached'); break
      case 'featuredPost':
        if (payload && !looksLikeXPostUrl(payload)) {
          toast('That doesn\'t look like a link to a specific X post.', 'error')
          break
        }
        updateStory(s.id, { featuredPostUrl: payload || null }); toast(payload ? 'Featured post saved' : 'Featured post cleared'); break
      case 'walletAddress':
        if (payload && !looksLikeSolanaAddress(payload)) {
          toast('That doesn\'t look like a valid Solana wallet address.', 'error')
          break
        }
        updateStory(s.id, { walletAddress: payload }); toast(payload ? 'Wallet address saved' : 'Wallet address cleared'); break
      case 'delete':
        setDeleted((d) => [...d, s.id]); setSelectedId(null); toast('Submission deleted', 'error'); break
      default: break
    }
  }

  if (loading) return null

  if (!isOwner) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="icon">🔒</div>
          <p><b>This dashboard is restricted to the site owner's X account.</b></p>
          {connected ? (
            <p className="small muted" style={{ marginTop: 8 }}>Connected as {handle}, which isn't authorized.</p>
          ) : (
            <>
              <p className="small muted" style={{ marginBottom: 14 }}>Connect the owner's X account to continue.</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={connectX}>𝕏 Connect X Account</button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>Admin <span className="green">Review Dashboard</span>.</h1>
        <p>Review submissions, check wallet signals, and filter fraud.</p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <DisclaimerBox variant="gold" icon="🔐" title="Restricted access">
            This dashboard is gated to the site owner's X account at the database level, not just
            hidden by the page. AI review uses fraud-risk language only — it flags bots and spam,
            it never ranks pain or decides who deserves support.
          </DisclaimerBox>
        </div>

        <FilterMenu tabs={FILTERS} active={filter} onChange={setFilter} label="Filter" />

        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table className="admin">
            <thead>
              <tr>
                <th>Story title</th>
                <th>Alias</th>
                <th>Wallet</th>
                <th>Category</th>
                <th>X handle</th>
                <th>Status</th>
                <th>Fraud risk</th>
                <th>Dup. risk</th>
                <th>Vouches</th>
                <th>Submitted</th>
                <th>$ANSEM</th>
                <th>Supported</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr
                  key={s.id}
                  className={selectedId === s.id ? 'selected' : ''}
                  onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                >
                  <td style={{ fontWeight: 600, maxWidth: 220 }}>{s.title}</td>
                  <td>{s.alias}</td>
                  <td><span className="wallet-chip">{shortWallet(s.walletAddress)}</span></td>
                  <td>{s.category}</td>
                  <td className="green">{s.xHandle || '—'}</td>
                  <td><StatusPill status={s.status} /></td>
                  <td style={{ color: s.spamRisk >= 60 ? 'var(--danger)' : s.spamRisk >= 30 ? 'var(--amber)' : 'var(--green)', fontWeight: 600 }}>
                    {s.fraudRisk === 'pending' ? 'Pending' : riskLabel(Math.max(s.spamRisk, s.duplicateRisk))}
                  </td>
                  <td style={{ color: s.duplicateRisk >= 60 ? 'var(--danger)' : 'var(--muted)' }}>{s.duplicateRisk}</td>
                  <td>{s.vouchCount}</td>
                  <td className="muted">{s.createdAt}</td>
                  <td>{s.ansemHolder ? '🐂' : '—'}</td>
                  <td>{s.receivedSupport ? '💛' : '—'}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={12} className="muted center" style={{ padding: 30 }}>No submissions match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>Click a row to open the full review panel.</p>

        {selected && <AdminDetail story={selected} onAction={handleAction} />}

        <QuickAddCreator />
        <ToolsManager />
      </div>
    </div>
  )
}
