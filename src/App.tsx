import './App.css'

const siteName = import.meta.env.VITE_SITE_NAME || 'Your Site'
const siteMessage =
  import.meta.env.VITE_SITE_MESSAGE ||
  'This site is currently in development. Check back soon!'
const backgroundImage =
  import.meta.env.VITE_BACKGROUND_IMAGE || '/coming-soon-bg.svg'
const siteLogo = import.meta.env.VITE_SITE_LOGO || ''

function App() {
  return (
    <main
      className="coming-soon-page"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(6, 10, 24, 0.88), rgba(17, 24, 39, 0.72)), url('${backgroundImage}')`,
      }}
    >
      <section className="coming-soon-content">
        {siteLogo ? (
          <img className="site-logo" src={siteLogo} alt={`${siteName} logo`} />
        ) : null}
        <p className="eyebrow">Coming soon</p>
        <h1>{siteName}</h1>
        <p className="message">{siteMessage}</p>
      </section>
    </main>
  )
}

export default App
