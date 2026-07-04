import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CREATED_OPTIONS } from '../data/mockData'
import { looksLikeSolanaAddress } from '../utils'
import { screenContent } from '../utils/contentFilter'
import DisclaimerBox from '../components/DisclaimerBox'
import { CaptchaPlaceholder } from '../components/Placeholders'
import XConnect, { restoreFormSnapshot } from '../components/XConnect'
import SolanaWalletConnect from '../components/SolanaWalletConnect'
import { TokenText } from '../components/TokenText'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const HOLDER_OPTIONS = ['Yes', 'No', 'Not sure', 'Prefer not to say']

const initialForm = {
  alias: '',
  xHandle: '',
  walletAddress: '',
  title: '',
  category: '',
  holder: '',
  story: '',
  need: '',
  created: [],
  proofLinks: '',
  publicNote: '',
  consent: false,
  honesty: false,
  safety: false,
  promo: false,
  captcha: false,
}

export default function SubmitStory() {
  usePageTitle('Submit Your Story')
  const { addStory, toast } = useApp()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [walletVerified, setWalletVerified] = useState(false)
  const [ansemHolderVerified, setAnsemHolderVerified] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [heldForReview, setHeldForReview] = useState(false)

  useEffect(() => {
    const restored = restoreFormSnapshot('submit')
    if (restored) setForm((f) => ({ ...f, ...restored }))
  }, [])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleCreated = (opt) =>
    set('created', form.created.includes(opt) ? form.created.filter((c) => c !== opt) : [...form.created, opt])

  const validate = () => {
    const e = {}
    if (!form.alias.trim()) e.alias = 'Please enter a name or alias.'
    if (!looksLikeSolanaAddress(form.walletAddress)) e.walletAddress = 'Please enter a valid Solana wallet address (32–44 base58 characters).'
    if (!form.title.trim()) e.title = 'Please give your story a title.'
    if (!form.category) e.category = 'Please choose a category.'
    if (form.story.trim().length < 80) e.story = 'Please tell your story in at least 80 characters — real detail helps supporters trust it.'
    if (!form.consent) e.consent = 'Required.'
    if (!form.honesty) e.honesty = 'Required.'
    if (!form.safety) e.safety = 'Required.'
    if (!form.promo) e.promo = 'Required.'
    if (!form.captcha) e.captcha = 'Please complete the captcha.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      toast('Please fix the highlighted fields.', 'error')
      return
    }
    const badges = ['Wallet Submitted']
    if (walletVerified) badges.push('Wallet Verified', 'Wallet Ownership Signed')
    if (ansemHolderVerified) badges.push('$ANSEM Holder Verified')
    const { flagged } = screenContent(form.title, form.story, form.need, form.publicNote)
    setHeldForReview(flagged)
    addStory({
      title: form.title.trim(),
      alias: form.alias.trim(),
      xHandle: form.xHandle.trim(),
      walletAddress: form.walletAddress.trim(),
      category: form.category,
      story: form.story.trim(),
      need: form.need.trim(),
      proofLinks: form.proofLinks.split('\n').map((l) => l.trim()).filter(Boolean),
      createdAnything: form.created.length ? form.created : ['None yet'],
      badges,
      vouchCount: 0,
      receivedSupport: false,
      supportTransactions: [],
      featured: false,
      status: flagged ? 'pending' : 'approved',
      fraudRisk: 'pending',
      duplicateRisk: 0,
      spamRisk: 0,
      walletFreshnessRisk: 0,
      storyQualitySignal: 0,
      communityVouchSignal: 0,
      humanConfidence: 0,
      ansemHolder: form.holder === 'Yes' || ansemHolderVerified,
      walletVerified,
      walletSigned: walletVerified,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
    setSubmitted(true)
    window.scrollTo(0, 0)
  }

  if (submitted) {
    return (
      <div className="container section">
        <div className="final-cta" style={{ maxWidth: 620, margin: '40px auto' }}>
          <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🐂</div>
          <h2>{heldForReview ? 'Story submitted for review.' : 'Story is live!'}</h2>
          <p className="muted" style={{ margin: '14px 0 24px' }}>
            {heldForReview
              ? 'Thanks for sharing. Our automated check flagged something in your submission, so a reviewer will look at it before it appears publicly.'
              : 'Thanks for sharing — your story is already visible on the site.'}{' '}
            Submitting a story does not guarantee rewards, donations, visibility, or support — but
            real, verified stories are exactly what this board exists for.
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/stories" className="btn btn-primary">Browse Stories</Link>
            <button className="btn btn-outline" onClick={() => { setForm(initialForm); setWalletVerified(false); setSubmitted(false) }}>
              Submit another story
            </button>
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
      <SceneBackdrop src="/scene-browse.jpg" side="left" opacity={0.2} />
      <div className="page-head">
        <h1>Submit your <span className="green">story</span>.</h1>
        <p>
          Share your real story, connect it to a Solana wallet, and help supporters discover
          genuine people instead of bots.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24, maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <DisclaimerBox variant="danger" icon="⚠️" title="Before you submit">
            Submitting a story does not guarantee rewards, donations, visibility, or support. Do
            not upload sensitive documents, private medical records, government IDs, seed phrases,
            or private keys. By uploading links or media, you give Bullhorn permission
            to use them as promotional material for future activations and partnerships, including
            partner advertising.
          </DisclaimerBox>
        </div>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          {field('alias', 'Name or alias *', (
            <input value={form.alias} onChange={(e) => set('alias', e.target.value)} placeholder="How should the community know you?" />
          ))}

          {field('xHandle', 'X handle', (
            <input value={form.xHandle} onChange={(e) => set('xHandle', e.target.value)} placeholder="@yourhandle" />
          ), 'Optional, but it helps supporters verify you are real.')}

          {form.xHandle.trim() && (
            <XConnect page="submit" formSnapshot={form} onVerified={(h) => set('xHandle', h)} />
          )}

          {field('walletAddress', 'Solana wallet address *', (
            <input value={form.walletAddress} onChange={(e) => set('walletAddress', e.target.value)} placeholder="Your public Solana wallet address" style={{ fontFamily: 'monospace' }} />
          ), 'Public address only. Never share your seed phrase or private key with anyone.')}

          <SolanaWalletConnect
            onVerified={({ publicKey }) => { setWalletVerified(true); set('walletAddress', publicKey) }}
            onHolderChecked={setAnsemHolderVerified}
          />

          {field('title', 'Story title *', (
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="One line that captures your story" />
          ))}

          {field('category', 'Story category *', (
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">Choose a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ))}

          {field('holder', 'Are you a Black Bull / $ANSEM holder?', (
            <select value={form.holder} onChange={(e) => set('holder', e.target.value)}>
              <option value="">Select…</option>
              {HOLDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ), 'Holding $ANSEM is a trust signal, not a requirement. You do not need to hold to share a story.')}

          {field('story', 'Tell your story *', (
            <textarea value={form.story} onChange={(e) => set('story', e.target.value)} placeholder="Who are you? What are you building, what do you need, or how have you shown up for the community? Real detail builds real trust." />
          ))}

          {field('need', 'What would help most?', (
            <textarea value={form.need} onChange={(e) => set('need', e.target.value)} style={{ minHeight: 80 }} placeholder="Be specific if you can. Supporters respond to clarity." />
          ))}

          <div className="field">
            <label>Have you created anything for the community?</label>
            <div className="checkbox-grid">
              {CREATED_OPTIONS.map((opt) => (
                <label key={opt} className={`pill-check ${form.created.includes(opt) ? 'checked' : ''}`}>
                  <input type="checkbox" checked={form.created.includes(opt)} onChange={() => toggleCreated(opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {field('proofLinks', 'Proof links', (
            <textarea value={form.proofLinks} onChange={(e) => set('proofLinks', e.target.value)} style={{ minHeight: 80 }} placeholder={'One link per line — X profile, GitHub, portfolio, content you made…'} />
          ), 'Links to your public work or profiles. More proof = more trust.')}

          {field('publicNote', 'Optional public note', (
            <input value={form.publicNote} onChange={(e) => set('publicNote', e.target.value)} placeholder="A short note shown with your story" />
          ))}

          <hr className="divider" style={{ margin: '8px 0' }} />

          {[
            ['consent', 'I understand my story may be publicly visible if approved.'],
            ['honesty', 'I confirm I am not impersonating anyone and this story is my own.'],
            ['safety', 'I understand I should not share private keys, seed phrases, IDs, medical documents, or sensitive personal records.'],
            ['promo', 'I understand that by uploading links or media, I give Bullhorn permission to use them as promotional material for future activations and partnerships, including being featured in partner advertising.'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="check-row">
                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />
                <span>{label} *</span>
              </label>
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <CaptchaPlaceholder checked={form.captcha} onChange={(v) => set('captcha', v)} />
            {errors.captcha && <p className="field-error">{errors.captcha}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ padding: '15px' }}>
            Submit Story for Review
          </button>
          <p className="small muted center">
            Real stories. Real wallets. Real people. Submissions publish instantly unless flagged for review.
          </p>
        </form>
      </div>
    </div>
  )
}
