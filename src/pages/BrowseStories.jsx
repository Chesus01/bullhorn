import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import StoryCard from '../components/StoryCard'
import FilterMenu from '../components/FilterMenu'
import SearchBar from '../components/SearchBar'
import { BullBackdrop, ChartLines } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const TABS = [
  '$ANSEM Holders', 'Featured', 'Most Vouched', 'Newest', 'Creators', 'Builders',
  'Hardship', 'Needs Support', 'Received Support', 'Needs Review',
]

export default function BrowseStories() {
  usePageTitle('Browse Stories')
  const { stories } = useApp()
  const [tab, setTab] = useState('$ANSEM Holders')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    // Public browse shows approved stories; "Needs Review" tab surfaces flagged ones transparently.
    let list = stories.filter((s) => s.status === 'approved' || s.status === 'needs_review')

    switch (tab) {
      case 'Featured': list = list.filter((s) => s.featured && s.status === 'approved'); break
      case 'Most Vouched': list = [...list].filter((s) => s.status === 'approved').sort((a, b) => b.vouchCount - a.vouchCount); break
      case 'Newest': list = [...list].filter((s) => s.status === 'approved').sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      case 'Creators': list = list.filter((s) => s.status === 'approved' && (s.category === 'Creator' || s.badges.includes('Creator'))); break
      case 'Builders': list = list.filter((s) => s.status === 'approved' && (s.category === 'Builder' || s.badges.includes('Builder'))); break
      case 'Hardship': list = list.filter((s) => s.status === 'approved' && ['Hardship', 'Medical', 'Housing', 'Food', 'Family'].includes(s.category)); break
      case '$ANSEM Holders': list = list.filter((s) => s.status === 'approved' && s.ansemHolder); break
      case 'Needs Support': list = list.filter((s) => s.status === 'approved' && !s.receivedSupport); break
      case 'Received Support': list = list.filter((s) => s.receivedSupport); break
      case 'Needs Review': list = list.filter((s) => s.status === 'needs_review' || s.badges.includes('Needs Review')); break
      default: break
    }

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.xHandle || '').toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.walletAddress.toLowerCase().includes(q) ||
          s.alias.toLowerCase().includes(q)
      )
    }
    return list
  }, [stories, tab, query])

  return (
    <div className="container">
      <BullBackdrop side="right" opacity={0.1} size={420} />
      <ChartLines opacity={0.06} style={{ top: 30, right: '8%' }} />
      <div className="page-head">
        <h1>Browse <span className="green">real stories</span>.</h1>
        <p>
          Review verified stories from creators, builders, holders, families, students, and
          people in need.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div className="search-filter-row" style={{ marginBottom: 26 }}>
          <SearchBar value={query} onChange={setQuery} />
          <FilterMenu tabs={TABS} active={tab} onChange={setTab} label="Filter" />
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p><b>No stories match.</b></p>
            <p className="small">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="grid-3">
            {visible.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
