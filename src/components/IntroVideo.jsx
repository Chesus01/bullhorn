import { useState } from 'react'

// Full-screen splash video shown once per browser session, only on a fresh
// landing at the site root (not on deep links people share, like a story
// link posted on X — those should open straight to the content).
export default function IntroVideo({ onDone }) {
  const [fading, setFading] = useState(false)

  const finish = () => {
    if (fading) return
    setFading(true)
    sessionStorage.setItem('bullhorn_intro_seen', '1')
    setTimeout(onDone, 400)
  }

  return (
    <div className={`intro-video-overlay ${fading ? 'fading' : ''}`}>
      <video
        className="intro-video"
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={finish}
      />
      <button type="button" className="btn btn-outline intro-skip" onClick={finish}>
        Skip Intro →
      </button>
    </div>
  )
}
