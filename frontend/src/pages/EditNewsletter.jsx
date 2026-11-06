import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./EditNewsletter.css";

function EditNewsletter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    category: "",
    content: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing newsletter
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await API.get(`/api/newsletters/${id}`);

        const newsletter = response.data.data;

        setFormData({
          title: newsletter.title || "",
          subject: newsletter.subject || "",
          category: newsletter.category || "",
          content: newsletter.content || ""
        });
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        alert("Unable to load newsletter.");
        navigate("/admin/newsletters");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update newsletter
  const handleUpdate = async (publish = false) => {
    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.content.trim()
    ) {
      alert("Please fill in Title, Subject and Content.");
      return;
    }

    try {
      setSaving(true);

      await API.put(`/api/newsletters/${id}`, formData);

      if (publish) {
        await API.patch(`/api/newsletters/${id}/publish`);
        alert("Newsletter updated and published successfully!");
      } else {
        alert("Newsletter updated successfully!");
      }

      navigate("/admin/newsletters");

    } catch (error) {
      console.error("Newsletter update error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to update newsletter."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading newsletter...</h2>;
  }

  return (
    <div className="edit-newsletter-page">

      <div className="edit-header">
        <div>
          <h1>Edit Newsletter</h1>
          <p>Update your newsletter information.</p>
        </div>

        <button
          className="edit-back-btn"
          onClick={() => navigate("/admin/newsletters")}
        >
          Back to Newsletters
        </button>
      </div>

      <div className="edit-newsletter-form">

        <div className="edit-form-group">
          <label>Newsletter Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter newsletter title"
          />
        </div>

        <div className="edit-form-group">
          <label>Email Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
          />
        </div>

        <div className="edit-form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter newsletter category"
          />
        </div>

        <div className="edit-form-group">
          <label>Newsletter Content *</label>
          <textarea
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write newsletter content..."
          />
        </div>

        <div className="edit-form-buttons">

          <button
            className="edit-save-btn"
            onClick={() => handleUpdate(false)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="edit-publish-btn"
            onClick={() => handleUpdate(true)}
            disabled={saving}
          >
            {saving ? "Publishing..." : "Update & Publish"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditNewsletter;