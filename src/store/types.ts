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

export const defaultState: AppState = {
  debts: [
    { id: '1', name: 'Chase Sapphire', balance: 4500, apr: 24.99, minPayment: 125, dueDate: 15, category: 'credit_card' },
    { id: '2', name: 'Student Loan', balance: 18000, apr: 5.5, minPayment: 250, dueDate: 1, category: 'loan' },
    { id: '3', name: 'Car Loan', balance: 12000, apr: 6.9, minPayment: 350, dueDate: 20, category: 'loan' },
  ],
  incomeStreams: [
    { id: '1', name: 'Primary Salary', amount: 8500, frequency: 'monthly', category: 'salary' },
    { id: '2', name: 'Freelance Dev', amount: 1200, frequency: 'monthly', category: 'freelance' },
    { id: '3', name: 'Dividend Income', amount: 150, frequency: 'monthly', category: 'investment' },
  ],
  incomeGoal: {
    monthlyTarget: 12000,
    currentActual: 9850,
  },
  payoffStrategy: 'avalanche',
  calendarEvents: [
    { id: '1', title: 'Team standup', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'meeting' },
    { id: '2', title: 'Flight to NYC', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], type: 'travel' },
  ],
  projects: [
    { id: '1', name: 'lmafy_lite', emoji: '🚀', status: 'active', nextMilestone: 'Complete LifeStream features', lastDeploy: '2026-01-28', repoUrl: 'https://github.com/swapp1990/lmafy_lite' },
    { id: '2', name: 'Vacation Photos', emoji: '📸', status: 'active', nextMilestone: 'App Clip polish', lastDeploy: '2026-01-27', repoUrl: 'https://github.com/swapp1990/vacation-photos' },
    { id: '3', name: 'LMWFY', emoji: '✍️', status: 'active', nextMilestone: 'App Store approval', lastDeploy: '2026-01-23', repoUrl: 'https://github.com/swapp1990/lmwfy-ios' },
    { id: '4', name: 'Moltbot Web', emoji: '🤖', status: 'active', nextMilestone: 'Backend integration', lastDeploy: new Date().toISOString().split('T')[0], repoUrl: 'https://github.com/swapp1990/moltbot-web' },
  ],
  todayFocus: '',
}
