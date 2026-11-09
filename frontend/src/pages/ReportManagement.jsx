import { useState, useEffect } from 'react'
import { itemsAPI } from '../services/api'

function ReportManagement() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [filter])

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await itemsAPI.getItems()
      let filteredItems = response.items

      if (filter === 'pending') {
        filteredItems = filteredItems.filter(i => i.approval_status === 'pending')
      } else if (filter === 'approved') {
        filteredItems = filteredItems.filter(i => i.approval_status === 'approved')
      } else if (filter === 'rejected') {
        filteredItems = filteredItems.filter(i => i.approval_status === 'rejected')
      }

      setItems(filteredItems)
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (itemId) => {
    try {
      await itemsAPI.approveItem(itemId)
      loadItems()
    } catch (error) {
      console.error('Failed to approve item:', error)
      alert('Failed to approve item')
    }
  }

  const handleReject = async (itemId) => {
    if (!window.confirm('Are you sure you want to reject this report?')) {
      return
    }

    try {
      await itemsAPI.rejectItem(itemId)
      loadItems()
    } catch (error) {
      console.error('Failed to reject item:', error)
      alert('Failed to reject item')
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
    return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Report Management</h1>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <strong>Filter:</strong>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>No reports found.</p>
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
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Reported By:</strong> {item.owner_name}</p>
              </div>

              {item.approval_status === 'pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </div>
              )}

              {item.approval_status !== 'pending' && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReportManagement
