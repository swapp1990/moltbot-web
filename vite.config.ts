import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const getGitSha = () => {
  // Prefer environment variable (set during Docker build via GitHub Actions)
  if (process.env.VITE_GIT_SHA && process.env.VITE_GIT_SHA !== 'unknown') {
    return process.env.VITE_GIT_SHA
  }
  // Fallback to git command for local development
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

const getBuildTime = () => {
  // Prefer environment variable (set during Docker build via GitHub Actions)
  if (process.env.VITE_BUILD_TIME && process.env.VITE_BUILD_TIME !== 'unknown') {
    return process.env.VITE_BUILD_TIME
  }
  return new Date().toISOString()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify(getGitSha()),
    __BUILD_TIME__: JSON.stringify(getBuildTime()),
  },
})
