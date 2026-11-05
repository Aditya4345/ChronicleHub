
import { useState, useEffect } from 'react'
import API from '../api'
import '../App.css'
import { Link } from 'react-router-dom'

const magazines = [
  {
    title: 'The Future of Leadership',
    category: 'LEADERSHIP',
    issue: 'VOL. 08 / 2026',
    image: 'photo-1497366754035-f200968a6e72',
  },
  {
    title: 'Technology That Matters',
    category: 'TECHNOLOGY',
    issue: 'VOL. 07 / 2026',
    image: 'photo-1519389950473-47ba0277781c',
  },
  {
    title: 'The Startup Generation',
    category: 'STARTUPS',
    issue: 'VOL. 06 / 2026',
    image: 'photo-1552664730-d307ca884978',
  },
]

const articles = [
  {
    category: 'BUSINESS',
    title: 'The New Rules of Building a Successful Business',
    description: 'How modern founders are changing the way companies grow and compete.',
    author: 'Editorial Team',
    date: 'October 28, 2026',
    image: 'photo-1486406146926-c627a92ad1ab',
  },
  {
    category: 'LEADERSHIP',
    title: 'Leadership in an Era of Constant Change',
    description: 'Why adaptability and vision matter more than ever for business leaders.',
    author: 'Editorial Team',
    date: 'October 25, 2026',
    image: 'photo-1521737711867-e3b97375f902',
  },
  {
    category: 'TECHNOLOGY',
    title: 'How Innovation Is Reshaping the Future',
    description: 'Exploring the ideas and technologies transforming our world.',
    author: 'Editorial Team',
    date: 'October 21, 2026',
    image: 'photo-1518770660439-4636190af475',
  },
]

const categories = ['All', 'Business', 'Leadership', 'Technology', 'Startups', 'Innovation']

function imageUrl(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

function Home() {
    const [publishedNews, setPublishedNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    const fetchPublishedNews = async () => {
      try {
        const response = await API.get('/api/news')

        const published = (response.data.news || []).filter(
          (item) => item.status === 'published'
        )

        setPublishedNews(published)
      } catch (error) {
        console.error('Failed to fetch published news:', error)
      } finally {
        setNewsLoading(false)
      }
    }

    fetchPublishedNews()
  }, [])
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === 'All' ||
      article.category.toLowerCase() === activeCategory.toLowerCase()

    const matchesSearch =
      `${article.title} ${article.description} ${article.category}`
        .toLowerCase()
        .includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  function handleSubscribe(event) {
    event.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="site-wrapper">
      {/* Announcement bar */}
      <div className="announcement">
        <span>THE STORIES SHAPING TOMORROW</span>
        <span className="announcement-right">INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.</span>
      </div>

      {/* Header */}
      <header className="main-header">
        <a href="#home" className="brand">
          <span className="brand-name">Chronicle<span>Hub.</span></span>
          <span className="brand-caption">THE BUSINESS & LEADERSHIP JOURNAL</span>
        </a>

        <nav className="main-nav">
          <a href="#home">Home</a>
          <a href="#magazines">Magazines</a>
          <a href="#articles">Stories</a>
          <Link to="/news">News</Link>
          <a href="#categories">Categories</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button
            className="search-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            {searchOpen ? 'âœ•' : 'âŒ•'}
          </button>
          <a href="#newsletter" className="subscribe-button">Subscribe â†—</a>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <input
            type="search"
            placeholder="Search stories and topics..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
          <button onClick={() => { setSearch(''); setSearchOpen(false) }}>
            Clear
          </button>
        </div>
      )}

      <main>
        {/* Hero */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow"><span></span> IDEAS THAT MOVE THE WORLD</div>
            <h1>Stories of ambition.<br />Ideas that <em>inspire.</em></h1>
            <p>
              Discover the people, businesses and bold ideas shaping
              the future of leadership, innovation and entrepreneurship.
            </p>
            <div className="hero-buttons">
              <a href="#magazines" className="primary-button">Explore magazines â†—</a>
              <a href="#articles" className="text-button">Read our stories â†’</a>
            </div>
            <div className="hero-note">
              <span className="note-line"></span>
              A NEW PERSPECTIVE ON BUSINESS AND BEYOND
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image">
              <img
                src={imageUrl('photo-1497366811353-6870744d04b2', 1200)}
                alt="Modern workspace with a view"
              />
              <div className="hero-image-overlay"></div>
              <div className="hero-image-caption">
                <span>THE NEXT CHAPTER</span>
                <strong>Building a better<br />business future.</strong>
              </div>
            </div>
            <div className="hero-stamp">
              <span>CH</span>
              <small>EST.<br />2026</small>
            </div>
          </div>
        </section>

        {/* Editorial strip */}
        <div className="editorial-strip">
          <span>BUSINESS</span><i>âœ³</i>
          <span>LEADERSHIP</span><i>âœ³</i>
          <span>INNOVATION</span><i>âœ³</i>
          <span>ENTREPRENEURSHIP</span><i>âœ³</i>
          <span>THE FUTURE</span>
        </div>

        {/* Featured magazines */}
        <section className="section magazine-section" id="magazines">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE LATEST EDITIONS</div>
              <h2>Stories worth <em>holding.</em></h2>
            </div>
            <a href="#newsletter" className="view-all">Discover all editions â†—</a>
          </div>

          <div className="magazine-grid">
            {magazines.map((magazine, index) => (
              <article className="magazine-card" key={magazine.title}>
                <div className="magazine-image">
                  <img
                    src={imageUrl(magazine.image, 850)}
                    alt={magazine.title}
                    loading="lazy"
                  />
                  <span className="issue-label">{magazine.issue}</span>
                  <span className="cover-number">0{index + 1}</span>
                </div>
                <div className="magazine-info">
                  <span className="card-category">{magazine.category}</span>
                  <h3>{magazine.title}</h3>
                  <a href="#newsletter">Explore edition â†—</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Featured editorial */}
        <section className="feature-section" id="about">
          <div className="feature-image">
            <img
              src={imageUrl('photo-1524758631624-e2822e304c36', 1200)}
              alt="Creative modern office"
              loading="lazy"
            />
          </div>
          <div className="feature-content">
            <div className="eyebrow">BEYOND THE HEADLINES</div>
            <h2>Every great story begins with a <em>vision.</em></h2>
            <p>
              ChronicleHub brings forward the voices, journeys and
              perspectives of people making a difference. We believe
              every ambitious idea deserves a platform.
            </p>
            <a href="#articles" className="primary-button">Discover our world â†—</a>
          </div>
        </section>

        {/* Latest articles */}
        <section className="section articles-section" id="articles">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE EDITOR'S DESK</div>
              <h2>Ideas in <em>focus.</em></h2>
            </div>
            <span className="article-count">LATEST STORIES / 2026</span>
          </div>

          <div className="category-filters" id="categories">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'filter active' : 'filter'}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="articles-grid">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <article className="article-card" key={article.title}>
                  <div className="article-image">
                    <img
                      src={imageUrl(article.image, 850)}
                      alt={article.title}
                      loading="lazy"
                    />
                    <span className="article-index">0{index + 1}</span>
                  </div>
                  <div className="article-meta">
                    <span>{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="article-bottom">
                    <span>By {article.author}</span>
                    <a href="#newsletter" aria-label={`Read ${article.title}`}>â†—</a>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-state">No stories found. Try another search or category.</p>
            )}
          </div>
        </section>
{/* Latest News from Admin */}
<section className="section articles-section" id="latest-news">
  <div className="section-heading">
    <div>
      <div className="eyebrow">FRESH FROM THE NEWSROOM</div>
      <h2>Latest <em>News.</em></h2>
    </div>
    <span className="article-count">CHRONICLEHUB NEWS</span>
  </div>

  {newsLoading ? (
    <p>Loading latest news...</p>
  ) : publishedNews.length === 0 ? (
    <p className="empty-state">No published news available yet.</p>
  ) : (
    <div className="articles-grid">
      {publishedNews.map((item, index) => (
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
          <p>{item.summary || 'Read the latest update from ChronicleHub.'}</p>
          <div className="article-bottom">
            <span>By Editorial Team</span>
          </div>
        </article>
      ))}
    </div>
  )}
</section>

        {/* Locations */}
        <section className="locations-section" id="locations">
          <div className="locations-title-wrap">
            <div className="eyebrow">FIND CHRONICLEHUB</div>
            <h2>Our New York <em>office.</em></h2>
            <p>Our editorial home for conversations, ideas and stories shaping what comes next.</p>
          </div>

          <div className="locations-layout">
            <div className="location-info-card">
              <span className="location-card-label">EDITORIAL OFFICE</span>
              <h3 className="location-address">ChronicleHub</h3>
              <p className="location-address-detail">45 Market Street<br />New York, NY 10013</p>
              <p className="location-note">For editorial, partnership and reader inquiries, get in touch or find us on the map.</p>

              <a
                className="maps-button"
                href="https://www.google.com/maps/search/?api=1&query=45+Market+Street%2C+New+York%2C+NY+10013"
                target="_blank"
                rel="noreferrer"
              >
                <span className="maps-icon" aria-hidden="true">↗</span>
                Get directions
              </a>
            </div>

            <iframe
              className="map-panel"
              title="Interactive map showing ChronicleHub's New York office"
              src="https://maps.google.com/maps?q=45%20Market%20Street%2C%20New%20York%2C%20NY%2010013&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        {/* Newsletter */}        
        <section className="newsletter-section" id="newsletter">
          <div className="newsletter-content">
            <div className="eyebrow">THE CHRONICLE LETTER</div>
            <h2>A little inspiration.<br /><em>Delivered.</em></h2>
            <p>Get thoughtful stories, fresh perspectives and the latest editions delivered to your inbox.</p>
          </div>
          <div className="newsletter-form-area">
            {subscribed ? (
              <p className="success-message">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label>
                <div className="email-input-wrap">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <button type="submit">JOIN US â†—</button>
                </div>
                <small>By subscribing, you agree to receive ChronicleHub updates.</small>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="brand-name">Chronicle<span>Hub.</span></a>
            <p>Ideas, people and stories<br />shaping tomorrow.</p>
          </div>
          <div className="footer-column">
            <h4>EXPLORE</h4>
            <a href="#magazines">Magazines</a>
            <a href="#articles">Latest stories</a>
            <a href="#categories">Categories</a>
          </div>
          <div className="footer-column">
            <h4>CHRONICLEHUB</h4>
            <a href="/about">About us</a>
            <a href="#newsletter">Newsletter</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-column">
            <h4>FOLLOW ALONG</h4>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn â†—</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram â†—</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Â© 2026 CHRONICLEHUB. ALL RIGHTS RESERVED.</span>
          <span>INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
