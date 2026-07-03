import { useApp } from '../context/AppContext'

export default function Toasts() {
  const { toasts } = useApp()
  if (toasts.length === 0) return null
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
