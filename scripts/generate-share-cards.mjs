// Post-build step: HashRouter means every route serves the same static
// index.html, so X (and every other crawler) only ever sees the same
// generic Bullhorn card no matter which story you share. This generates one
// tiny static HTML file per approved story under dist/s/<id>.html with that
// story's own title/description in its meta tags, then redirects a real
// visitor straight into the SPA at #/story/<id>. Crawlers don't run the
// redirect, so they see the story-specific card instead.
//
// Everything here is wrapped in a top-level try/catch that always exits 0.
// This step is a nice-to-have enhancement, never something that should be
// able to fail the whole site deploy (e.g. a Supabase network hiccup in CI).
import { createClient } from '@supabase/supabase-js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../src/config.js'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function excerpt(text, max = 200) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

async function main() {
  const distDir = new URL('../dist/', import.meta.url)
  const template = await readFile(new URL('index.html', distDir), 'utf8')

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  const { data, error } = await supabase.from('stories').select('data').eq('status', 'approved')

  if (error) {
    console.warn('Skipping share card generation — could not fetch stories:', error.message)
    return
  }

  const shareDir = new URL('s/', distDir)
  await mkdir(shareDir, { recursive: true })

  for (const row of data || []) {
    const story = row.data
    if (!story?.id) continue

    const title = escapeHtml(story.title)
    const description = escapeHtml(excerpt(story.story))
    const hashUrl = `https://bullhorn.live/#/story/${story.id}`

    const page = template
      // vite.config.js builds with relative ("./") asset paths so the site works
      // from a subpath too — fine at the site root, but this page is served one
      // level down at /s/<id>.html, so those same relative paths would 404.
      .replace(/="\.\//g, '="/')
      .replace(/<title>.*?<\/title>/, `<title>${title} — Bullhorn</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="article" />\n    <meta property="og:url" content="${hashUrl}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`)
      .replace('</head>', `    <meta http-equiv="refresh" content="0; url=${hashUrl}" />\n    <script>location.replace(${JSON.stringify(hashUrl)})</script>\n  </head>`)

    await writeFile(new URL(`${story.id}.html`, shareDir), page, 'utf8')
  }

  console.log(`Generated ${data?.length || 0} share card(s).`)
}

try {
  await main()
} catch (err) {
  console.warn('Skipping share card generation — unexpected error:', err?.message || err)
}
