import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./SubscriberForm.css";

function AddSubscriber() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please enter name and email.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/api/subscribers", {
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      alert(response.data.message || "Subscriber added successfully!");

      navigate("/admin/subscribers");

    } catch (error) {
      console.error("Add subscriber error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to add subscriber."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriber-form-page">

      <div className="subscriber-form-header">
        <div>
          <h1>Add New Subscriber</h1>
          <p>Add a new subscriber to ChronicleHub.</p>
        </div>

        <button
          className="form-back-btn"
          onClick={() => navigate("/admin/subscribers")}
        >
          Back to Subscribers
        </button>
      </div>

      <form className="subscriber-form" onSubmit={handleSubmit}>

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
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Subscriber"}
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

export default AddSubscriber;