import { useState } from 'react'
import { useApp } from '../store/AppContext'
import type { Debt, IncomeStream } from '../store/types'
import './MoneyCommand.css'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export default function MoneyCommand() {
  const { state, dispatch } = useApp()
  const [showAddDebt, setShowAddDebt] = useState(false)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    balance: 0,
    apr: 0,
    minPayment: 0,
    dueDate: 1,
    category: 'credit_card',
  })
  const [newIncome, setNewIncome] = useState<Partial<IncomeStream>>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    category: 'salary',
  })

  const totalDebt = state.debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayments = state.debts.reduce((sum, d) => sum + d.minPayment, 0)
  const incomeGap = state.incomeGoal.monthlyTarget - state.incomeGoal.currentActual
  const incomeProgress = (state.incomeGoal.currentActual / state.incomeGoal.monthlyTarget) * 100

  // Sort debts by strategy
  const sortedDebts = [...state.debts].sort((a, b) => {
    if (state.payoffStrategy === 'avalanche') return b.apr - a.apr
    return a.balance - b.balance
  })

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.balance) return
    dispatch({
      type: 'ADD_DEBT',
      payload: {
        id: generateId(),
        name: newDebt.name!,
        balance: newDebt.balance!,
        apr: newDebt.apr || 0,
        minPayment: newDebt.minPayment || 0,
        dueDate: newDebt.dueDate || 1,
        category: newDebt.category || 'other',
      },
    })
    setNewDebt({ name: '', balance: 0, apr: 0, minPayment: 0, dueDate: 1, category: 'credit_card' })
    setShowAddDebt(false)
  }

  const handleAddIncome = () => {
    if (!newIncome.name || !newIncome.amount) return
    dispatch({
      type: 'ADD_INCOME',
      payload: {
        id: generateId(),
        name: newIncome.name!,
        amount: newIncome.amount!,
        frequency: newIncome.frequency || 'monthly',
        category: newIncome.category || 'other',
      },
    })
    setNewIncome({ name: '', amount: 0, frequency: 'monthly', category: 'salary' })
    setShowAddIncome(false)
  }

  return (
    <section className="money-command">
      <div className="section-header">
        <h2><span className="section-icon">💰</span> Money Command</h2>
      </div>

      <div className="money-grid">
        {/* Debt Dashboard */}
        <div className="money-card debt-card">
          <div className="card-header">
            <h3>Debt Dashboard</h3>
            <div className="strategy-toggle">
              <button
                className={`toggle-btn ${state.payoffStrategy === 'avalanche' ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_PAYOFF_STRATEGY', payload: 'avalanche' })}
                title="Pay highest APR first"
              >
                🏔️ Avalanche
              </button>
              <button
                className={`toggle-btn ${state.payoffStrategy === 'snowball' ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_PAYOFF_STRATEGY', payload: 'snowball' })}
                title="Pay smallest balance first"
              >
                ⛄ Snowball
              </button>
            </div>
          </div>

          <div className="debt-summary">
            <div className="summary-stat">
              <span className="stat-label">Total Debt</span>
              <span className="stat-value negative">{formatCurrency(totalDebt)}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Monthly Min</span>
              <span className="stat-value">{formatCurrency(totalMinPayments)}</span>
            </div>
          </div>

          <div className="debt-list">
            {sortedDebts.length > 0 ? (
              sortedDebts.map((debt, index) => (
                <div key={debt.id} className={`debt-item ${index === 0 ? 'priority' : ''}`}>
                  <div className="debt-main">
                    <span className="debt-name">
                      {index === 0 && <span className="priority-badge">PRIORITY</span>}
                      {debt.name}
                    </span>
                    <span className="debt-balance">{formatCurrency(debt.balance)}</span>
                  </div>
                  <div className="debt-details">
                    <span>{debt.apr}% APR</span>
                    <span>Min: {formatCurrency(debt.minPayment)}</span>
                    <span>Due: {debt.dueDate}{debt.dueDate === 1 ? 'st' : debt.dueDate === 2 ? 'nd' : debt.dueDate === 3 ? 'rd' : 'th'}</span>
                    <button
                      className="btn-icon-only delete-btn"
                      onClick={() => dispatch({ type: 'DELETE_DEBT', payload: debt.id })}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>No debts tracked yet!</p>
                <span className="empty-hint">Add your first debt to start tracking payoff progress.</span>
              </div>
            )}
          </div>

          {showAddDebt ? (
            <div className="add-form">
              <input
                type="text"
                placeholder="Debt name"
                value={newDebt.name}
                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              />
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Balance"
                  value={newDebt.balance || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, balance: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="APR %"
                  value={newDebt.apr || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, apr: Number(e.target.value) })}
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Min payment"
                  value={newDebt.minPayment || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, minPayment: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Due date"
                  min="1"
                  max="31"
                  value={newDebt.dueDate || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: Number(e.target.value) })}
                />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary btn-sm" onClick={handleAddDebt}>Add Debt</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddDebt(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary add-btn" onClick={() => setShowAddDebt(true)}>
              <span className="btn-icon">➕</span> Add Debt
            </button>
          )}
        </div>

        {/* Income Goals */}
        <div className="money-card income-card">
          <div className="card-header">
            <h3>Income Goals</h3>
          </div>

          <div className="income-goal-section">
            <div className="goal-header">
              <span className="goal-label">Monthly Target</span>
              <span className="goal-value">{formatCurrency(state.incomeGoal.monthlyTarget)}</span>
            </div>
            <div className="goal-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(incomeProgress, 100)}%` }}
                />
              </div>
              <div className="progress-stats">
                <span className="current">{formatCurrency(state.incomeGoal.currentActual)}</span>
                <span className={`gap ${incomeGap > 0 ? 'negative' : 'positive'}`}>
                  {incomeGap > 0 ? `-${formatCurrency(incomeGap)} gap` : `+${formatCurrency(-incomeGap)} surplus`}
                </span>
              </div>
            </div>
          </div>

          <div className="income-streams">
            <h4>Income Streams</h4>
            {state.incomeStreams.length > 0 ? (
              state.incomeStreams.map((stream) => (
                <div key={stream.id} className="income-item">
                  <div className="income-main">
                    <span className="income-name">{stream.name}</span>
                    <span className="income-amount">{formatCurrency(stream.amount)}</span>
                  </div>
                  <div className="income-details">
                    <span className="income-freq">{stream.frequency}</span>
                    <span className="income-category">{stream.category}</span>
                    <button
                      className="btn-icon-only delete-btn"
                      onClick={() => dispatch({ type: 'DELETE_INCOME', payload: stream.id })}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state small">
                <p>No income streams added</p>
                <span className="empty-hint">Track your salary, freelance, and other income.</span>
              </div>
            )}
          </div>

          {showAddIncome ? (
            <div className="add-form">
              <input
                type="text"
                placeholder="Income source name"
                value={newIncome.name}
                onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
              />
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newIncome.amount || ''}
                  onChange={(e) => setNewIncome({ ...newIncome, amount: Number(e.target.value) })}
                />
                <select
                  value={newIncome.frequency}
                  onChange={(e) => setNewIncome({ ...newIncome, frequency: e.target.value as IncomeStream['frequency'] })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary btn-sm" onClick={handleAddIncome}>Add Income</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddIncome(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary add-btn" onClick={() => setShowAddIncome(true)}>
              <span className="btn-icon">➕</span> Add Income Stream
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
