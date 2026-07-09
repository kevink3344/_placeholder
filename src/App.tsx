import { Moon, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

type SiteConfig = {
  VITE_SITE_NAME: string
  VITE_SITE_BADGE: string
  VITE_SITE_MESSAGE: string
  VITE_BACKGROUND_IMAGE: string
  VITE_ENABLE_THEME_TOGGLE: string
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [config, setConfig] = useState<SiteConfig>({
    VITE_SITE_NAME: 'Data Collection Portal',
    VITE_SITE_BADGE: 'STAGING',
    VITE_SITE_MESSAGE: 'This site is currently in development. Check back soon!',
    VITE_BACKGROUND_IMAGE: '/images/background.svg',
    VITE_ENABLE_THEME_TOGGLE: 'true',
  })

  useEffect(() => {
    fetch('/config')
      .then((r) => r.json())
      .then((data: SiteConfig) => setConfig(data))
      .catch(() => {})
  }, [])

  const siteName = config.VITE_SITE_NAME
  const siteBadge = config.VITE_SITE_BADGE
  const siteMessage = config.VITE_SITE_MESSAGE
  const backgroundImage = config.VITE_BACKGROUND_IMAGE
  const isThemeToggleEnabled = config.VITE_ENABLE_THEME_TOGGLE !== 'false'

  const pageStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(${isDarkMode ? '135deg, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.85)' : '135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.95)'}), url('${backgroundImage}')`,
    }),
    [backgroundImage, isDarkMode],
  )

  const contentClassName = isDarkMode ? 'coming-soon-content dark' : 'coming-soon-content light'

  return (
    <main className="coming-soon-page" style={pageStyle}>
      {isThemeToggleEnabled ? (
        <button
          type="button"
          className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
          onClick={() => setIsDarkMode((value) => !value)}
          aria-label="Toggle light and dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      ) : null}

      <section className={contentClassName}>
        <p className="eyebrow">Coming soon</p>
        <div className="title-row">
          <h1>{siteName}</h1>
          {siteBadge ? <span className="site-badge">{siteBadge}</span> : null}
        </div>
        <p className="message">{siteMessage}</p>
      </section>
    </main>
  )
}

export default App
