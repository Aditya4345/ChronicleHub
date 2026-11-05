
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import '../App.css'

function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await API.get('/api/news')

        const publishedNews = (response.data.news || []).filter(
          (item) => item.status === 'published'
        )

        setNews(publishedNews)
      } catch (err) {
        console.error('News loading error:', err)
        setError('Unable to load news. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
  <div className="site-wrapper">

    {/* Announcement bar */}
    <div className="announcement">
      <span>THE STORIES SHAPING TOMORROW</span>
      <span className="announcement-right">
        INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.
      </span>
    </div>

    <header className="main-header">
  <Link to="/" className="brand">
    <span className="brand-name">
      Chronicle<span>Hub.</span>
    </span>
    <span className="brand-caption">
      THE BUSINESS & LEADERSHIP JOURNAL
    </span>
  </Link>

  <nav className="main-nav">
    <Link to="/">Home</Link>
    <Link to="/#magazines">Magazines</Link>
    <Link to="/#articles">Stories</Link>
    <Link to="/news" className="active">News</Link>
    <Link to="/#categories">Categories</Link>
    <Link to="/#about">About</Link>
  </nav>

  <div className="header-actions">
    <Link to="/#newsletter" className="subscribe-button">
      Subscribe ↗
    </Link>
  </div>
</header>


      <main>
        <section className="section articles-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">LATEST UPDATES</div>
              <h2>News & <em>Updates.</em></h2>
            </div>
            <span className="article-count">
              CHRONICLEHUB NEWS
            </span>
          </div>

          {loading ? (
            <p>Loading news...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : news.length === 0 ? (
            <p className="empty-state">
              No published news available yet.
            </p>
          ) : (
            <div className="articles-grid">
              {news.map((item, index) => (
                <article className="article-card" key={item.id}>
                  {item.featured_image && (
                    <div className="article-image">
                      <img
                        src={item.featured_image}
                        alt={item.title}
                        loading="lazy"
                      />
                      <span className="article-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  <div className="article-meta">
                    <span>NEWS</span>
                    <span>
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : 'Recently published'}
                    </span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>
                    {item.summary || 'Read the latest update from ChronicleHub.'}
                  </p>

                  {item.content && (
                    <details>
                      <summary>Read full story</summary>
                      <p>{item.content}</p>
                    </details>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-bottom">
          <span>© 2026 CHRONICLEHUB. ALL RIGHTS RESERVED.</span>
          <Link to="/">Back to Home</Link>
        </div>
      </footer>
    </div>
  )
}

export default News
