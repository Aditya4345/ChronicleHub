import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./CreateNewsletter.css";

function CreateNewsletter() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        category: "",
        content: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (status) => {

        if (
            !formData.title.trim() ||
            !formData.subject.trim() ||
            !formData.category.trim() ||
            !formData.content.trim()
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

await API.post("/api/newsletters", {
    ...formData,
    status
});

            alert(
                status === "published"
                    ? "Newsletter published successfully!"
                    : "Newsletter saved as draft!"
            );

            navigate("/admin/newsletters");

        } catch (error) {
            console.error("Newsletter error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save newsletter."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-newsletter-page">

            <div className="create-header">

                <div>
                    <h1>Create Newsletter</h1>
                    <p>Create and manage your newsletter content.</p>
                </div>

                <button
                    className="back-btn"
                    onClick={() => navigate("/admin/newsletters")}
                >
                    Back to Newsletters
                </button>

            </div>

            <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}
            >

                <div className="form-group">
                    <label>Newsletter Title *</label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter newsletter title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email Subject *</label>

                    <input
                        type="text"
                        name="subject"
                        placeholder="Enter email subject"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Category *</label>

                    <input
                        type="text"
                        name="category"
                        placeholder="Enter category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Newsletter Content *</label>

                    <textarea
                        name="content"
                        placeholder="Write newsletter content here..."
                        value={formData.content}
                        onChange={handleChange}
                        rows="10"
                    />
                </div>

                <div className="form-buttons">

                    <button
                        type="button"
                        className="draft-btn"
                        onClick={() => handleSubmit("draft")}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Draft"}
                    </button>

                    <button
                        type="button"
                        className="publish-btn"
                        onClick={() => handleSubmit("published")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Publish Newsletter"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateNewsletter;