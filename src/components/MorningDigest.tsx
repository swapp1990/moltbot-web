import { useApp } from '../store/AppContext'
import './MorningDigest.css'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function MorningDigest() {
  const { state } = useApp()

  // Get priority debt (first in sorted order based on strategy)
  const sortedDebts = [...state.debts].sort((a, b) => {
    if (state.payoffStrategy === 'avalanche') return b.apr - a.apr
    return a.balance - b.balance
  })
  const priorityDebt = sortedDebts[0]

  // Get today's first event
  const today = new Date().toISOString().split('T')[0]
  const todayEvent = state.calendarEvents.find(e => e.date === today)

  // Get first active project
  const activeProject = state.projects.find(p => p.status === 'active')

  // Calculate income gap
  const incomeGap = state.incomeGoal.monthlyTarget - state.incomeGoal.currentActual
  const hasIncomeGap = incomeGap > 0

  const hasAnyItems = priorityDebt || todayEvent || activeProject

  if (!hasAnyItems) {
    return (
      <section className="morning-digest empty">
        <div className="digest-icon">🌅</div>
        <h3>Your day is clear</h3>
        <p>Add debts, events, or projects to see your daily priorities here.</p>
      </section>
    )
  }

  return (
    <section className="morning-digest">
      <div className="digest-header">
        <span className="digest-icon">⚡</span>
        <h3>Today's Top 3</h3>
      </div>

      <div className="digest-items">
        {/* Money Focus */}
        {priorityDebt ? (
          <div className="digest-item money">
            <span className="item-icon">💰</span>
            <div className="item-content">
              <span className="item-label">Money Focus</span>
              <span className="item-title">
                Pay {priorityDebt.name}
                <span className="item-meta">{formatCurrency(priorityDebt.minPayment)} min due</span>
              </span>
              {hasIncomeGap && (
                <span className="item-subtitle negative">
                  {formatCurrency(incomeGap)} income gap this month
                </span>
              )}
            </div>
            <span className="item-badge">{state.payoffStrategy === 'avalanche' ? `${priorityDebt.apr}% APR` : formatCurrency(priorityDebt.balance)}</span>
          </div>
        ) : (
          <div className="digest-item money empty-item">
            <span className="item-icon">💰</span>
            <div className="item-content">
              <span className="item-label">Money Focus</span>
              <span className="item-title empty-text">No debts tracked</span>
            </div>
          </div>
        )}

        {/* Calendar Event */}
        {todayEvent ? (
          <div className="digest-item calendar">
            <span className="item-icon">📅</span>
            <div className="item-content">
              <span className="item-label">Next Up</span>
              <span className="item-title">
                {todayEvent.title}
                {todayEvent.time && <span className="item-meta">{todayEvent.time}</span>}
              </span>
            </div>
            <span className="item-badge type">{todayEvent.type}</span>
          </div>
        ) : (
          <div className="digest-item calendar empty-item">
            <span className="item-icon">📅</span>
            <div className="item-content">
              <span className="item-label">Next Up</span>
              <span className="item-title empty-text">No events today</span>
            </div>
          </div>
        )}

        {/* Project Milestone */}
        {activeProject ? (
          <div className="digest-item project">
            <span className="item-icon">{activeProject.emoji}</span>
            <div className="item-content">
              <span className="item-label">Project Focus</span>
              <span className="item-title">
                {activeProject.name}
                <span className="item-meta">{activeProject.nextMilestone}</span>
              </span>
            </div>
            <span className="item-badge status active">active</span>
          </div>
        ) : (
          <div className="digest-item project empty-item">
            <span className="item-icon">🛠️</span>
            <div className="item-content">
              <span className="item-label">Project Focus</span>
              <span className="item-title empty-text">No active projects</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
