import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { itemsAPI, categoriesAPI } from '../services/api'

function ReportFoundItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date_occurred: '',
    category_id: ''
  })
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('item_type', 'found')
      formDataToSend.append('location', formData.location)
      formDataToSend.append('date_occurred', formData.date_occurred)
      formDataToSend.append('category_id', formData.category_id)
      if (image) {
        formDataToSend.append('image', image)
      }

      await itemsAPI.createItem(formDataToSend)
      navigate('/my-reports')
    } catch (err) {
      setError(err.message || 'Failed to report item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Report Found Item</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Black Wallet"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide detailed description of the item"
            />
          </div>
          <div className="form-group">
            <label>Location Found</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Cafeteria, Table 5"
            />
          </div>
          <div className="form-group">
            <label>Date Found</label>
            <input
              type="date"
              name="date_occurred"
              value={formData.date_occurred}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReportFoundItem
