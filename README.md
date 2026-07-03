# Bullhorn 🐂

**Real stories. Real wallets. Real people.**

A community-built discovery, verification, and giving-list tool for the Black Bull / ANSEM
Solana ecosystem. Helps supporters find genuine people instead of bots.

**Not a donation processor. Not a claim site. Not an official Ansem site.**
The platform never custodies funds, processes payments, builds transactions, requests token
approvals, requests delegate authority, or sends funds. It only verifies, organizes, displays,
and copies wallet addresses.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

Production build: `npm run build` (output in `dist/`, deployable to any static host —
Netlify, Vercel, GitHub Pages, etc. Uses hash routing so no server config needed).

## Pages

| Route | Page |
|---|---|
| `/#/` | Homepage |
| `/#/submit` | Submit Story (form + validation) |
| `/#/stories` | Browse Stories (filters + search) |
| `/#/spotlight` | Creator Spotlight (ranked creator/builder content, filter by type) |
| `/#/story/:id` | Story Detail |
| `/#/give-back` | Give Back |
| `/#/become-supporter` | Become a Supporter |
| `/#/supporters` | Supporter Directory |
| `/#/giving-list` | Giving List (copy all / CSV download) |
| `/#/about` | About / Disclaimer |
| `/#/admin` | Admin Review Dashboard (demo, no auth yet) |

## Status: Phase 1 + 2 complete

- ✅ All pages, components, mobile-first responsive
- ✅ Brand kit v2 applied: deep black + neon bull green (#39FF14) + Solana purple/aqua,
  gold as premium accent only, red bull eyes
- ✅ Real bull artwork (owner-provided render, green background removed programmatically):
  `public/bull-logo.png` (full 1129px cutout), `bull-logo-512.png` (hero/backdrops),
  `bull-logo-256.png` (navbar/footer), `favicon-64.png`. Original render archived in
  `brand-assets/bull-original.png`. Used via `BullImage` in `src/components/BullArt.jsx`
  (which also keeps an unused hand-drawn SVG fallback). `public/og-image.svg` still needs
  conversion to a 1200x630 PNG before launch — X won't render SVG previews
- ✅ 8 mock stories, 5 mock supporters, vouches, trust badges
- ✅ Form validation, filters, search, local state
- ✅ Copy wallet / copy all wallets / download wallet list with toasts
  (owner decision 2026-07-02: exports are wallet addresses ONLY, one per line — no CSV
  columns, no story metadata in the file)
- ✅ Giving List (add / remove / clear / notes)
- ✅ Mark as supported, admin approve/feature/hide/delete (local state)
- ✅ Captcha + wallet-connect placeholders (clearly marked "demo")

## Phase 3 — integration points (not yet built)

Search the code for these placeholders:

- ✅ **Solana wallet adapter — done.** `src/components/SolanaWalletConnect.jsx` + `src/context/SolanaWalletProvider.jsx`.
  Real connect (Phantom/Solflare explicit, others via Wallet Standard auto-detect) + `signMessage()`
  ownership proof + live `$ANSEM` token-account check (mint in `src/config.js`). Read-only —
  connect and sign only, never a transaction. Needs Buffer polyfill in `src/main.jsx` to work
  with Solana web3.js under Vite (`window.Buffer = Buffer`) — don't remove it.
- **Captcha** → `CaptchaPlaceholder` in the same file.
- **AI fraud review** → `suggestedAction()` in `src/pages/Admin.jsx` is a rule-based mock.
  Fraud-risk language only — never "deserving" language.
- **Database** → all state lives in `src/context/AppContext.jsx` + `src/data/mockData.js`.
- **Admin auth** → `/#/admin` is currently open (demo).
- **X (Twitter) OAuth** → `XConnectPlaceholder` in `src/components/Placeholders.jsx`.
  Backend holds API keys, handles the OAuth callback, confirms handle ownership, adds the
  `X Verified` badge, and can pull bot signals (account age, followers) into admin review.
  Optional trust signal — never a gate. "Share on X" buttons already work today via the
  web intent URL (`shareOnXUrl` in `src/utils.js`); per-story OG preview cards need
  server-side rendering or prerendering (hash routing shares one OG card for all pages).

## Filters & Creator Spotlight (owner decision 2026-07-02)

- Long filter-tab rows were cluttering Browse Stories (10 tabs) and Admin (13 tabs).
  Both now use `FilterMenu` (`src/components/FilterMenu.jsx`) — a single "Filter: X ▾"
  button that opens a dropdown list. The old always-visible `FilterTabs` component was
  deleted since nothing uses it anymore.
- Fixed 2026-07-02: `.filter-menu-item` had no explicit `background`/`border`, so
  some mobile browsers rendered native (light) button chrome instead of the dark
  theme; added a global `button` reset (background/border/appearance:none) plus
  explicit dark styling on the item itself. Also wrapped each item's label in a
  `.label` span so `TokenText`'s multi-span output (used for `$ANSEM Holders`)
  can't be spread apart by the row's `justify-content: space-between`.
- New `/#/spotlight` page (`src/pages/CreatorSpotlight.jsx`) surfaces creator/builder
  submissions (anyone whose `createdAnything` isn't "None yet"), filterable by content
  type (Content, Tool, Dashboard, Thread, Meme, Video, Spaces, Community support — shared
  list now lives in `CREATED_OPTIONS` in `src/data/mockData.js`).
- Ranking uses `spotlightScore()` in `src/utils.js`: vouches × 3 + storyQualitySignal +
  communityVouchSignal + a staff-featured bonus. Phase 3 AI review is what actually
  populates `storyQualitySignal`/`communityVouchSignal` for new submissions — until a
  story is reviewed those default to 0, so new work ranks low until reviewed/vouched
  (matches the existing "AI never decides who deserves support" rule — this only ranks
  content visibility, never hardship).

## Token branding & price ticker

- The token is always written **$ANSEM** and rendered in brand green (`.ansem-token` /
  `<Ansem />` / `<TokenText>` in `src/components/TokenText.jsx`). Never red.
- `PriceTicker` (top of every page) shows live $ANSEM + $SOL prices: $SOL from CoinGecko,
  $ANSEM from DexScreener, locked to the official mint in `src/config.js`
  (`9cRC…pump`, "The Black Bull" on PumpSwap — provided by the owner 2026-07-02).
- Planned (waiting on partner referral code): a "Buy $ANSEM" quick link. Price display
  only until then — see `ANSEM_BUY_URL` in `src/config.js`. No buy/redirect links yet.

## Site policies (owner decisions)

- Promotional-use consent (added 2026-07-02): submitting links/media grants the site
  permission to use them promotionally in future activations, partnerships, and partner
  advertising. Enforced as a required checkbox on Submit Story, stated in the submit
  notice box, the global disclaimer, and the About page.

## Hard rules (do not change)

- No transaction building, payments, custody, escrow, claims, or payouts — ever.
- Wallet connection is read-only: connect + sign plain-text message only.
- AI/fraud copy never judges who *deserves* help; it only flags bot/spam/duplicate risk.
- No "claim your reward" / "free money" / "guaranteed payout" language anywhere.
