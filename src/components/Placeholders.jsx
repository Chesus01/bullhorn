import { useState } from 'react'

// Real, dependency-free bot check (no external service/account needed).
// Same {checked, onChange(bool)} contract as before, so callers don't change.
export function CaptchaPlaceholder({ onChange }) {
  const [challenge] = useState(() => {
    const a = Math.floor(Math.random() * 8) + 1
    const b = Math.floor(Math.random() * 8) + 1
    return { a, b, answer: a + b }
  })
  const [value, setValue] = useState('')

  const handleChange = (v) => {
    setValue(v)
    onChange(v !== '' && Number(v) === challenge.answer)
  }

  return (
    <div className="captcha-box" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <b>Quick check: what is {challenge.a} + {challenge.b}?</b>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Your answer"
        style={{
          marginTop: 10, width: 120, background: 'var(--card-2)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 10px', color: 'var(--text)', fontSize: '0.95rem',
        }}
      />
    </div>
  )
}
