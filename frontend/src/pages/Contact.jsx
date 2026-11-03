import '../App.css'

function Contact() {
  return (
    <div className="site-wrapper contact-page">
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
          <a href="/about">About</a>
          <a href="/contact" aria-current="page">Contact</a>
        </nav>

        <div className="header-actions">
          <a href="/#newsletter" className="subscribe-button">Subscribe</a>
        </div>
      </header>

      <main>
        <section className="contact-page-hero">
          <div className="eyebrow">LET'S START A CONVERSATION</div>
          <h1>Good stories start with <em>a hello.</em></h1>
          <p>
            Questions, story ideas, partnerships or feedback? The ChronicleHub team
            would love to hear from you.
          </p>
        </section>

        <section className="contact-section contact-page-content">
          <div className="contact-grid">
            <div className="contact-card contact-info-card">
              <span className="location-card-label">CHRONICLEHUB EDITORIAL</span>
              <h3>Say hello.</h3>
              <p>Reach our team for editorial, reader and partnership inquiries.</p>

              <ul>
                <li>
                  <span>EMAIL</span>
                  <a href="mailto:hello@chroniclehub.com">hello@chroniclehub.com</a>
                </li>
                <li>
                  <span>PHONE</span>
                  <a href="tel:+1-555-014-5018">+1 (555) 014-5018</a>
                </li>
                <li>
                  <span>OFFICE</span>
                  <address>45 Market Street<br />New York, NY 10013</address>
                </li>
              </ul>

              <a
                className="maps-button contact-directions"
                href="https://www.google.com/maps/search/?api=1&query=45+Market+Street%2C+New+York%2C+NY+10013"
                target="_blank"
                rel="noreferrer"
              >
                <span className="maps-icon" aria-hidden="true">↗</span>
                Visit us in New York
              </a>
            </div>

            <div className="contact-card contact-form-card">
              <div className="location-card-label">SEND A NOTE</div>
              <form className="contact-form">
                <div className="field-row">
                  <label>
                    Name
                    <input type="text" name="name" placeholder="Your name" />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" placeholder="Your email" />
                  </label>
                </div>

                <label>
                  Subject
                  <input type="text" name="subject" placeholder="What is this about?" />
                </label>

                <label>
                  Message
                  <textarea name="message" rows="6" placeholder="Tell us a little more" />
                </label>

                <button type="submit" className="primary-button">Send message</button>
              </form>
            </div>
          </div>
        </section>

        <section className="contact-location">
          <div className="locations-title-wrap">
            <div className="eyebrow">OUR EDITORIAL HOME</div>
            <h2>Meet us in <em>New York.</em></h2>
            <p>ChronicleHub’s office at 45 Market Street, New York, NY 10013.</p>
          </div>
          <iframe
            className="map-panel"
            title="Interactive map showing ChronicleHub's New York office"
            src="https://maps.google.com/maps?q=45%20Market%20Street%2C%20New%20York%2C%20NY%2010013&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
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

export default Contact
