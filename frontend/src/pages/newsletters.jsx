import { useEffect, useState, useCallback } from "react";
import API from "../api";
import "./Newsletters.css";
import { useNavigate } from "react-router-dom";

function Newsletters() {
    const [newsletters, setNewsletters] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Fetch newsletters when the component loads
    useEffect(() => {
        let ignore = false;

        const loadNewsletters = async () => {
            try {
                const response = await API.get("/api/newsletters");

                const data =
                    response.data.newsletters ||
                    response.data.data ||
                    response.data;

                if (!ignore) {
                    setNewsletters(Array.isArray(data) ? data : []);
                    setError("");
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Newsletter error:", err);
                    setError("Unable to load newsletters.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadNewsletters();

        return () => {
            ignore = true;
        };
    }, []);

    // Refresh newsletters manually
    const fetchNewsletters = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/api/newsletters");

            const data =
                response.data.newsletters ||
                response.data.data ||
                response.data;

            setNewsletters(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Newsletter error:", err);
            setError("Unable to load newsletters.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Get unique categories
    const categories = [
        "All",
        ...new Set(
            newsletters
                .map((item) => item.category)
                .filter(Boolean)
        )
    ];

    // Search and category filter
    const filteredNewsletters = newsletters.filter((item) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            item.title?.toLowerCase().includes(searchText) ||
            item.subject?.toLowerCase().includes(searchText);

        const matchesCategory =
            categoryFilter === "All" ||
            item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Delete newsletter
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this newsletter?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/api/newsletters/${id}`);

            alert("Newsletter deleted successfully!");

            fetchNewsletters();

        } catch (err) {
            console.error(err);
            alert("Unable to delete newsletter.");
        }
    };

    // Publish newsletter
    const handlePublish = async (id) => {
        const confirmPublish = window.confirm(
            "Are you sure you want to publish this newsletter?"
        );

        if (!confirmPublish) return;

        try {
            await API.patch(`/api/newsletters/${id}/publish`);

            alert("Newsletter published successfully!");

            fetchNewsletters();

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to publish newsletter."
            );
        }
    };

    return (
        <div className="newsletter-page">

            {/* Header */}
            <div className="newsletter-header">
                <div>
                    <h1>Newsletter Management</h1>
                    <p>Manage all your newsletters here.</p>
                </div>

                <button
                    className="create-btn"
                    onClick={() => navigate("/admin/newsletters/create")}
                >
                    + Create Newsletter
                </button>
            </div>

            {/* Search and Filter */}
            <div className="newsletter-search">

                <input
                    type="text"
                    placeholder="Search by title or subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <button onClick={fetchNewsletters}>
                    Refresh
                </button>

            </div>

            {/* Newsletter Table */}
            <div className="newsletter-table-container">

                {loading ? (
                    <p>Loading newsletters...</p>

                ) : error ? (
                    <p className="error-message">{error}</p>

                ) : filteredNewsletters.length === 0 ? (
                    <p>No newsletters found.</p>

                ) : (
                    <table className="newsletter-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredNewsletters.map((item) => (
                                <tr key={item.id}>

                                    <td>{item.id}</td>

                                    <td>{item.title}</td>

                                    <td>
                                        {item.category_name ||
                                            item.category ||
                                            item.category_id ||
                                            "-"}
                                    </td>

                                    <td>
                                        <span
                                            className={`status ${item.status?.toLowerCase()}`}
                                        >
                                            {item.status || "Draft"}
                                        </span>
                                    </td>

                                    <td>
                                        {item.created_at
                                            ? new Date(
                                                item.created_at
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td className="newsletter-actions">

                                        {/* Preview */}
                                        <button
                                            className="preview-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/newsletters/preview/${item.id}`
                                                )
                                            }
                                        >
                                            Preview
                                        </button>

                                        {/* Edit */}
                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/newsletters/edit/${item.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {/* Publish */}
                                        {item.status?.toLowerCase() !== "published" && (
                                            <button
                                                className="publish-btn"
                                                onClick={() =>
                                                    handlePublish(item.id)
                                                }
                                            >
                                                Publish
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
}

export default Newsletters;