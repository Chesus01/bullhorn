import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BullImage } from './BullArt'
import { XNavButton, useXSession } from './XConnect'

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
  const { handle, avatarUrl, connected } = useXSession()
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="nav-logo" onClick={close}>
          <BullImage height={40} className="horn-pulse" />
          <span className="logo-text">
            <span className="l1">Bull</span>
            <span className="l2">Horn</span>
          </span>
        </Link>

        <a
          href="https://bullpen.fi/@chesus"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm nav-center-cta"
        >
          Trade on Bullpen
        </a>

        <div className="nav-actions">
          {connected && (
            <span className="x-connected-badge" title={`X connected: ${handle}`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" />
              ) : (
                <span className="x-connected-fallback">𝕏</span>
              )}
              <span className="x-connected-dot" />
            </span>
          )}
          <Link to="/submit" className="btn btn-primary btn-sm" onClick={close}>
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

      {open && <div className="nav-panel-backdrop" onClick={close} />}

      <nav className={`nav-panel ${open ? 'open' : ''}`}>
        <button className="nav-panel-close" onClick={close} aria-label="Close menu">✕</button>

        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')} onClick={close}>
            {l.label}
          </NavLink>
        ))}

        <hr className="divider" />

        <NavLink to="/giving-list" onClick={close}>
          🎁 Giving List ({givingList.length})
        </NavLink>
        <div style={{ padding: '10px 14px' }}>
          <XNavButton />
        </div>
        <a href="https://bullpen.fi/@chesus" target="_blank" rel="noreferrer" className="btn btn-outline" onClick={close}>
          Bullpen ↗
        </a>
      </nav>
    </header>
  )
}
