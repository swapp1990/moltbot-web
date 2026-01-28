import { useState, useEffect, useRef } from 'react'
import { useApp } from '../store/AppContext'
import './Header.css'

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Header() {
  const { state, dispatch, exportJSON, importData } = useApp()
  const [time, setTime] = useState(new Date())
  const [isEditingFocus, setIsEditingFocus] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        importData(data)
        alert('Data imported successfully!')
      } catch {
        alert('Failed to parse file. Please ensure it\'s valid JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const greeting = getGreeting(time.getHours())
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-greeting">
          <h1>{greeting}, Swap</h1>
          <p className="header-datetime">{dateStr} · {timeStr}</p>
        </div>
        <div className="header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="btn btn-secondary" onClick={handleImportClick}>
            <span className="btn-icon">📥</span> Import
          </button>
          <button className="btn btn-secondary" onClick={exportJSON}>
            <span className="btn-icon">📤</span> Export JSON
          </button>
          <span className="data-note">Data stored locally in your browser only</span>
        </div>
      </div>

      <div className="header-focus">
        <span className="focus-label">🎯 Today's focus:</span>
        {isEditingFocus ? (
          <input
            type="text"
            className="focus-input"
            value={state.todayFocus}
            onChange={(e) => dispatch({ type: 'SET_TODAY_FOCUS', payload: e.target.value })}
            onBlur={() => setIsEditingFocus(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingFocus(false)}
            placeholder="What's your main priority today?"
            autoFocus
          />
        ) : (
          <button className="focus-display" onClick={() => setIsEditingFocus(true)}>
            {state.todayFocus || 'Click to set your focus...'}
          </button>
        )}
      </div>
    </header>
  )
}
