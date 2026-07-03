export function CaptchaPlaceholder({ checked, onChange }) {
  return (
    <div className="captcha-box">
      <input
        type="checkbox"
        id="captcha"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="captcha" style={{ cursor: 'pointer' }}>
        <b>I'm not a robot</b>
        <span className="small muted" style={{ display: 'block' }}>Captcha placeholder — real captcha in Phase 3</span>
      </label>
    </div>
  )
}
