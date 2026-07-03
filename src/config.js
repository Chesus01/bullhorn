// Site configuration

// The official $ANSEM token mint address on Solana (provided by the site owner).
// The price ticker tracks exactly this token via DexScreener.
export const ANSEM_TOKEN_MINT = '9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump'

// Future (owner decision): add a "Buy $ANSEM" quick link once a partner referral
// code is available. Price display only until then — no buy/redirect links yet.
export const ANSEM_BUY_URL = null

// Supabase project — stories are stored here so submissions are visible to
// every visitor, not just the submitter's browser. The publishable key is
// safe to ship client-side; it's restricted entirely by Row Level Security
// policies on the `stories` table (see supabase/schema.sql).
export const SUPABASE_URL = 'https://kfesysoazbaxletearwp.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_DpqMZjcK58QM0oOKQprQWA_ws01z9PY'
