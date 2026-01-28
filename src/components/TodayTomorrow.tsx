import { useState } from 'react'
import { useApp } from '../store/AppContext'
import type { CalendarEvent } from '../store/types'
import './TodayTomorrow.css'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (dateStr === today.toISOString().split('T')[0]) return 'Today'
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const eventTypeEmoji: Record<CalendarEvent['type'], string> = {
  meeting: '📅',
  travel: '✈️',
  deadline: '⏰',
  reminder: '🔔',
  other: '📌',
}

export default function TodayTomorrow() {
  const { state, dispatch } = useApp()
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'meeting',
  })

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Group events by date
  const todayEvents = state.calendarEvents.filter(e => e.date === today)
  const tomorrowEvents = state.calendarEvents.filter(e => e.date === tomorrow)
  const upcomingEvents = state.calendarEvents
    .filter(e => e.date > tomorrow)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    dispatch({
      type: 'ADD_EVENT',
      payload: {
        id: generateId(),
        title: newEvent.title!,
        date: newEvent.date!,
        time: newEvent.time,
        type: newEvent.type || 'other',
      },
    })
    setNewEvent({ title: '', date: today, time: '', type: 'meeting' })
    setShowAddEvent(false)
  }

  const EventItem = ({ event }: { event: CalendarEvent }) => (
    <div className={`event-item event-${event.type}`}>
      <span className="event-emoji">{eventTypeEmoji[event.type]}</span>
      <div className="event-content">
        <span className="event-title">{event.title}</span>
        {event.time && <span className="event-time">{event.time}</span>}
      </div>
      <button
        className="btn-icon-only"
        onClick={() => dispatch({ type: 'DELETE_EVENT', payload: event.id })}
      >
        ✕
      </button>
    </div>
  )

  return (
    <section className="today-tomorrow">
      <div className="section-header">
        <h2><span className="section-icon">📆</span> Today & Tomorrow</h2>
      </div>

      <div className="calendar-grid">
        <div className="calendar-card today-card">
          <h3>Today</h3>
          <div className="events-list">
            {todayEvents.length > 0 ? (
              todayEvents.map(event => <EventItem key={event.id} event={event} />)
            ) : (
              <p className="no-events">No events today</p>
            )}
          </div>
        </div>

        <div className="calendar-card tomorrow-card">
          <h3>Tomorrow</h3>
          <div className="events-list">
            {tomorrowEvents.length > 0 ? (
              tomorrowEvents.map(event => <EventItem key={event.id} event={event} />)
            ) : (
              <p className="no-events">No events tomorrow</p>
            )}
          </div>
        </div>

        <div className="calendar-card upcoming-card">
          <h3>Upcoming</h3>
          <div className="events-list">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="event-item upcoming">
                  <span className="event-emoji">{eventTypeEmoji[event.type]}</span>
                  <div className="event-content">
                    <span className="event-title">{event.title}</span>
                    <span className="event-date">{formatDate(event.date)}</span>
                  </div>
                  <button
                    className="btn-icon-only"
                    onClick={() => dispatch({ type: 'DELETE_EVENT', payload: event.id })}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="no-events">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {showAddEvent ? (
        <div className="add-event-form">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <div className="form-row">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
            >
              <option value="meeting">📅 Meeting</option>
              <option value="travel">✈️ Travel</option>
              <option value="deadline">⏰ Deadline</option>
              <option value="reminder">🔔 Reminder</option>
              <option value="other">📌 Other</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary btn-sm" onClick={handleAddEvent}>Add Event</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAddEvent(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-secondary add-event-btn" onClick={() => setShowAddEvent(true)}>
          <span className="btn-icon">➕</span> Add Event
        </button>
      )}

      {state.calendarEvents.length === 0 && (
        <div className="calendar-note">
          <span className="note-icon">💡</span>
          <span>Calendar sync coming soon. For now, add events manually.</span>
        </div>
      )}
    </section>
  )
}
