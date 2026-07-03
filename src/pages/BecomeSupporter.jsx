import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { looksLikeSolanaAddress } from '../utils'
import DisclaimerBox from '../components/DisclaimerBox'
import { CaptchaPlaceholder, WalletConnectPlaceholder, XConnectPlaceholder } from '../components/Placeholders'
import { TokenText } from '../components/TokenText'
import { usePageTitle } from '../hooks/usePageTitle'

const SUPPORTER_TYPES = [
  'Influencer / KOL', 'Creator', 'Founder', 'Project Team', 'Whale / Holder',
  'Community Member', 'Anonymous Supporter',
]
const INTERESTS = [
  'Hardship stories', 'Creators', 'Builders', 'Community helpers', 'Students',
  'Families', 'People who have not received support yet', 'Random verified stories',
]
const METHODS = [
  'Direct SOL donation', 'Token donation', 'Content amplification',
  'Project rewards', 'Tools/resources', 'Private giving',
]

const initialForm = {
  alias: '', xHandle: '', walletAddress: '', supporterType: '', publicListing: '',
  interests: [], methods: [], pledgeRange: '', message: '', captcha: false,
}

export default function BecomeSupporter() {
  usePageTitle('Become a Supporter')
  const { addSupporter, toast } = useApp()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggle = (k, opt) =>
    set(k, form[k].includes(opt) ? form[k].filter((x) => x !== opt) : [...form[k], opt])

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = {}
    if (!form.alias.trim()) e.alias = 'Please enter a name or alias.'
    if (!form.supporterType) e.supporterType = 'Please choose a supporter type.'
    if (!form.publicListing) e.publicListing = 'Please choose an option.'
    if (form.walletAddress && !looksLikeSolanaAddress(form.walletAddress)) e.walletAddress = 'That does not look like a valid Solana address.'
    if (!form.captcha) e.captcha = 'Please complete the captcha.'
    setErrors(e)
    if (Object.keys(e).length > 0) {
      toast('Please fix the highlighted fields.', 'error')
      return
    }
    const anonymous = form.supporterType === 'Anonymous Supporter'
    if (form.publicListing === 'Yes') {
      addSupporter({
        alias: anonymous ? 'Anonymous Supporter' : form.alias.trim(),
        xHandle: anonymous ? null : form.xHandle.trim() || null,
        walletAddress: null, // never expose supporter wallets publicly by default
        supporterType: form.supporterType,
        publicListing: true,
        supportInterests: form.interests,
        supportMethods: form.methods,
        pledgeRange: form.pledgeRange || 'Prefer not to say',
        message: form.message.trim(),
        badges: ['Community Supporter', ...(anonymous ? ['Anonymous Donor'] : [])],
        verifiedSupporter: false,
        anonymous,
        storiesSupported: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      })
    }
    setSubmitted(true)
    window.scrollTo(0, 0)
  }

  if (submitted) {
    return (
      <div className="container section">
        <div className="final-cta" style={{ maxWidth: 620, margin: '40px auto' }}>
          <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🤝</div>
          <h2>Welcome to the supporter side.</h2>
          <p className="muted" style={{ margin: '14px 0 24px' }}>
            {form.publicListing === 'Yes'
              ? 'You are now listed in the Supporter Directory. Start browsing verified stories and build your first Giving List.'
              : 'You are registered privately. Start browsing verified stories and build your first Giving List — your giving stays anonymous.'}
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/stories" className="btn btn-primary">Browse Verified Stories</Link>
            <Link to="/supporters" className="btn btn-outline">See Supporter Directory</Link>
          </div>
        </div>
      </div>
    )
  }

  const field = (key, label, node, hint) => (
    <div className={`field ${errors[key] ? 'error' : ''}`}>
      <label><TokenText>{label}</TokenText></label>
      {node}
      {hint && !errors[key] && <p className="hint"><TokenText>{hint}</TokenText></p>}
      {errors[key] && <p className="field-error">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="container">
      <div className="page-head">
        <h1>Ansem sparked it. <span className="green">The community can carry it.</span></h1>
        <p>
          Join as a supporter, discover verified real stories, and help reward people who are
          building, creating, struggling, or showing up for the community.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24, maxWidth: 760 }}>
        <div style={{ marginBottom: 24 }}>
          <DisclaimerBox variant="safe" icon="🛡️" title="Supporter safety">
            Bullhorn does not hold donations or process payouts. Supporters give
            directly to users at their own discretion. Always verify wallet addresses before
            sending.
          </DisclaimerBox>
        </div>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          {field('alias', 'Name or alias *', (
            <input value={form.alias} onChange={(e) => set('alias', e.target.value)} placeholder="Your name, alias, or project" />
          ))}

          {field('xHandle', 'X handle', (
            <input value={form.xHandle} onChange={(e) => set('xHandle', e.target.value)} placeholder="@yourhandle" />
          ), 'Verifying your handle makes your supporter profile far more credible to the community and partners.')}

          {form.xHandle.trim() && <XConnectPlaceholder xHandle={form.xHandle.trim()} />}

          {field('walletAddress', 'Solana wallet address', (
            <input value={form.walletAddress} onChange={(e) => set('walletAddress', e.target.value)} placeholder="Optional — used for verification only, never listed publicly" style={{ fontFamily: 'monospace' }} />
          ), 'Used only for read-only verification. Never shown publicly unless you choose to show it.')}

          {field('supporterType', 'Supporter type *', (
            <select value={form.supporterType} onChange={(e) => set('supporterType', e.target.value)}>
              <option value="">Choose…</option>
              {SUPPORTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          ))}

          {field('publicListing', 'Are you okay being listed publicly? *', (
            <select value={form.publicListing} onChange={(e) => set('publicListing', e.target.value)}>
              <option value="">Choose…</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          ), 'Public supporters appear in the Supporter Directory. Private supporters stay off the list entirely.')}

          <div className="field">
            <label>What kind of people do you want to support?</label>
            <div className="checkbox-grid">
              {INTERESTS.map((opt) => (
                <label key={opt} className={`pill-check ${form.interests.includes(opt) ? 'checked' : ''}`}>
                  <input type="checkbox" checked={form.interests.includes(opt)} onChange={() => toggle('interests', opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>How do you want to support?</label>
            <div className="checkbox-grid">
              {METHODS.map((opt) => (
                <label key={opt} className={`pill-check ${form.methods.includes(opt) ? 'checked' : ''}`}>
                  <input type="checkbox" checked={form.methods.includes(opt)} onChange={() => toggle('methods', opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {field('pledgeRange', 'Optional pledge amount or range', (
            <input value={form.pledgeRange} onChange={(e) => set('pledgeRange', e.target.value)} placeholder='e.g. "1–5 SOL / month" or "case by case"' />
          ), 'This is a public statement of intent, not a binding commitment.')}

          {field('message', 'Short message to the community', (
            <textarea value={form.message} onChange={(e) => set('message', e.target.value)} style={{ minHeight: 90 }} placeholder="Why do you want to give back? Who are you hoping to find?" />
          ))}

          <WalletConnectPlaceholder walletAddress={looksLikeSolanaAddress(form.walletAddress) ? form.walletAddress : null} />

          <div>
            <CaptchaPlaceholder checked={form.captcha} onChange={(v) => set('captcha', v)} />
            {errors.captcha && <p className="field-error">{errors.captcha}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ padding: '15px' }}>
            Join as a Supporter
          </button>
        </form>
      </div>
    </div>
  )
}
