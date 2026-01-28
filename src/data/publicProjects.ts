// Public project showcase - real GitHub links, non-sensitive info only
export interface PublicProject {
  id: string
  name: string
  emoji: string
  description: string
  status: 'active' | 'paused' | 'completed'
  repoUrl: string
}

export const publicProjects: PublicProject[] = [
  {
    id: '1',
    name: 'Moltbot Web',
    emoji: '🤖',
    description: 'Personal life command center dashboard',
    status: 'active',
    repoUrl: 'https://github.com/swapp1990/moltbot-web',
  },
  {
    id: '2',
    name: 'lmafy_lite',
    emoji: '🚀',
    description: 'Async job processing platform with AI workflows',
    status: 'active',
    repoUrl: 'https://github.com/swapp1990/lmafy_lite',
  },
  {
    id: '3',
    name: 'Vacation Photos',
    emoji: '📸',
    description: 'iOS app for organizing travel memories',
    status: 'active',
    repoUrl: 'https://github.com/swapp1990/vacation-photos',
  },
  {
    id: '4',
    name: 'LMWFY',
    emoji: '✍️',
    description: 'Writing assistant iOS app',
    status: 'active',
    repoUrl: 'https://github.com/swapp1990/lmwfy-ios',
  },
]
