import { useApp } from '../store/AppContext'
import './ProjectsSection.css'

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const statusColors: Record<string, string> = {
  active: '#22c55e',
  paused: '#f59e0b',
  completed: '#60a5fa',
}

export default function ProjectsSection() {
  const { state } = useApp()

  return (
    <section className="projects-section">
      <div className="section-header">
        <h2><span className="section-icon">🛠️</span> Projects</h2>
      </div>

      <div className="projects-grid">
        {state.projects.map((project) => (
          <a
            key={project.id}
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
          >
            <div className="project-header">
              <span className="project-emoji">{project.emoji}</span>
              <div className="project-title-group">
                <h3 className="project-name">{project.name}</h3>
                <span
                  className="project-status"
                  style={{ color: statusColors[project.status] }}
                >
                  <span className="status-dot" style={{ background: statusColors[project.status] }} />
                  {project.status}
                </span>
              </div>
            </div>

            <div className="project-milestone">
              <span className="milestone-label">Next milestone</span>
              <span className="milestone-text">{project.nextMilestone}</span>
            </div>

            {project.lastDeploy && (
              <div className="project-deploy">
                <span className="deploy-icon">🚀</span>
                <span className="deploy-text">
                  Last deploy: {formatRelativeDate(project.lastDeploy)}
                </span>
              </div>
            )}

            <div className="project-link">
              View on GitHub →
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
