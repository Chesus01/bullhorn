import { useApp } from '../context/AppContext'
import { SceneBackdrop } from '../components/BullArt'
import Avatar from '../components/Avatar'
import { usePageTitle } from '../hooks/usePageTitle'

// "Shared by" only becomes a clickable link when it's typed as an X handle
// (starts with @) — a plain name like "Ansem" just stays as text.
function SharedBy({ sharedBy }) {
  if (!sharedBy) return null
  const isHandle = sharedBy.trim().startsWith('@')
  return (
    <p className="small green">
      Shared by{' '}
      {isHandle ? (
        <a href={`https://x.com/${sharedBy.trim().slice(1)}`} target="_blank" rel="noreferrer">
          {sharedBy.trim()}
        </a>
      ) : (
        sharedBy
      )}
    </p>
  )
}

export default function CommunityTools() {
  usePageTitle('Community Tools')
  const { tools } = useApp()

  return (
    <div className="container">
      <SceneBackdrop src="/scene-browse.jpg" side="right" opacity={0.2} />
      <div className="page-head">
        <h1>Community <span className="green">tools</span>.</h1>
        <p>
          Useful sites and tools built for the Black Bull / $ANSEM community — hand-picked, including
          things Ansem himself has shared.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        {tools.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🧰</div>
            <p><b>No tools listed yet.</b></p>
            <p className="small">Check back soon.</p>
          </div>
        ) : (
          <div className="grid-3">
            {tools.map((t) => (
              <div key={t.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="story-card-identity">
                  <Avatar url={t.avatarUrl} label={t.sharedBy || t.name} />
                  <h3 style={{ fontSize: '1.05rem' }}>{t.name}</h3>
                </div>
                {t.description && <p className="small muted">{t.description}</p>}
                <SharedBy sharedBy={t.sharedBy} />
                <a href={t.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Open Tool ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
