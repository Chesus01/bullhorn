import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useXSession, connectX } from '../components/XConnect'
import StoryCard from '../components/StoryCard'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

export default function MyStories() {
  usePageTitle('My Stories')
  const { stories } = useApp()
  const { handle, loading, connected } = useXSession()

  const mine = connected
    ? stories.filter((s) => (s.xHandle || '').toLowerCase() === handle.toLowerCase())
    : []

  return (
    <div className="container">
      <SceneBackdrop src="/scene-browse.jpg" side="left" opacity={0.2} />
      <div className="page-head">
        <h1>Your <span className="green">stories</span>.</h1>
        <p>Every story you've submitted under your connected X account, in one place.</p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        {loading ? null : !connected ? (
          <div className="empty-state">
            <div className="icon">𝕏</div>
            <p><b>Connect your X account to see your stories.</b></p>
            <p className="small" style={{ marginBottom: 14 }}>
              Stories are matched to the X handle connected when you submitted them.
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={connectX}>
              𝕏 Connect X Account
            </button>
          </div>
        ) : mine.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🐂</div>
            <p><b>No stories found for {handle}.</b></p>
            <p className="small" style={{ marginBottom: 14 }}>
              Stories only show up here if you had X connected at the time you submitted.
            </p>
            <Link to="/submit" className="btn btn-primary btn-sm">Submit Your Story</Link>
          </div>
        ) : (
          <div className="grid-3">
            {mine.map((s) => <StoryCard key={s.id} story={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
