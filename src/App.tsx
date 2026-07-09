import { Moon, Sun } from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

const siteName = import.meta.env.VITE_SITE_NAME || 'Your Site'
const siteBadge = import.meta.env.VITE_SITE_BADGE || 'STAGING'
const siteMessage =
  import.meta.env.VITE_SITE_MESSAGE ||
  'This site is currently in development. Check back soon!'
const backgroundImage =
  import.meta.env.VITE_BACKGROUND_IMAGE || '/coming-soon-bg.svg'
const isThemeToggleEnabled =
  import.meta.env.VITE_ENABLE_THEME_TOGGLE !== 'false'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

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
