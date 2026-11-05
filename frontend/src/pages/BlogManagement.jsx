
import { useEffect, useState } from 'react';
import API from '../api';
import './BlogManagement.css';

// Initial form values
const initialForm = {
    title: '',
    content: '',
    featured_image: '',
    status: 'draft',
    scheduled_at: ''
};

// Convert a date into India Standard Time for datetime-local
function toISTDateTime(value) {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(date);

    const get = (type) =>
        parts.find((part) => part.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

function BlogManagement() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState(initialForm);

    // Fetch all blogs from backend
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await API.get('/api/blogs');
            setBlogs(response.data.blogs || []);

        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Unable to load blogs. Please check your backend.');

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter blogs by title
    const filteredBlogs = blogs.filter((blog) =>
        (blog.title || '')
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
    );

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Open create form
    const handleAddBlog = () => {
        setEditingId(null);
        setFormData({ ...initialForm });
        setMessage('');
        setError('');
        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (blog) => {
        setEditingId(blog.id);

        setFormData({
            title: blog.title || '',
            content: blog.content || '',
            featured_image: blog.featured_image || '',
            status: blog.status || 'draft',
            scheduled_at: toISTDateTime(blog.scheduled_at)
        });

        setMessage('');
        setError('');
        setShowForm(true);
    };

    // Create or update blog
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const payload = { ...formData };

            // Validate and convert scheduled date to ISO
            if (payload.status === 'scheduled') {
                if (!payload.scheduled_at) {
                    setError('Please select a publication date and time.');
                    return;
                }

                // Interpret datetime-local value as IST
                const scheduledDate = new Date(
                    `${payload.scheduled_at}:00+05:30`
                );

                if (
                    Number.isNaN(scheduledDate.getTime()) ||
                    scheduledDate <= new Date()
                ) {
                    setError('Please select a future date and time.');
                    return;
                }

                payload.scheduled_at = scheduledDate.toISOString();

            } else {
                payload.scheduled_at = null;
            }

            if (editingId !== null) {
                await API.put(`/api/blogs/${editingId}`, payload);

                setMessage(
                    payload.status === 'scheduled'
                        ? 'Blog schedule updated successfully.'
                        : 'Blog updated successfully.'
                );

            } else {
                await API.post('/api/blogs', payload);

                setMessage(
                    payload.status === 'scheduled'
                        ? 'Blog scheduled successfully.'
                        : payload.status === 'published'
                            ? 'Blog published successfully.'
                            : 'Blog saved as draft successfully.'
                );
            }

            setShowForm(false);
            setEditingId(null);
            setFormData({ ...initialForm });

            await fetchBlogs();

        } catch (err) {
            console.error('Error saving blog:', err);

            setError(
                err.response?.data?.message ||
                'Unable to save blog. Please try again.'
            );
        }
    };

    // Delete blog
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this blog?'
        );

        if (!confirmed) return;

        try {
            await API.delete(`/api/blogs/${id}`);

            setMessage('Blog deleted successfully.');
            setError('');

            await fetchBlogs();

        } catch (err) {
            console.error('Error deleting blog:', err);

            setError(
                err.response?.data?.message ||
                'Unable to delete blog.'
            );
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'Not published';

        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
    };

    // Format scheduled date and time
    const formatScheduledDate = (date) => {
        if (!date) return 'Date not set';

        return new Date(date).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    };

    // Calculate summary counts
    const publishedCount = blogs.filter(
        (blog) => blog.status === 'published'
    ).length;

    const draftCount = blogs.filter(
        (blog) => blog.status === 'draft'
    ).length;

    const scheduledCount = blogs.filter(
        (blog) => blog.status === 'scheduled'
    ).length;

    return (
        <section className="blog-management">

            {/* Header */}
            <div className="blog-management-header">
                <div>
                    <h3>Blogs Management</h3>
                    <p>Create, edit and manage your blog posts</p>
                </div>

                <button
                    className="blog-add-btn"
                    onClick={handleAddBlog}
                >
                    + Add Blog
                </button>
            </div>

            {/* Blog summary */}
            <div className="blog-summary">
                <div>
                    <span>Total Blogs</span>
                    <strong>{blogs.length}</strong>
                </div>

                <div>
                    <span>Published</span>
                    <strong>{publishedCount}</strong>
                </div>

                <div>
                    <span>Drafts</span>
                    <strong>{draftCount}</strong>
                </div>

                <div>
                    <span>Scheduled</span>
                    <strong>{scheduledCount}</strong>
                </div>
            </div>

            {/* Search blogs */}
            <div className="blog-search-wrapper">
                <input
                    type="search"
                    className="blog-search-input"
                    placeholder="Search blogs by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search blogs by title"
                />
            </div>

            {/* Success and error messages */}
            {message && (
                <div className="blog-success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="blog-error-message">
                    {error}
                </div>
            )}

            {/* Create and edit form */}
            {showForm && (
                <div className="blog-form-card">

                    <div className="blog-form-heading">
                        <h3>
                            {editingId !== null
                                ? 'Edit Blog'
                                : 'Create New Blog'}
                        </h3>

                        <button
                            type="button"
                            className="blog-close-btn"
                            onClick={() => setShowForm(false)}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="blog-form-group">
                            <label>Blog Title *</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter blog title"
                                required
                            />
                        </div>

                        <div className="blog-form-group">
                            <label>Featured Image URL</label>

                            <input
                                type="url"
                                name="featured_image"
                                value={formData.featured_image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Image preview */}
                        {formData.featured_image && (
                            <div className="blog-image-preview">
                                <img
                                    src={formData.featured_image}
                                    alt="Blog preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={(e) => {
                                        e.currentTarget.style.display = 'block';
                                    }}
                                />
                            </div>
                        )}

                        <div className="blog-form-group">
                            <label>Blog Content *</label>

                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your blog content here..."
                                rows="10"
                                required
                            />
                        </div>

                        <div className="blog-form-group">
                            <label>Publication Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="draft">
                                    Save as Draft
                                </option>

                                <option value="published">
                                    Publish Now
                                </option>

                                <option value="scheduled">
                                    Schedule for Later
                                </option>
                            </select>
                        </div>

                        {/* Scheduled date and time */}
                        {formData.status === 'scheduled' && (
                            <div className="blog-form-group">
                                <label>
                                    Scheduled Publication Date & Time (IST) *
                                </label>

                                <input
                                    type="datetime-local"
                                    name="scheduled_at"
                                    value={formData.scheduled_at}
                                    onChange={handleChange}
                                    min={toISTDateTime(new Date())}
                                    required
                                />

                                <small>
                                    Your blog will automatically be published
                                    at the selected time.
                                    Timezone: India Standard Time (IST).
                                </small>
                            </div>
                        )}

                        {/* Form actions */}
                        <div className="blog-form-actions">

                            <button
                                type="button"
                                className="blog-cancel-btn"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="blog-save-btn"
                            >
                                {editingId !== null
                                    ? 'Update Blog'
                                    : formData.status === 'scheduled'
                                        ? 'Schedule Blog'
                                        : formData.status === 'published'
                                            ? 'Publish Blog'
                                            : 'Save Blog'}
                            </button>

                        </div>
                    </form>
                </div>
            )}

            {/* Blogs table */}
            <div className="blog-table-wrapper">

                <table className="blog-table">

                    <thead>
                        <tr>
                            <th>BLOG</th>
                            <th>AUTHOR</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="blog-empty">
                                    Loading blogs...
                                </td>
                            </tr>

                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="blog-empty">
                                    No blogs found. Click "+ Add Blog" to
                                    create your first blog.
                                </td>
                            </tr>

                        ) : filteredBlogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="blog-empty">
                                    No blogs match "{searchTerm}".
                                </td>
                            </tr>

                        ) : (
                            filteredBlogs.map((blog) => (
                                <tr key={blog.id}>

                                    <td>
                                        <div className="blog-table-title">

                                            {blog.featured_image && (
                                                <img
                                                    src={blog.featured_image}
                                                    alt=""
                                                />
                                            )}

                                            <strong>{blog.title}</strong>
                                        </div>
                                    </td>

                                    <td>
                                        {blog.author_name || 'Not assigned'}
                                    </td>

                                    <td>
                                        <span
                                            className={`blog-status ${blog.status}`}
                                        >
                                            {blog.status}
                                        </span>
                                    </td>

                                    <td>
                                        {blog.status === 'scheduled'
                                            ? `Scheduled: ${formatScheduledDate(blog.scheduled_at)}`
                                            : formatDate(
                                                blog.published_at ||
                                                blog.created_at
                                            )}
                                    </td>

                                    <td>
                                        <div className="blog-action-buttons">

                                            <button
                                                className="blog-edit-btn"
                                                onClick={() => handleEdit(blog)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="blog-delete-btn"
                                                onClick={() => handleDelete(blog.id)}
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

        </section>
    );
}

export default BlogManagement;
