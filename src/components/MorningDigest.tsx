import { useState, useEffect } from 'react'
import './MorningDigest.css'

const PROJECTS = [
  { name: 'lmafy_lite', emoji: '🚀', url: 'https://github.com/swapp1990/lmafy_lite' },
  { name: 'vacation-photos', emoji: '📸', url: 'https://github.com/swapp1990/vacation-photos' },
  { name: 'lmwfy-ios', emoji: '✍️', url: 'https://github.com/swapp1990/lmwfy-ios' },
  { name: 'moltbot-web', emoji: '🤖', url: 'https://github.com/swapp1990/moltbot-web' },
]

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function Skeleton({ width, height }: { width: string; height: string }) {
  return <div className="skeleton" style={{ width, height }} />
}

export default function MorningDigest() {
  const [time, setTime] = useState<Date | null>(null)
  const [focus, setFocus] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load focus from localStorage
    const savedFocus = localStorage.getItem('moltbot-focus')
    if (savedFocus) setFocus(savedFocus)

    // Set initial time
    setTime(new Date())

    // Update time every minute
    const interval = setInterval(() => setTime(new Date()), 60000)

    // Simulate brief loading for skeleton effect
    setTimeout(() => setIsLoaded(true), 300)

    return () => clearInterval(interval)
  }, [])

  const handleFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFocus(value)
    localStorage.setItem('moltbot-focus', value)
  }

  const handleFocusBlur = () => {
    setIsEditing(false)
  }

  const handleFocusKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  if (!isLoaded || !time) {
    return (
      <div className="morning-digest">
        <div className="digest-header">
          <Skeleton width="200px" height="2.5rem" />
          <Skeleton width="120px" height="1rem" />
        </div>
        <div className="digest-focus">
          <Skeleton width="100%" height="2.5rem" />
        </div>
        <div className="digest-projects">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="140px" height="2.5rem" />
          ))}
        </div>
      </div>
    )
  }

  const hour = time.getHours()
  const greeting = getGreeting(hour)

  return (
    <div className="morning-digest">
      <div className="digest-header">
        <h1 className="digest-greeting">
          {greeting}, Swap
        </h1>
        <p className="digest-time">
          {formatTime(time)} · {formatDate(time)}
        </p>
      </div>

      <div className="digest-focus">
        <span className="focus-label">Today's focus:</span>
        {isEditing ? (
          <input
            type="text"
            className="focus-input"
            value={focus}
            onChange={handleFocusChange}
            onBlur={handleFocusBlur}
            onKeyDown={handleFocusKeyDown}
            placeholder="What's your main goal today?"
            autoFocus
          />
        ) : (
          <button
            className="focus-display"
            onClick={() => setIsEditing(true)}
          >
            {focus || 'Click to set your focus...'}
          </button>
        )}
      </div>

      <div className="digest-projects">
        <span className="projects-label">Quick links:</span>
        <div className="projects-list">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <span className="project-emoji">{project.emoji}</span>
              <span className="project-name">{project.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
