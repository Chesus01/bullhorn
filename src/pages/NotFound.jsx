import { Link } from 'react-router-dom'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')
  return (
    <div className="container section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
      <SceneBackdrop src="/scene-giveback.jpg" side="right" opacity={0.3} />
      <div className="empty-state" style={{ margin: '0 auto', maxWidth: 480 }}>
        <div className="icon">🐂</div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 10 }}>This page wandered off the trail.</h1>
        <p className="small" style={{ marginBottom: 22 }}>
          The page you're looking for doesn't exist — or it may have moved. Let's get you back to
          real stories.
        </p>
        <div className="hero-ctas" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/stories" className="btn btn-outline">Browse Stories</Link>
        </div>
      </div>
    </div>
  )
}
