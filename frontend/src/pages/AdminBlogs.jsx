
import { Link } from 'react-router-dom'
import BlogManagement from './BlogManagement'
import './Admin.css'

function AdminBlogs() {
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          Chronicle<span>Hub.</span>
          <small>ADMINISTRATION</small>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-nav">
          <Link to="/admin">
            ▦ <span>Dashboard</span>
          </Link>

          <a href="/admin#magazines">
            ▤ <span>Magazines</span>
          </a>

          <a href="/admin#articles">
            ▧ <span>Articles</span>
          </a>

          <a href="/admin#categories">
            ◈ <span>Categories</span>
          </a>

          <Link to="/admin/blogs" className="active">
            ✎ <span>Blogs</span>
          </Link>

          <a href="/admin#news">
            ▤ <span>News</span>
          </a>
        </nav>

        <div className="sidebar-label">MANAGEMENT</div>

        <nav className="admin-nav">
          <a href="/admin#subscribers">
            ♙ <span>Subscribers</span>
          </a>

          <a href="/admin#media">
            ▧ <span>Media Library</span>
          </a>

          <a href="/admin#settings">
            ⚙ <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">AJ</div>

          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>

      </aside>

      {/* Blogs Management Main Content */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">
              Workspace / Blogs
            </span>

            <h1>Blogs Management</h1>
          </div>

          <div className="admin-top-actions">
            <a href="/" className="view-site-link">
              ↗ View Website
            </a>

            <div className="admin-profile">AJ</div>
          </div>
        </header>

        {/* Page Introduction */}
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              CONTENT MANAGEMENT
            </span>

            <h2>Manage your blogs.</h2>

            <p>
              Create, edit, schedule and publish blog posts on ChronicleHub.
            </p>
          </div>
        </section>

        {/* Existing Blog Management Component */}
        <BlogManagement />

        {/* Footer */}
        <footer className="admin-footer">
          © 2026 ChronicleHub · Admin Panel
        </footer>

      </main>

    </div>
  )
}

export default AdminBlogs
