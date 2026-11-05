
import { useEffect, useState } from 'react'
import API from '../api'

function getLocalDateTime(value) {
  if (!value) return ''

  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16)
}

function NewsManagement() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    featured_image: '',
    scheduled_at: '',
    status: 'draft',
  })

  const fetchNews = async () => {
    try {
      const response = await API.get('/api/news')
      setNews(response.data.news || [])
    } catch (error) {
      console.error('Fetch news error:', error)
      setMessage('Failed to load news.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSelectedImage(null)
      setMessage('Please select a valid image.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedImage(null)
      setMessage('Image size must be less than 5 MB.')
      event.target.value = ''
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setMessage('')
  }

  const uploadImage = async () => {
    if (!selectedImage) return form.featured_image

    const imageData = new FormData()
    imageData.append('image', selectedImage)

    setUploading(true)

    try {
      const response = await API.post('/api/news/upload', imageData)
      return response.data.imageUrl
    } catch (error) {
      console.error('Image upload error:', error)
      throw new Error(
        error.response?.data?.message || 'Image upload failed.'
      )
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      summary: '',
      content: '',
      featured_image: '',
      scheduled_at: '',
      status: 'draft',
    })
    setSelectedImage(null)
    setImagePreview('')
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (saving) return

    setSaving(true)
    setMessage('')

    try {
      if (
        form.scheduled_at &&
        new Date(form.scheduled_at).getTime() <= Date.now()
      ) {
        setMessage('Please select a future date and time.')
        return
      }

      const imageUrl = await uploadImage()

      const newsData = {
        ...form,
        featured_image: imageUrl,
        scheduled_at: form.scheduled_at
          ? new Date(form.scheduled_at).toISOString()
          : null,
        status: form.scheduled_at ? 'scheduled' : form.status,
      }

      if (editingId) {
        await API.put(`/api/news/${editingId}`, newsData)
        setMessage(
          form.scheduled_at
            ? 'News schedule updated successfully.'
            : 'News updated successfully.'
        )
      } else {
        await API.post('/api/news', newsData)
        setMessage(
          form.scheduled_at
            ? 'News scheduled successfully.'
            : 'News saved successfully as draft.'
        )
      }

      resetForm()
      await fetchNews()
    } catch (error) {
      console.error('Save news error:', error)
      setMessage(
        error.response?.data?.message ||
        error.message ||
        'Failed to save news.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)

    setForm({
      title: item.title || '',
      summary: item.summary || '',
      content: item.content || '',
      featured_image: item.featured_image || '',
      scheduled_at: getLocalDateTime(item.scheduled_at),
      status: item.status || 'draft',
    })

    setSelectedImage(null)
    setImagePreview(item.featured_image || '')
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) {
      return
    }

    try {
      await API.delete(`/api/news/${id}`)
      setMessage('News deleted successfully.')
      await fetchNews()
    } catch (error) {
      console.error('Delete news error:', error)
      setMessage(error.response?.data?.message || 'Failed to delete news.')
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/api/news/${id}/status`, { status })
      setMessage(
        status === 'published'
          ? 'News published successfully.'
          : 'News saved as draft.'
      )
      await fetchNews()
    } catch (error) {
      console.error('Update status error:', error)
      setMessage(error.response?.data?.message || 'Failed to update status.')
    }
  }

  return (
    <section className="admin-panel news-management">
      <div className="panel-heading">
        <div>
          <h3>News Management</h3>
          <p>Create, edit and publish news updates</p>
        </div>
      </div>

      {message && <p role="status">{message}</p>}

      <form onSubmit={handleSubmit} className="news-form">
        <h4>{editingId ? 'Edit News' : 'Add New News'}</h4>

        <label htmlFor="news-title">News Title *</label>
        <input
          id="news-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter news title"
          required
        />

        <label htmlFor="news-summary">Summary</label>
        <textarea
          id="news-summary"
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Enter a short summary"
          rows="2"
        />

        <label htmlFor="news-content">News Content</label>
        <textarea
          id="news-content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your news content"
          rows="5"
        />

        <label htmlFor="news-image">News Image</label>
        <input
          id="news-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <div className="image-preview">
            <p>Image Preview:</p>
            <img
              src={imagePreview}
              alt="News preview"
              style={{
                width: '200px',
                height: '130px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        )}

        <label htmlFor="scheduled-at">
          Schedule Publication (Optional)
        </label>
        <input
          id="scheduled-at"
          type="datetime-local"
          name="scheduled_at"
          value={form.scheduled_at}
          min={getLocalDateTime(new Date())}
          onChange={handleChange}
        />
        <small>
          Leave empty to save as a draft or keep the existing publication status.
        </small>

        <div className="news-form-actions">
          <button type="submit" disabled={saving || uploading}>
            {uploading
              ? 'Uploading...'
              : saving
                ? 'Saving...'
                : form.scheduled_at
                  ? 'Schedule News'
                  : editingId
                    ? 'Update News'
                    : 'Save as Draft'}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="news-list">
        <h4>Existing News</h4>

        {loading ? (
          <p>Loading news...</p>
        ) : news.length === 0 ? (
          <p>No news found. Add your first news article above.</p>
        ) : (
          news.map((item) => (
            <article className="news-item" key={item.id}>
              <div>
                {item.featured_image && (
                  <img
                    src={item.featured_image}
                    alt={item.title}
                    style={{
                      width: '150px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px',
                    }}
                  />
                )}

                <strong>{item.title}</strong>
                <p>{item.summary || 'No summary available'}</p>

                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>

                {item.status === 'scheduled' && item.scheduled_at && (
                  <p>
                    Scheduled for:{' '}
                    {new Date(item.scheduled_at).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="news-item-actions">
                <button type="button" onClick={() => handleEdit(item)}>
                  Edit
                </button>

                {item.status === 'published' ? (
                  <button
                    type="button"
                    onClick={() => handleStatus(item.id, 'draft')}
                  >
                    Save as Draft
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatus(item.id, 'published')}
                  >
                    Publish
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default NewsManagement
