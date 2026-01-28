import { publicProjects } from '../data/publicProjects'
import './ProjectsSection.css'

const statusColors: Record<string, string> = {
  active: '#22c55e',
  paused: '#f59e0b',
  completed: '#60a5fa',
}

export default function ProjectsSection() {
  return (
    <section className="projects-section">
      <div className="section-header">
        <h2><span className="section-icon">🛠️</span> Projects</h2>
      </div>

      <div className="projects-grid">
        {publicProjects.map((project) => (
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

            <div className="project-description">
              {project.description}
            </div>

            <div className="project-link">
              View on GitHub →
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
