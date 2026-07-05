import { useEffect, useRef } from 'react'
import { TURNSTILE_SITE_KEY } from '../config'

let turnstileScriptPromise = null
function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve()
  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return turnstileScriptPromise
}

// Real bot protection via Cloudflare Turnstile — replaces the old math-
// question captcha, which only had a handful of possible answers and was
// trivial for a scripted bot to brute force. Same {onChange(bool)} contract
// as before, so callers (SubmitStory, BecomeSupporter) don't need to change.
export function CaptchaPlaceholder({ onChange }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: () => onChange(true),
        'expired-callback': () => onChange(false),
        'error-callback': () => onChange(false),
      })
    })
    return () => {
      cancelled = true
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} />
}
