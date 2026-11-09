import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI, categoriesAPI } from '../services/api'

function BrowseItems() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    item_type: '',
    category_id: '',
    search: '',
    location: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
    loadItems()
  }, [filters])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await itemsAPI.getItems(filters)
      setItems(response.items)
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const getBadgeClass = (type) => {
    return type === 'lost' ? 'badge-lost' : 'badge-found'
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'badge-approved'
      case 'rejected': return 'badge-rejected'
      default: return 'badge-pending'
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Loading items...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Browse Items</h1>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>Type</label>
            <select name="item_type" value={filters.item_type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category_id" value={filters.category_id} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or description"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by location"
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>No items found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span className={`badge ${getBadgeClass(item.item_type)}`}>
                  {item.item_type.toUpperCase()}
                </span>
                <span className={`badge ${getStatusBadgeClass(item.recovery_status)}`}>
                  {item.recovery_status}
                </span>
              </div>
              <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                {item.description.substring(0, 100)}...
              </p>
              <p style={{ color: '#666', marginBottom: '5px', fontSize: '13px' }}>
                <strong>Location:</strong> {item.location}
              </p>
              <p style={{ color: '#666', marginBottom: '5px', fontSize: '13px' }}>
                <strong>Category:</strong> {item.category_name}
              </p>
              <p style={{ color: '#666', marginBottom: '15px', fontSize: '13px' }}>
                <strong>Date:</strong> {new Date(item.date_occurred).toLocaleDateString()}
              </p>
              <Link to={`/items/${item.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrowseItems
