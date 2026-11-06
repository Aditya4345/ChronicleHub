import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./NewsletterPreview.css";

function NewsletterPreview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [newsletter, setNewsletter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const loadNewsletter = async () => {
            try {
                const response = await API.get(`/api/newsletters/${id}`);

                if (!ignore) {
                    setNewsletter(response.data.data);
                    setError("");
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Newsletter preview error:", err);

                    setError(
                        err.response?.data?.message ||
                        "Failed to load newsletter."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadNewsletter();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="preview-loading">
                Loading newsletter...
            </div>
        );
    }

    if (error || !newsletter) {
        return (
            <div className="preview-error">
                <h2>{error || "Newsletter not found"}</h2>

                <button
                    onClick={() => navigate("/admin/newsletters")}
                >
                    Back to Newsletters
                </button>
            </div>
        );
    }

    return (
        <div className="newsletter-preview-page">

            <div className="preview-header">
                <div>
                    <h1>Newsletter Preview</h1>
                    <p>Review your newsletter before publishing.</p>
                </div>

                <button
                    className="preview-back-btn"
                    onClick={() => navigate("/admin/newsletters")}
                >
                    Back
                </button>
            </div>

            <div className="preview-card">

                <div className="preview-status">
                    <span className={`status-badge ${newsletter.status}`}>
                        {newsletter.status}
                    </span>
                </div>

                <h1 className="preview-title">
                    {newsletter.title}
                </h1>

                <div className="preview-details">

                    <p>
                        <strong>Subject:</strong> {newsletter.subject}
                    </p>

                    <p>
                        <strong>Category:</strong>{" "}
                        {newsletter.category || "N/A"}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {newsletter.created_at
                            ? new Date(
                                newsletter.created_at
                            ).toLocaleDateString()
                            : "N/A"}
                    </p>

                </div>

                <hr />

                <div className="preview-content">
                    <h2>Newsletter Content</h2>
                    <p>{newsletter.content}</p>
                </div>

                <div className="preview-actions">

                    <button
                        className="preview-edit-btn"
                        onClick={() =>
                            navigate(
                                `/admin/newsletters/edit/${newsletter.id}`
                            )
                        }
                    >
                        Edit Newsletter
                    </button>

                    <button
                        className="preview-list-btn"
                        onClick={() => navigate("/admin/newsletters")}
                    >
                        Back to List
                    </button>

                </div>

            </div>

        </div>
    );
}

export default NewsletterPreview;