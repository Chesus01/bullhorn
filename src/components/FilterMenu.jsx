import { useEffect, useRef, useState } from 'react'
import { TokenText } from './TokenText'

// Collapses a long list of filter tabs behind a single "Filter" button so the
// page doesn't open with a wall of pills. Replaces FilterTabs wherever the tab
// count gets unwieldy (Browse Stories, Admin dashboard).
export default function FilterMenu({ tabs, active, onChange, label = 'Filter' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="filter-menu" ref={ref}>
      <button
        type="button"
        className="filter-menu-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden>☰</span>
        <span className="muted">{label}:</span>
        <b><TokenText>{active}</TokenText></b>
        <span className="chevron" aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="filter-menu-panel" role="listbox">
          {tabs.map((t) => (
            <button
              key={t}
              role="option"
              aria-selected={active === t}
              className={`filter-menu-item ${active === t ? 'active' : ''}`}
              onClick={() => { onChange(t); setOpen(false) }}
            >
              <span className="label"><TokenText>{t}</TokenText></span>
              {active === t && <span aria-hidden>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
