import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Subscriber.css";

function Subscriber() {
    const [subscribers, setSubscribers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const subscribersPerPage = 20;

    const navigate = useNavigate();

    // Fetch subscribers when search or status changes
    useEffect(() => {
        let ignore = false;

        const loadSubscribers = async () => {
            try {
                const params = {};

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (status !== "all") {
                    params.status = status;
                }

                const response = await API.get(
                    "/api/subscribers",
                    { params }
                );

                if (!ignore) {
                    setSubscribers(response.data.data || []);
                    setError("");
                }

            } catch (err) {
                if (!ignore) {
                    console.error("Subscriber error:", err);
                    setError("Unable to load subscribers.");
                }

            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadSubscribers();

        return () => {
            ignore = true;
        };

    }, [search, status]);

    // Refresh subscribers
    const handleRefresh = async () => {
        setCurrentPage(1);
        setLoading(true);

        try {
            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (status !== "all") {
                params.status = status;
            }

            const response = await API.get(
                "/api/subscribers",
                { params }
            );

            setSubscribers(response.data.data || []);
            setError("");

        } catch (err) {
            console.error("Subscriber error:", err);
            setError("Unable to load subscribers.");

        } finally {
            setLoading(false);
        }
    };

    // Pagination calculations
    const totalPages = Math.max(
        1,
        Math.ceil(subscribers.length / subscribersPerPage)
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const indexOfLastSubscriber =
        safeCurrentPage * subscribersPerPage;

    const indexOfFirstSubscriber =
        indexOfLastSubscriber - subscribersPerPage;

    const currentSubscribers = subscribers.slice(
        indexOfFirstSubscriber,
        indexOfLastSubscriber
    );

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Activate / Unsubscribe
    const handleStatusChange = async (subscriber) => {
        const newStatus = subscriber.is_active
            ? "unsubscribed"
            : "active";

        try {
            await API.patch(
                `/api/subscribers/${subscriber.id}/status`,
                { status: newStatus }
            );

            alert(`Subscriber ${newStatus} successfully!`);

            await handleRefresh();

        } catch (err) {
            console.error(err);
            alert("Unable to update subscriber status.");
        }
    };

    // Delete subscriber
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this subscriber?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/api/subscribers/${id}`);

            alert("Subscriber deleted successfully!");

            await handleRefresh();

        } catch (err) {
            console.error(err);
            alert("Unable to delete subscriber.");
        }
    };

    // Export CSV
    const handleExport = async () => {
        try {
            const response = await API.get(
                "/api/subscribers/export/csv",
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    { type: "text/csv" }
                )
            );

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "subscribers.csv");

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Unable to export subscribers.");
        }
    };

    return (
        <div className="subscriber-page">

            {/* Header */}
            <div className="subscriber-header">

                <div>
                    <h1>Subscriber Management</h1>
                    <p>Manage all your newsletter subscribers.</p>
                </div>

                <div>
                    <button
                        className="add-subscriber-btn"
                        onClick={() =>
                            navigate("/admin/subscribers/add")
                        }
                    >
                        + Add Subscriber
                    </button>

                    <button
                        className="export-btn"
                        onClick={handleExport}
                    >
                        Export CSV
                    </button>
                </div>

            </div>

            {/* Search and Filter */}
            <div className="subscriber-controls">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                        setLoading(true);
                    }}
                />

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setCurrentPage(1);
                        setLoading(true);
                    }}
                >
                    <option value="all">All Subscribers</option>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                </select>

                <button onClick={handleRefresh}>
                    Refresh
                </button>

            </div>

            {/* Subscriber Table */}
            <div className="subscriber-table-container">

                {loading ? (
                    <p>Loading subscribers...</p>

                ) : error ? (
                    <p className="subscriber-error">{error}</p>

                ) : subscribers.length === 0 ? (
                    <p>No subscribers found.</p>

                ) : (
                    <>

                        <table className="subscriber-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Subscribed Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id}>

                                        <td>{subscriber.id}</td>

                                        <td>
                                            {subscriber.name || "-"}
                                        </td>

                                        <td>{subscriber.email}</td>

                                        <td>
                                            <span
                                                className={
                                                    subscriber.is_active
                                                        ? "subscriber-active"
                                                        : "subscriber-inactive"
                                                }
                                            >
                                                {subscriber.is_active
                                                    ? "Active"
                                                    : "Unsubscribed"}
                                            </span>
                                        </td>

                                        <td>
                                            {subscriber.subscribed_at
                                                ? new Date(
                                                    subscriber.subscribed_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>

                                            <button
                                                className="status-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/subscribers/edit/${subscriber.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="status-btn"
                                                onClick={() =>
                                                    handleStatusChange(subscriber)
                                                }
                                            >
                                                {subscriber.is_active
                                                    ? "Unsubscribe"
                                                    : "Activate"}
                                            </button>

                                            <button
                                                className="subscriber-delete-btn"
                                                onClick={() =>
                                                    handleDelete(subscriber.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                        {/* Pagination */}
                        <div className="subscriber-pagination">

                            <button
                                onClick={() =>
                                    handlePageChange(safeCurrentPage - 1)
                                }
                                disabled={safeCurrentPage === 1}
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    className={
                                        safeCurrentPage === page
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handlePageChange(page)
                                    }
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    handlePageChange(safeCurrentPage + 1)
                                }
                                disabled={safeCurrentPage === totalPages}
                            >
                                Next
                            </button>

                        </div>

                        <p style={{
                            textAlign: "center",
                            marginTop: "15px"
                        }}>
                            Showing {indexOfFirstSubscriber + 1} -{" "}
                            {Math.min(
                                indexOfLastSubscriber,
                                subscribers.length
                            )}{" "}
                            of {subscribers.length} subscribers
                        </p>

                    </>
                )}

            </div>

        </div>
    );
}

export default Subscriber;