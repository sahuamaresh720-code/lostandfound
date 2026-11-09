import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'

function MyReports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getMyItems()
      setItems(response.items)
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      await itemsAPI.deleteItem(itemId)
      loadItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    }
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
    return <div className="loading"><div className="spinner"></div><p>Loading your reports...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>My Reports</h1>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>You haven't reported any items yet.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/report-lost" className="btn btn-danger">Report Lost Item</Link>
            <Link to="/report-found" className="btn btn-success">Report Found Item</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <span className={`badge ${getBadgeClass(item.item_type)}`} style={{ marginRight: '10px' }}>
                    {item.item_type.toUpperCase()}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(item.approval_status)}`}>
                    {item.approval_status}
                  </span>
                </div>
                <span className={`badge ${getStatusBadgeClass(item.recovery_status)}`}>
                  {item.recovery_status}
                </span>
              </div>

              <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>{item.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Location:</strong> {item.location}</p>
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Category:</strong> {item.category_name}</p>
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Date:</strong> {new Date(item.date_occurred).toLocaleDateString()}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/items/${item.id}`} className="btn btn-primary">View Details</Link>
                {item.approval_status === 'pending' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReports
