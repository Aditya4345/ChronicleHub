
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';
import '../App.css';
import './BlogDetails.css';

function formatDate(date) {
    if (!date) return 'Recently published';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function BlogDetails() {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError('');
                setBlog(null);

                const response = await API.get('/api/blogs/published');

                const publishedBlogs = Array.isArray(response.data)
                    ? response.data
                    : response.data.blogs || [];

                const selectedBlog = publishedBlogs.find(
                    (item) => String(item.id) === String(id)
                );

                if (!selectedBlog) {
                    setError('This blog does not exist or is no longer available.');
                    return;
                }

                setBlog(selectedBlog);

            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Unable to load this blog. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

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
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/#categories">Categories</Link>
                    <Link to="/#about">About</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/#newsletter" className="subscribe-button">
                        Subscribe ↗
                    </Link>
                </div>
            </header>

            <main className="blog-details-page">

                {loading ? (
                    <div className="blog-details-message">
                        Loading blog...
                    </div>
                ) : error ? (
                    <div className="blog-details-message">
                        <h2>Blog unavailable</h2>
                        <p>{error}</p>
                        <Link to="/blogs" className="blog-back-link">
                            ← Back to all blogs
                        </Link>
                    </div>
                ) : blog && (
                    <article className="blog-article">

                        {/* Breadcrumb */}
                        <div className="blog-breadcrumb">
                            <Link to="/">Home</Link>
                            <span>/</span>
                            <Link to="/blogs">Blogs</Link>
                            <span>/</span>
                            <span>Article</span>
                        </div>

                        {/* Blog heading */}
                        <header className="blog-article-header">
                            <div className="eyebrow">
                                CHRONICLEHUB JOURNAL
                            </div>

                            <h1>{blog.title}</h1>

                            <div className="blog-article-meta">
                                <span>
                                    By {blog.author_name ||
                                        'ChronicleHub Editorial Team'}
                                </span>

                                <span>
                                    {formatDate(
                                        blog.published_at ||
                                        blog.created_at
                                    )}
                                </span>
                            </div>
                        </header>

                        {/* Featured image */}
                        {blog.featured_image && (
                            <div className="blog-details-image">
                                <img
                                    src={blog.featured_image}
                                    alt={blog.title}
                                />
                            </div>
                        )}

                        {/* Blog content */}
                        <div className="blog-article-content">
                            {(blog.content || '')
                                .split(/\r?\n/)
                                .map((paragraph, index) => (
                                    paragraph.trim() ? (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ) : null
                                ))}
                        </div>

                        {/* Back to blogs */}
                        <div className="blog-details-footer">
                            <Link to="/blogs" className="blog-back-link">
                                ← Back to all blogs
                            </Link>
                        </div>

                    </article>
                )}

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

export default BlogDetails;
