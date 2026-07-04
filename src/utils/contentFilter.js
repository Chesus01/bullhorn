// Lightweight client-side content screen for auto-publish. Not exhaustive —
// it's a first line of defense that catches clear profanity and violent/
// threatening language before a story goes live unattended. Anything it
// flags falls back to `pending` so a human looks at it (same as the old
// fully-manual flow), instead of blocking submission outright.

const PROFANITY = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'nigger', 'nigga', 'faggot',
  'retard', 'whore', 'slut', 'motherfucker',
]

const THREATS = [
  'kill you', 'kill him', 'kill her', 'kill them', 'gonna kill', 'going to kill',
  'i will kill', "i'll kill", 'shoot up', 'shoot you', 'bomb the', 'planting a bomb',
  'kys', 'kill yourself', 'end your life', 'murder you', 'hunt you down',
  'burn your house', 'come to your house and',
]

function wordBoundaryMatch(text, phrase) {
  // Multi-word phrases: plain substring is fine. Single words: use a word
  // boundary so e.g. "class" doesn't match inside a longer safe word.
  if (phrase.includes(' ')) return text.includes(phrase)
  return new RegExp(`\\b${phrase}\\b`, 'i').test(text)
}

export function screenContent(...fields) {
  const text = fields.filter(Boolean).join(' \n ').toLowerCase()
  const profanityHit = PROFANITY.find((w) => wordBoundaryMatch(text, w))
  if (profanityHit) return { flagged: true, reason: 'profanity' }
  const threatHit = THREATS.find((p) => wordBoundaryMatch(text, p))
  if (threatHit) return { flagged: true, reason: 'threatening language' }
  return { flagged: false, reason: null }
}
