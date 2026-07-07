import { BadgeRow } from './Badge'
import Avatar from './Avatar'

export default function SupporterCard({ supporter }) {
  return (
    <article className="card card-hover story-card">
      <div className="story-card-top">
        <div className="story-card-identity">
          <Avatar url={supporter.avatarUrl} label={supporter.alias || supporter.xHandle} />
          <h3>{supporter.alias}</h3>
        </div>
        <span className="category-tag">{supporter.supporterType}</span>
      </div>

      {supporter.message && <p className="story-preview" style={{ WebkitLineClamp: 4 }}>“{supporter.message}”</p>}

      <div className="story-meta">
        {supporter.xHandle ? (
          <span className="green">{supporter.xHandle}</span>
        ) : (
          <span>🎭 Anonymous</span>
        )}
        <span>💛 {supporter.storiesSupported} stories supported</span>
      </div>

      {supporter.supportInterests?.length > 0 && (
        <p className="small muted">
          <b style={{ color: 'var(--text)' }}>Wants to support:</b>{' '}
          {supporter.supportInterests.join(' · ')}
        </p>
      )}

      <BadgeRow badges={supporter.badges} />
    </article>
  )
}
