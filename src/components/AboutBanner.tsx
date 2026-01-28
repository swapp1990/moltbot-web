import './AboutBanner.css'

export default function AboutBanner() {
  return (
    <div className="about-banner">
      <div className="about-main">
        <span className="about-badge">What is Moltbot?</span>
        <p className="about-text">
          A personal command center for tracking finances, calendar, and projects.
          This is a public demo with sample data.
        </p>
      </div>
      <div className="about-privacy">
        <span className="privacy-icon">🔒</span>
        <span className="privacy-text">
          All data is stored locally in your browser. Nothing is sent to any server unless you export it.
        </span>
      </div>
    </div>
  )
}
