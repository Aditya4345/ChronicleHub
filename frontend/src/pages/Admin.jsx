import './Admin.css'

const stats = [
  { title: 'Total Magazines', value: '24', change: '+12%', icon: '▤' },
  { title: 'Published Articles', value: '86', change: '+8%', icon: '▧' },
  { title: 'Total Subscribers', value: '1,240', change: '+18%', icon: '♙' },
  { title: 'Pending Reviews', value: '07', change: 'Needs attention', icon: '◷' },
]

const magazines = [
  { title: 'The Future of Leadership', issue: 'Volume 08 · 2026', status: 'Published', date: 'Oct 28, 2026' },
  { title: 'Technology That Matters', issue: 'Volume 07 · 2026', status: 'Published', date: 'Oct 22, 2026' },
  { title: 'The Startup Generation', issue: 'Volume 06 · 2026', status: 'Draft', date: 'Oct 18, 2026' },
  { title: 'Ideas for Tomorrow', issue: 'Volume 05 · 2026', status: 'Review', date: 'Oct 15, 2026' },
]

const activities = [
  { title: 'New magazine created', detail: 'The Future of Leadership', time: '2 hours ago' },
  { title: 'Article published', detail: 'Leadership in an Era of Change', time: 'Yesterday' },
  { title: 'New subscriber registered', detail: 'A new newsletter subscriber joined', time: 'Yesterday' },
]

function Admin() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          Chronicle<span>Hub.</span>
          <small>ADMINISTRATION</small>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-nav">
          <a href="/admin" className="active">▦ <span>Dashboard</span></a>
          <a href="#magazines">▤ <span>Magazines</span></a>
          <a href="#articles">▧ <span>Articles</span></a>
          <a href="#categories">◈ <span>Categories</span></a>
          <a href="#blogs">✎ <span>Blogs</span></a>
          <a href="#news">▤ <span>News</span></a>
        </nav>
        <div className="sidebar-label">MANAGEMENT</div>

        <nav className="admin-nav">
          <a href="#subscribers">♙ <span>Subscribers</span></a>
          <a href="#media">▧ <span>Media Library</span></a>
          <a href="#settings">⚙ <span>Settings</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">AJ</div>
          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">Workspace / Overview</span>
            <h1>Dashboard</h1>
          </div>

          <div className="admin-top-actions">
            <a href="/" className="view-site-link">↗ View Website</a>
            <div className="admin-profile">AJ</div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">SATURDAY, OCTOBER 31, 2026</span>
            <h2>Welcome back, Admin.</h2>
            <p>Here's what's happening with your magazine platform today.</p>
          </div>
          <button className="create-magazine-btn" onClick={() => alert('Magazine creation form will be added in the next step.')}>
            + Create Magazine
          </button>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <span>{stat.title}</span>
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <strong>{stat.value}</strong>
              <small>{stat.change}</small>
            </article>
          ))}
        </section>

        <section className="admin-content-grid">
          <div className="admin-panel magazines-panel" id="magazines">
            <div className="panel-heading">
              <div>
                <h3>Recent Magazines</h3>
                <p>Manage your latest magazine editions</p>
              </div>
              <a href="#magazines">View all ↗</a>
            </div>

            <div className="magazine-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>MAGAZINE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {magazines.map((magazine) => (
                    <tr key={magazine.title}>
                      <td>
                        <strong>{magazine.title}</strong>
                        <small>{magazine.issue}</small>
                      </td>
                      <td>
                        <span className={`status-badge ${magazine.status.toLowerCase()}`}>
                          {magazine.status}
                        </span>
                      </td>
                      <td>{magazine.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel activity-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Activity</h3>
                <p>Latest platform updates</p>
              </div>
            </div>

            <div className="activity-list">
              {activities.map((activity) => (
                <div className="activity-item" key={activity.title}>
                  <span className="activity-dot"></span>
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.detail}</p>
                    <small>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-panel quick-actions">
          <div className="panel-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Common tasks to manage your platform</p>
            </div>
          </div>

          <div className="quick-action-grid">
            <button onClick={() => alert('Create magazine form coming soon.')}>
              <span>＋</span>
              <strong>Create Magazine</strong>
              <small>Add a new magazine edition</small>
            </button>
            <button onClick={() => alert('Create article form coming soon.')}>
              <span>✎</span>
              <strong>Write Article</strong>
              <small>Publish a new story</small>
            </button>
            <button onClick={() => alert('Media library coming soon.')}>
              <span>▧</span>
              <strong>Upload Media</strong>
              <small>Manage images and files</small>
            </button>
          </div>
        </section>
        <section className="admin-content-grid">
          <div className="admin-panel" id="blogs">
            <div className="panel-heading">
              <div>
                <h3>Blogs Management</h3>
                <p>Create and manage your blog posts</p>
              </div>
              <button onClick={() => alert('Create blog form coming soon.')}>
                + Add Blog
              </button>
            </div>

            <p>Manage blog content, edit existing posts, and publish new blogs.</p>
          </div>

          <div className="admin-panel" id="news">
            <div className="panel-heading">
              <div>
                <h3>News Management</h3>
                <p>Manage the latest news and updates</p>
              </div>
              <button onClick={() => alert('Create news form coming soon.')}>
                + Add News
              </button>
            </div>

            <p>Create, edit, and publish news updates on your website.</p>
          </div>
        </section>
        <footer className="admin-footer">
          © 2026 ChronicleHub · Admin Panel
        </footer>
      </main>
    </div>
  )
}

export default Admin