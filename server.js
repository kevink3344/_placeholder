import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { runMigration } from './scripts/migrate.js'

const app = express()
const port = process.env.PORT || 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/config', (_req, res) => {
  res.json({
    VITE_SITE_LOGO: process.env.VITE_SITE_LOGO ?? '/images/logo.svg',
    VITE_SITE_NAME: process.env.VITE_SITE_NAME ?? 'Data Collection Portal',
    VITE_SITE_BADGE: process.env.VITE_SITE_BADGE ?? 'STAGING',
    VITE_SITE_MESSAGE: process.env.VITE_SITE_MESSAGE ?? 'This site is currently in development. Check back soon!',
    VITE_BACKGROUND_IMAGE: process.env.VITE_BACKGROUND_IMAGE ?? '/images/background.svg',
    VITE_ENABLE_THEME_TOGGLE: process.env.VITE_ENABLE_THEME_TOGGLE ?? 'true',
  })
})

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Run DB migration on startup (safe to re-run — drops and recreates schema)
runMigration()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Startup migration failed:', err.message)
    console.warn('Starting server without completed migration')
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
