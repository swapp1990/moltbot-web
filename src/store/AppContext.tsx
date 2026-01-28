import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, Debt, IncomeStream, CalendarEvent, Project } from './types'
import { defaultState } from './types'

const STORAGE_KEY = 'moltbot-life-command'

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_DEBT'; payload: Debt }
  | { type: 'UPDATE_DEBT'; payload: Debt }
  | { type: 'DELETE_DEBT'; payload: string }
  | { type: 'ADD_INCOME'; payload: IncomeStream }
  | { type: 'UPDATE_INCOME'; payload: IncomeStream }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'SET_INCOME_GOAL'; payload: { monthlyTarget?: number; currentActual?: number } }
  | { type: 'SET_PAYOFF_STRATEGY'; payload: 'avalanche' | 'snowball' }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'SET_TODAY_FOCUS'; payload: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload
    case 'ADD_DEBT':
      return { ...state, debts: [...state.debts, action.payload] }
    case 'UPDATE_DEBT':
      return { ...state, debts: state.debts.map(d => d.id === action.payload.id ? action.payload : d) }
    case 'DELETE_DEBT':
      return { ...state, debts: state.debts.filter(d => d.id !== action.payload) }
    case 'ADD_INCOME':
      return { ...state, incomeStreams: [...state.incomeStreams, action.payload] }
    case 'UPDATE_INCOME':
      return { ...state, incomeStreams: state.incomeStreams.map(i => i.id === action.payload.id ? action.payload : i) }
    case 'DELETE_INCOME':
      return { ...state, incomeStreams: state.incomeStreams.filter(i => i.id !== action.payload) }
    case 'SET_INCOME_GOAL':
      return { ...state, incomeGoal: { ...state.incomeGoal, ...action.payload } }
    case 'SET_PAYOFF_STRATEGY':
      return { ...state, payoffStrategy: action.payload }
    case 'ADD_EVENT':
      return { ...state, calendarEvents: [...state.calendarEvents, action.payload] }
    case 'UPDATE_EVENT':
      return { ...state, calendarEvents: state.calendarEvents.map(e => e.id === action.payload.id ? action.payload : e) }
    case 'DELETE_EVENT':
      return { ...state, calendarEvents: state.calendarEvents.filter(e => e.id !== action.payload) }
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'SET_TODAY_FOCUS':
      return { ...state, todayFocus: action.payload }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  exportJSON: () => void
  importData: (data: AppState) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'SET_STATE', payload: { ...defaultState, ...parsed } })
      } catch (e) {
        console.error('Failed to parse saved state:', e)
      }
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moltbot-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (data: AppState) => {
    dispatch({ type: 'SET_STATE', payload: { ...defaultState, ...data } })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, exportJSON, importData }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
