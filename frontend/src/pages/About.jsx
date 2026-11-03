import '../App.css'

const imageUrl =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85'

function About() {
  return (
    <div className="site-wrapper about-page">
      <div className="announcement">
        <span>THE STORIES SHAPING TOMORROW</span>
        <span className="announcement-right">INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.</span>
      </div>

      <header className="main-header">
        <a href="/" className="brand">
          <span className="brand-name">Chronicle<span>Hub.</span></span>
          <span className="brand-caption">THE BUSINESS &amp; LEADERSHIP JOURNAL</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/#magazines">Magazines</a>
          <a href="/#articles">Stories</a>
          <a href="/#categories">Categories</a>
          <a href="/about" aria-current="page">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a href="/#newsletter" className="subscribe-button">Subscribe</a>
        </div>
      </header>

      <main>
        <section className="about-page-hero">
          <div className="eyebrow">WHO WE ARE</div>
          <h1>Ideas, people and stories <em>shaping tomorrow.</em></h1>
          <p>
            ChronicleHub is an independent editorial platform for curious minds and
            ambitious people, sharing thoughtful perspectives on business, leadership,
            innovation and the people moving them forward.
          </p>
        </section>

        <section className="about-us-section about-page-content">
          <div className="about-us-grid">
            <div className="about-copy">
              <div className="eyebrow">OUR PURPOSE</div>
              <h2>Every ambitious idea deserves a <em>platform.</em></h2>
              <p>
                We bring together thoughtful reporting, sharp analysis and a global
                outlook to help readers stay informed and inspired. Our stories look
                beyond the headlines to explore the choices, challenges and ideas
                shaping the future.
              </p>
              <p>
                Our mission is to make meaningful insight accessible to founders,
                leaders, creatives, students and teams building what comes next.
              </p>

              <div className="about-stats">
                <div>
                  <strong>Curious</strong>
                  <span>We ask better questions.</span>
                </div>
                <div>
                  <strong>Independent</strong>
                  <span>We value fresh perspectives.</span>
                </div>
                <div>
                  <strong>Global</strong>
                  <span>We learn from every viewpoint.</span>
                </div>
              </div>
            </div>

            <div className="about-visual">
              <img src={imageUrl} alt="A team sharing ideas around a table" />
            </div>
          </div>
        </section>

        <section className="about-page-cta">
          <div>
            <div className="eyebrow">EXPLORE CHRONICLEHUB</div>
            <h2>Find your next <em>perspective.</em></h2>
          </div>
          <a href="/#articles" className="primary-button">Read our stories</a>
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-bottom">
          <span>© 2026 CHRONICLEHUB. ALL RIGHTS RESERVED.</span>
          <a href="/">Back to home</a>
        </div>
      </footer>
    </div>
  )
}

export default About
