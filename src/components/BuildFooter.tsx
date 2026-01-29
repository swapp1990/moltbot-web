import { useState, useEffect } from 'react'
import './BuildFooter.css'

interface BuildFooterProps {
  sha: string
  time: string
}

export default function BuildFooter({ sha, time }: BuildFooterProps) {
  // Collapsed by default on mobile
  const [isExpanded, setIsExpanded] = useState(() => {
    return window.innerWidth > 768
  })

  // Update on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsExpanded(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const shortSha = sha.slice(0, 7)
  const formattedTime = time ? new Date(time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) : 'unknown'

  return (
    <div className={`build-footer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="build-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="build-details"
        aria-label={isExpanded ? 'Collapse build info' : 'Expand build info'}
      >
        <span className="build-icon">ⓘ</span>
        <span className="build-label">build</span>
      </button>

      {isExpanded && (
        <div id="build-details" className="build-details">
          <span className="build-sha">{shortSha}</span>
          <span className="build-separator">·</span>
          <span className="build-time">{formattedTime}</span>
        </div>
      )}
    </div>
  )
}
