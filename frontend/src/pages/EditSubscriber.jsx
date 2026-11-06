import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./SubscriberForm.css";

function EditSubscriber() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch existing subscriber
    useEffect(() => {
        let ignore = false;

        const loadSubscriber = async () => {
            try {
                const response = await API.get(
                    `/api/subscribers/${id}`
                );

                const subscriber =
                    response.data.data || response.data.subscriber;

                if (!ignore) {
                    setFormData({
                        name: subscriber.name || "",
                        email: subscriber.email || ""
                    });
                    setError("");
                }

            } catch (err) {
                if (!ignore) {
                    console.error("Fetch subscriber error:", err);
                    setError(
                        err.response?.data?.message ||
                        "Unable to load subscriber."
                    );
                }

            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadSubscriber();

        return () => {
            ignore = true;
        };
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Update subscriber
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim()
        ) {
            alert("Please enter name and email.");
            return;
        }

        try {
            setSaving(true);

            const response = await API.put(
                `/api/subscribers/${id}`,
                {
                    name: formData.name.trim(),
                    email: formData.email.trim()
                }
            );

            alert(
                response.data.message ||
                "Subscriber updated successfully!"
            );

            navigate("/admin/subscribers");

        } catch (err) {
            console.error("Update subscriber error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to update subscriber."
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="subscriber-form-page">
                <p>Loading subscriber...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="subscriber-form-page">
                <p>{error}</p>

                <button
                    className="form-back-btn"
                    onClick={() => navigate("/admin/subscribers")}
                >
                    Back to Subscribers
                </button>
            </div>
        );
    }

    return (
        <div className="subscriber-form-page">

            <div className="subscriber-form-header">
                <div>
                    <h1>Edit Subscriber</h1>
                    <p>Update subscriber information.</p>
                </div>

                <button
                    className="form-back-btn"
                    onClick={() => navigate("/admin/subscribers")}
                >
                    Back to Subscribers
                </button>
            </div>

            <form
                className="subscriber-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>Subscriber Name *</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter subscriber name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email Address *</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="subscriber-form-buttons">

                    <button
                        type="submit"
                        className="subscriber-save-btn"
                        disabled={saving}
                    >
                        {saving ? "Updating..." : "Update Subscriber"}
                    </button>

                    <button
                        type="button"
                        className="subscriber-cancel-btn"
                        onClick={() => navigate("/admin/subscribers")}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditSubscriber;