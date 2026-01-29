import { AppProvider } from './store/AppContext'
import AboutBanner from './components/AboutBanner'
import StatusPulse from './components/StatusPulse'
import Header from './components/Header'
import MorningDigest from './components/MorningDigest'
import MoneyCommand from './components/MoneyCommand'
import TodayTomorrow from './components/TodayTomorrow'
import ProjectsSection from './components/ProjectsSection'
import BuildFooter from './components/BuildFooter'
import './App.css'

declare const __BUILD_SHA__: string
declare const __BUILD_TIME__: string

function Dashboard() {
  return (
    <div className="dashboard">
      <AboutBanner />
      <StatusPulse />
      <Header />
      <main className="dashboard-main">
        <MorningDigest />
        <MoneyCommand />
        <TodayTomorrow />
        <ProjectsSection />
      </main>
      <BuildFooter sha={__BUILD_SHA__} time={__BUILD_TIME__} />
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
