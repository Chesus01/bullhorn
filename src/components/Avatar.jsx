export default function Avatar({ url, label, size = 36 }) {
  const initial = (label || '?').replace('@', '').charAt(0).toUpperCase()
  return (
    <span className={`story-avatar ${url ? 'verified' : ''}`} style={{ width: size, height: size }}>
      {url ? (
        <img src={url} alt="" />
      ) : (
        <span className="story-avatar-fallback" style={{ fontSize: size * 0.4 }}>{initial}</span>
      )}
    </span>
  )
}
