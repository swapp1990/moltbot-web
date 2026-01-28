import MorningDigest from './components/MorningDigest'
import './App.css'

declare const __BUILD_SHA__: string
declare const __BUILD_TIME__: string

function App() {
  return (
    <div className="app">
      <MorningDigest />

      <div className="app-content">
        <div className="brand">
          <span className="brand-icon">🤖</span>
          <h2 className="brand-title">Moltbot</h2>
          <p className="brand-tagline">Your AI assistant dashboard</p>
        </div>
      </div>

      <footer className="build-footer">
        Build: {__BUILD_SHA__} | Deployed: {__BUILD_TIME__}
      </footer>
    </div>
  )
}

export default App
