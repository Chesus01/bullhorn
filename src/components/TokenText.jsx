// Brand rule: the token is always written $ANSEM and always stands out in the
// site green — never red.

export function Ansem() {
  return <span className="ansem-token">$ANSEM</span>
}

export function Sol() {
  return <span className="ansem-token" style={{ color: 'var(--aqua)', textShadow: '0 0 12px rgba(20,241,149,0.35)' }}>$SOL</span>
}

// Wraps plain text and renders every "$ANSEM" occurrence in brand green.
// Non-string children pass through untouched.
export function TokenText({ children }) {
  if (typeof children !== 'string') return children
  const parts = children.split('$ANSEM')
  if (parts.length === 1) return children
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <Ansem />}
          {p}
        </span>
      ))}
    </>
  )
}
