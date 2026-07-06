import { useEffect, useRef } from 'react'

let widgetsScriptPromise = null
function loadTwitterWidgets() {
  if (window.twttr?.widgets) return Promise.resolve()
  if (!widgetsScriptPromise) {
    widgetsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return widgetsScriptPromise
}

// Embeds a real X post using X's own official public widget — no API key,
// no scraping. We render their auto-convert blockquote and ask the widget
// script to swap it for the actual embedded tweet.
export default function TweetEmbed({ url }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    loadTwitterWidgets().then(() => {
      if (cancelled || !containerRef.current || !window.twttr) return
      window.twttr.widgets.load(containerRef.current)
    })
    return () => { cancelled = true }
  }, [url])

  if (!url) return null

  return (
    <div ref={containerRef} className="tweet-embed">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  )
}
