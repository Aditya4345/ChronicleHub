import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Dashboard Data
// Fetch Dashboard Data
const fetchDashboardData = async () => {
    try {
        const [newsletterResponse, subscriberResponse] =
            await Promise.all([
                API.get("/api/newsletters"),
                API.get("/api/subscribers")
            ]);

        setNewsletters(newsletterResponse.data.data || []);
        setSubscribers(subscriberResponse.data.data || []);
        setError("");

    } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data.");

    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
        try {
            const [newsletterResponse, subscriberResponse] =
                await Promise.all([
                    API.get("/api/newsletters"),
                    API.get("/api/subscribers")
                ]);

            if (!ignore) {
                setNewsletters(newsletterResponse.data.data || []);
                setSubscribers(subscriberResponse.data.data || []);
                setError("");
            }

        } catch (err) {
            if (!ignore) {
                console.error("Dashboard error:", err);
                setError("Unable to load dashboard data.");
            }

        } finally {
            if (!ignore) {
                setLoading(false);
            }
        }
    };

    loadDashboard();

    return () => {
        ignore = true;
    };
}, []);

  // Calculate Statistics
  const totalNewsletters = newsletters.length;

  const publishedNewsletters = newsletters.filter(
    (item) => item.status === "published"
  ).length;

  const draftNewsletters = newsletters.filter(
    (item) => item.status === "draft"
  ).length;

  const totalSubscribers = subscribers.length;

  const activeSubscribers = subscribers.filter(
    (item) => item.is_active === true
  ).length;

  const recentNewsletters = [...newsletters]
    .sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    )
    .slice(0, 5);

  return (
    <div className="dashboard-page">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome to ChronicleHub! Here's your overview.</p>
        </div>

<button
    className="dashboard-refresh-btn"
    onClick={() => {
        setLoading(true);
        fetchDashboardData();
    }}
>
    Refresh
</button>
      </div>

      {loading ? (
        <p className="dashboard-message">
          Loading dashboard...
        </p>
      ) : error ? (
        <p className="dashboard-error">
          {error}
        </p>
      ) : (

        <>
          {/* Statistics Cards */}
          <div className="dashboard-stats">

            <div className="dashboard-card">
              <h3>Total Newsletters</h3>
              <h1>{totalNewsletters}</h1>
              <p>All newsletters created</p>
            </div>

            <div className="dashboard-card">
              <h3>Published Newsletters</h3>
              <h1>{publishedNewsletters}</h1>
              <p>Successfully published</p>
            </div>

            <div className="dashboard-card">
              <h3>Draft Newsletters</h3>
              <h1>{draftNewsletters}</h1>
              <p>Waiting to be published</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Subscribers</h3>
              <h1>{totalSubscribers}</h1>
              <p>{activeSubscribers} active subscribers</p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">

            <h2>Quick Actions</h2>

            <div className="dashboard-actions">

              <button
                onClick={() =>
                  navigate("/admin/newsletters/create")
                }
              >
                + Create Newsletter
              </button>

              <button
                onClick={() =>
                  navigate("/admin/newsletters")
                }
              >
                View Newsletters
              </button>

              <button
                onClick={() =>
                  navigate("/admin/subscribers")
                }
              >
                Manage Subscribers
              </button>

              <button
                onClick={() =>
                  navigate("/admin/subscribers/add")
                }
              >
                + Add Subscriber
              </button>

            </div>

          </div>

          {/* Recent Newsletters */}
          <div className="dashboard-section">

            <h2>Recent Newsletters</h2>

            {recentNewsletters.length === 0 ? (
              <p>No newsletters available.</p>
            ) : (

              <div className="dashboard-table-container">

                <table className="dashboard-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentNewsletters.map((item) => (

                      <tr key={item.id}>
                        <td>{item.id}</td>

                        <td>{item.title}</td>

                        <td>{item.category || "-"}</td>

                        <td>
                          <span
                            className={
                              item.status === "published"
                                ? "dashboard-published"
                                : "dashboard-draft"
                            }
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>

                    ))}
                  </tbody>

                </table>

              </div>

            )}

          </div>

        </>
      )}

    </div>
  );
}

export default Dashboard;