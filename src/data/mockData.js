// ============ Mock data — Bullhorn ============
// All wallets below are fake demo addresses. Replace with real data in Phase 3.

// What people say they've made for the community — shared between the Submit
// Story form and the Creator Spotlight page filter.
export const CREATED_OPTIONS = [
  'Content', 'Tool', 'Dashboard', 'Thread', 'Meme', 'Video', 'Spaces', 'Community support', 'None yet',
]

export const CATEGORIES = [
  'Hardship',
  'Creator',
  'Builder',
  'Community Helper',
  'Student',
  'Family',
  'Medical',
  'Housing',
  'Food',
  '$ANSEM Holder Story',
  'Other',
]

export const MOCK_STORIES = [
]

export const MOCK_SUPPORTERS = [
  {
    id: 'sup1',
    alias: 'SolanaSensei',
    xHandle: '@solana_sensei',
    walletAddress: null,
    supporterType: 'Influencer / KOL',
    publicListing: true,
    supportInterests: ['Creators', 'Builders', 'People who have not received support yet'],
    supportMethods: ['Direct SOL donation', 'Content amplification'],
    pledgeRange: '5–20 SOL / month',
    message:
      "Ansem showed us the play. I have reach — the least I can do is point it at real people. If you're building or creating for this community, I want to find you.",
    badges: ['Verified Supporter', 'Influencer'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 12,
    createdAt: '2026-06-16',
  },
  {
    id: 'sup2',
    alias: 'Lena — Fdr @ Chainstitch',
    xHandle: '@lena_builds',
    walletAddress: null,
    supporterType: 'Founder',
    publicListing: true,
    supportInterests: ['Builders', 'Students'],
    supportMethods: ['Direct SOL donation', 'Tools/resources', 'Project rewards'],
    pledgeRange: 'Case by case',
    message:
      'Someone funded my first server bill when I had nothing. Looking for student devs and open-source builders in this ecosystem. I also hire from here.',
    badges: ['Verified Supporter', 'Founder'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 7,
    createdAt: '2026-06-18',
  },
  {
    id: 'sup3',
    alias: 'TheQuietBull',
    xHandle: '@thequietbull',
    walletAddress: null,
    supporterType: 'Whale / Holder',
    publicListing: true,
    supportInterests: ['Hardship stories', 'Families', 'People who have not received support yet'],
    supportMethods: ['Direct SOL donation', 'Private giving'],
    pledgeRange: 'Prefer not to say',
    message:
      "Been holding since the beginning. I don't post much. I read every hardship story on this board and I give quietly. Verify your wallet — it's the first thing I check.",
    badges: ['Verified Supporter', 'Whale / Holder'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 23,
    createdAt: '2026-06-14',
  },
  {
    id: 'sup4',
    alias: 'RenderRae',
    xHandle: '@render_rae',
    walletAddress: null,
    supporterType: 'Creator',
    publicListing: true,
    supportInterests: ['Creators', 'Community helpers'],
    supportMethods: ['Content amplification', 'Direct SOL donation'],
    pledgeRange: '1–5 SOL / month',
    message:
      'Creator supporting creators. If you make content for this community and nobody has noticed yet, tag me. I amplify first, donate when I can.',
    badges: ['Verified Supporter', 'Creator'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 9,
    createdAt: '2026-06-21',
  },
  {
    id: 'sup5',
    alias: 'Anonymous Supporter',
    xHandle: null,
    walletAddress: null,
    supporterType: 'Anonymous Supporter',
    publicListing: true,
    supportInterests: ['Random verified stories', 'Hardship stories'],
    supportMethods: ['Direct SOL donation', 'Private giving'],
    pledgeRange: 'Prefer not to say',
    message:
      'No name, no clout, no strings. I pick verified stories at random and give what I can. This is what crypto was supposed to be.',
    badges: ['Verified Supporter', 'Anonymous Donor'],
    verifiedSupporter: true,
    anonymous: true,
    storiesSupported: 31,
    createdAt: '2026-06-11',
  },
  {
    id: 'sup6',
    alias: 'Chainstitch Labs',
    xHandle: '@chainstitch_labs',
    walletAddress: null,
    supporterType: 'Project Team',
    publicListing: true,
    supportInterests: ['Builders', 'Students', 'People who have not received support yet'],
    supportMethods: ['Tools/resources', 'Project rewards', 'Direct SOL donation'],
    pledgeRange: 'Case by case — team vote each month',
    message:
      "We're a small Solana tooling team. Every month we vote as a team on one builder or student from this board to fund or bring on as a contractor.",
    badges: ['Verified Supporter', 'Project Team'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 4,
    createdAt: '2026-06-23',
  },
  {
    id: 'sup7',
    alias: 'Priya N.',
    xHandle: '@priya_gives_back',
    walletAddress: null,
    supporterType: 'Community Member',
    publicListing: true,
    supportInterests: ['Hardship stories', 'Families', 'Community helpers'],
    supportMethods: ['Direct SOL donation'],
    pledgeRange: '0.5–2 SOL / month',
    message:
      "I'm not a whale or a founder, just someone who believes in this community. I give what I can, when I can.",
    badges: ['Verified Supporter', 'Community Supporter'],
    verifiedSupporter: true,
    anonymous: false,
    storiesSupported: 5,
    createdAt: '2026-06-27',
  },
]

export const MOCK_VOUCHES = {
}

// Badge colors per the brand kit: green = verified, $ANSEM = neon gradient,
// creator = purple, builder = aqua, vouched/featured = gold, risk = red/amber.
export const TRUST_BADGE_STYLES = {
  'Wallet Verified': 'badge-green',
  'Wallet Submitted': 'badge-blue',
  'Wallet Connected': 'badge-blue',
  'Wallet Ownership Signed': 'badge-green',
  'X Verified': 'badge-blue',
  '$ANSEM Holder': 'badge-ansem',
  '$ANSEM Holder Verified': 'badge-ansem',
  'Solana Wallet Active': 'badge-blue',
  Creator: 'badge-purple',
  Builder: 'badge-aqua',
  'Community Vouched': 'badge-gold',
  Featured: 'badge-featured',
  'Needs Review': 'badge-amber',
  'Received Support': 'badge-support',
  'New Wallet': 'badge-amber',
  'Duplicate Risk': 'badge-red',
  'Verified Supporter': 'badge-green',
  Influencer: 'badge-purple',
  Founder: 'badge-aqua',
  'Project Team': 'badge-blue',
  'Whale / Holder': 'badge-gold',
  'Anonymous Donor': 'badge-purple',
  'Community Supporter': 'badge-blue',
}
