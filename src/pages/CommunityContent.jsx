import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CREATED_OPTIONS } from '../data/mockData'
import FilterMenu from '../components/FilterMenu'
import { BadgeRow } from '../components/Badge'
import TweetEmbed from '../components/TweetEmbed'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const CONTENT_TYPES = CREATED_OPTIONS.filter((c) => c !== 'None yet')
const TABS = ['All', ...CONTENT_TYPES]

function ContentCard({ story }) {
  const madeThings = story.createdAnything.filter((c) => c !== 'None yet')

  return (
    <article className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="story-meta">
        <span>{story.alias}</span>
        {story.xHandle && <span className="green">{story.xHandle}</span>}
        <Link to={`/story/${story.id}`} className="small muted">View story ↗</Link>
      </div>

      {madeThings.length > 0 && <BadgeRow badges={madeThings} />}

      <TweetEmbed url={story.featuredPostUrl} />
    </article>
  )
}

export default function CommunityContent() {
  usePageTitle('Community Content')
  const { stories } = useApp()
  const [type, setType] = useState('All')

  const withContent = useMemo(() => {
    let list = stories.filter((s) => s.status === 'approved' && s.featuredPostUrl)
    if (type !== 'All') {
      list = list.filter((s) => s.createdAnything.includes(type))
    }
    return list
  }, [stories, type])

  return (
    <div className="container">
      <SceneBackdrop src="/scene-giveback.jpg" side="left" opacity={0.25} />
      <div className="page-head">
        <h1>Community <span className="green">content</span>.</h1>
        <p>
          Real posts from real creators — anime edits, articles, threads, memes, and more, made for
          the Black Bull / $ANSEM community. Pulled straight from X.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div style={{ marginBottom: 26 }}>
          <FilterMenu tabs={TABS} active={type} onChange={setType} label="Content type" />
        </div>

        {withContent.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <p><b>No featured posts in this category yet.</b></p>
            <p className="small">
              Creators can add one from the <Link to="/submit">Submit Story</Link> form.
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {withContent.map((s) => <ContentCard key={s.id} story={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
