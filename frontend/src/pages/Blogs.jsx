
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../App.css';
import './Blogs.css';

function formatDate(date) {
    if (!date) return 'Recently published';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getExcerpt(content) {
    if (!content) return 'Read our latest blog.';

    const plainText = content.replace(/<[^>]*>/g, '').trim();

    return plainText.length > 160
        ? `${plainText.slice(0, 160)}...`
        : plainText;
}

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await API.get('/api/blogs/published');

                const publishedBlogs = Array.isArray(response.data)
                    ? response.data
                    : response.data.blogs || [];

                setBlogs(publishedBlogs);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Unable to load blogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="site-wrapper">

            {/* Announcement bar */}
            <div className="announcement">
                <span>THE STORIES SHAPING TOMORROW</span>
                <span className="announcement-right">
                    INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.
                </span>
            </div>

            {/* Header */}
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
                    <Link to="/blogs" className="active">Blogs</Link>
                    <Link to="/#categories">Categories</Link>
                    <Link to="/#about">About</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/#newsletter" className="subscribe-button">
                        Subscribe ↗
                    </Link>
                </div>
            </header>

            <main className="blogs-page">

                {/* Page heading */}
                <section className="blogs-hero">
                    <div className="eyebrow">
                        THE CHRONICLEHUB JOURNAL
                    </div>

                    <h1>
                        Ideas worth <em>sharing.</em>
                    </h1>

                    <p>
                        Explore perspectives, experiences and ideas
                        from people shaping business, leadership
                        and the future.
                    </p>
                </section>

                {/* Blog listing */}
                <section className="blogs-listing">

                    <div className="blogs-listing-heading">
                        <div>
                            <div className="eyebrow">
                                EXPLORE OUR STORIES
                            </div>
                            <h2>All <em>blogs.</em></h2>
                        </div>

                        <span>
                            {blogs.length} PUBLISHED BLOGS
                        </span>
                    </div>

                    {loading ? (
                        <p className="blogs-message">
                            Loading published blogs...
                        </p>
                    ) : error ? (
                        <p className="blogs-message">
                            {error}
                        </p>
                    ) : blogs.length === 0 ? (
                        <p className="blogs-message">
                            No published blogs available yet.
                            Check back soon for new stories.
                        </p>
                    ) : (
                        <div className="blogs-grid">

                            {blogs.map((blog, index) => (
                                <article
                                    className="public-blog-card"
                                    key={blog.id}
                                >
                                    <Link
                                        to={`/blogs/${blog.id}`}
                                        className="public-blog-link"
                                    >
                                        <div className="public-blog-image">
                                            <img
                                                src={
                                                    blog.featured_image ||
                                                    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=850&q=85'
                                                }
                                                alt={blog.title}
                                                loading="lazy"
                                            />

                                            <span>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <div className="public-blog-meta">
                                            <span>BLOG</span>
                                            <span>
                                                {formatDate(
                                                    blog.published_at ||
                                                    blog.created_at
                                                )}
                                            </span>
                                        </div>

                                        <h3>{blog.title}</h3>

                                        <p>
                                            {getExcerpt(blog.content)}
                                        </p>
                                    </Link>

                                    <div className="public-blog-bottom">
                                        <span>
                                            By {blog.author_name ||
                                                'ChronicleHub Editorial Team'}
                                        </span>

                                        <Link
                                            to={`/blogs/${blog.id}`}
                                            aria-label={`Read ${blog.title}`}
                                        >
                                            Read More ↗
                                        </Link>
                                    </div>
                                </article>
                            ))}

                        </div>
                    )}
                </section>

            </main>

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-top">

                    <div className="footer-brand">
                        <Link to="/" className="brand-name">
                            Chronicle<span>Hub.</span>
                        </Link>

                        <p>
                            Ideas, people and stories
                            <br />
                            shaping tomorrow.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>EXPLORE</h4>
                        <Link to="/#magazines">Magazines</Link>
                        <Link to="/#articles">Latest stories</Link>
                        <Link to="/blogs">All blogs</Link>
                        <Link to="/#categories">Categories</Link>
                    </div>

                    <div className="footer-column">
                        <h4>CHRONICLEHUB</h4>
                        <Link to="/#about">About us</Link>
                        <Link to="/#newsletter">Newsletter</Link>
                        <a href="mailto:hello@chroniclehub.com">
                            Contact
                        </a>
                    </div>

                    <div className="footer-column">
                        <h4>FOLLOW ALONG</h4>
                        <a
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn ↗
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Instagram ↗
                        </a>
                    </div>

                </div>

                <div className="footer-bottom">
                    <span>
                        © 2026 CHRONICLEHUB. ALL RIGHTS RESERVED.
                    </span>
                    <span>
                        INDEPENDENT IDEAS. GLOBAL PERSPECTIVES.
                    </span>
                </div>
            </footer>

        </div>
    );
}

export default Blogs;
