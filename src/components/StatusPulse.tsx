import { useMemo } from 'react'
import { useApp } from '../store/AppContext'
import './StatusPulse.css'

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function getDaysUntilDue(dueDate: number): number {
  const today = new Date()
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), dueDate)
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dueDate)

  const target = thisMonth >= today ? thisMonth : nextMonth
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function StatusPulse() {
  const { state } = useApp()
  const today = getTodayString()

  // Calculate metrics
  const metrics = useMemo(() => {
    // Total debt
    const totalDebt = state.debts.reduce((sum, d) => sum + d.balance, 0)

    // Today's events count
    const todayEvents = state.calendarEvents.filter(e => e.date === today).length

    // Active projects count
    const activeProjects = state.projects.filter(p => p.status === 'active').length

    // Urgent items (payments due within 2 days, events today)
    const urgentPayments = state.debts.filter(d => getDaysUntilDue(d.dueDate) <= 2).length
    const hasUrgentItems = urgentPayments > 0 || todayEvents > 0

    // Income vs goal
    const incomeGap = state.incomeGoal.currentActual - state.incomeGoal.monthlyTarget
    const incomeOnTrack = incomeGap >= 0

    return {
      totalDebt,
      todayEvents,
      activeProjects,
      hasUrgentItems,
      urgentCount: urgentPayments,
      incomeOnTrack,
      incomeGap: Math.abs(incomeGap),
    }
  }, [state, today])

  const scrollToSection = (sectionClass: string) => {
    const section = document.querySelector(`.${sectionClass}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="status-pulse">
      {/* Financial Pulse */}
      <button
        className="pulse-indicator"
        onClick={() => scrollToSection('money-command')}
        aria-label="View financial details"
      >
        <span className="pulse-icon">💰</span>
        <span className="pulse-label">
          <span className="pulse-value">
            ${metrics.totalDebt.toLocaleString()}
          </span>
          <span className="pulse-sublabel">total debt</span>
        </span>
      </button>

      {/* Income Status */}
      <button
        className="pulse-indicator"
        onClick={() => scrollToSection('money-command')}
        aria-label="View income details"
      >
        <span className={`pulse-trend ${metrics.incomeOnTrack ? 'trend-up' : 'trend-down'}`}>
          {metrics.incomeOnTrack ? '↑' : '↓'}
        </span>
        <span className="pulse-label">
          <span className="pulse-value">
            {metrics.incomeOnTrack ? 'on track' : `-$${metrics.incomeGap}`}
          </span>
          <span className="pulse-sublabel">income</span>
        </span>
      </button>

      {/* Today's Load */}
      <button
        className="pulse-indicator"
        onClick={() => scrollToSection('today-tomorrow')}
        aria-label="View today's events"
      >
        <span className="pulse-icon">📅</span>
        <span className="pulse-label">
          <span className="pulse-value">{metrics.todayEvents}</span>
          <span className="pulse-sublabel">{metrics.todayEvents === 1 ? 'event' : 'events'} today</span>
        </span>
      </button>

      {/* Projects */}
      <button
        className="pulse-indicator"
        onClick={() => scrollToSection('projects-section')}
        aria-label="View projects"
      >
        <span className="pulse-icon">🛠️</span>
        <span className="pulse-label">
          <span className="pulse-value">{metrics.activeProjects}</span>
          <span className="pulse-sublabel">active</span>
        </span>
      </button>

      {/* Alert Badge */}
      {metrics.hasUrgentItems && (
        <div className="pulse-alert" aria-label="Urgent items need attention">
          <span className="alert-dot" />
          <span className="alert-text">
            {metrics.urgentCount > 0 && `${metrics.urgentCount} due soon`}
          </span>
        </div>
      )}
    </div>
  )
}
