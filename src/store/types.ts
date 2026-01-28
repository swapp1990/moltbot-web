export interface Debt {
  id: string
  name: string
  balance: number
  apr: number
  minPayment: number
  dueDate: number // day of month
  category: 'credit_card' | 'loan' | 'mortgage' | 'other'
}

export interface IncomeStream {
  id: string
  name: string
  amount: number
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'one_time'
  category: 'salary' | 'freelance' | 'investment' | 'side_hustle' | 'other'
}

export interface IncomeGoal {
  monthlyTarget: number
  currentActual: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date
  time?: string
  type: 'meeting' | 'travel' | 'deadline' | 'reminder' | 'other'
}

export interface Project {
  id: string
  name: string
  emoji: string
  status: 'active' | 'paused' | 'completed'
  nextMilestone: string
  lastDeploy?: string
  repoUrl: string
}

export interface AppState {
  debts: Debt[]
  incomeStreams: IncomeStream[]
  incomeGoal: IncomeGoal
  payoffStrategy: 'avalanche' | 'snowball'
  calendarEvents: CalendarEvent[]
  projects: Project[]
  todayFocus: string
}

// Demo data - clearly fake examples for illustration
export const defaultState: AppState = {
  debts: [
    { id: '1', name: 'Sample Credit Card', balance: 1234, apr: 19.99, minPayment: 50, dueDate: 15, category: 'credit_card' },
    { id: '2', name: 'Example Loan', balance: 5000, apr: 6.5, minPayment: 100, dueDate: 1, category: 'loan' },
  ],
  incomeStreams: [
    { id: '1', name: 'Sample Salary', amount: 5000, frequency: 'monthly', category: 'salary' },
    { id: '2', name: 'Example Side Gig', amount: 500, frequency: 'monthly', category: 'freelance' },
  ],
  incomeGoal: {
    monthlyTarget: 6000,
    currentActual: 5500,
  },
  payoffStrategy: 'avalanche',
  calendarEvents: [
    { id: '1', title: 'Sample Meeting', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'meeting' },
    { id: '2', title: 'Example Trip', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], type: 'travel' },
  ],
  projects: [
    { id: '1', name: 'Sample Project', emoji: '🚀', status: 'active', nextMilestone: 'Add new feature', lastDeploy: '2026-01-01', repoUrl: 'https://github.com/example/sample-project' },
    { id: '2', name: 'Demo App', emoji: '📱', status: 'active', nextMilestone: 'Launch MVP', lastDeploy: '2026-01-01', repoUrl: 'https://github.com/example/demo-app' },
  ],
  todayFocus: '',
}
