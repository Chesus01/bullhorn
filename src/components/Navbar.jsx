import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BullImage } from './BullArt'
import { XNavButton } from './XConnect'

const LINKS = [
  { to: '/guide', label: 'Guide' },
  { to: '/stories', label: 'Stories' },
  { to: '/spotlight', label: 'Spotlight' },
  { to: '/submit', label: 'Submit Story' },
  { to: '/give-back', label: 'Give Back' },
  { to: '/supporters', label: 'Supporters' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { givingList } = useApp()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <BullImage height={40} className="horn-pulse" />
          <span className="logo-text">
            <span className="l1">Bull</span>
            <span className="l2">Horn</span>
          </span>
        </Link>

        <nav className="nav-links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            href="https://bullpen.fi/@chesus"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm nav-cta"
          >
            Bullpen ↗
          </a>
          <Link to="/giving-list" className="giving-list-pill" title="Your Giving List">
            <span>🎁</span>
            <span className="giving-list-count">{givingList.length}</span>
          </Link>
          <XNavButton />
          <Link to="/submit" className="btn btn-primary btn-sm nav-cta">
            Submit Your Story
          </Link>
          <button
            className={`nav-burger ${open ? 'open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-menu">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/giving-list" onClick={() => setOpen(false)}>
            Giving List ({givingList.length})
          </NavLink>
          <a href="https://bullpen.fi/@chesus" target="_blank" rel="noreferrer" className="btn btn-primary" onClick={() => setOpen(false)}>
            Bullpen ↗
          </a>
          <Link to="/submit" className="btn btn-primary" onClick={() => setOpen(false)}>
            Submit Your Story
          </Link>
        </nav>
      )}
    </header>
  )
}
