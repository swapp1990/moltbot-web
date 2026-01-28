import { AppProvider } from './store/AppContext'
import Header from './components/Header'
import MoneyCommand from './components/MoneyCommand'
import TodayTomorrow from './components/TodayTomorrow'
import ProjectsSection from './components/ProjectsSection'
import './App.css'

declare const __BUILD_SHA__: string
declare const __BUILD_TIME__: string

function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-main">
        <MoneyCommand />
        <TodayTomorrow />
        <ProjectsSection />
      </main>
      <footer className="build-footer">
        Build: {__BUILD_SHA__} | Deployed: {__BUILD_TIME__}
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
