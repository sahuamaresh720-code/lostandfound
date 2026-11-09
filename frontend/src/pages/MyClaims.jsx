import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { claimsAPI } from '../services/api'

function MyClaims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClaims()
  }, [])

  const loadClaims = async () => {
    try {
      const response = await claimsAPI.getMyClaims()
      setClaims(response.claims)
    } catch (error) {
      console.error('Failed to load claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'badge-approved'
      case 'rejected': return 'badge-rejected'
      default: return 'badge-pending'
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Loading your claims...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>My Claims</h1>

      {claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>You haven't submitted any claims yet.</p>
          <Link to="/browse" className="btn btn-primary">Browse Items to Claim</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {claims.map(claim => (
            <div key={claim.id} className="card">
              <div style={{ marginBottom: '15px' }}>
                <span className={`badge ${getStatusBadgeClass(claim.status)}`}>
                  {claim.status.toUpperCase()}
                </span>
              </div>

              <h3 style={{ marginBottom: '10px' }}>{claim.item_title}</h3>
              <p style={{ color: '#666', marginBottom: '15px' }}><strong>Your explanation:</strong> {claim.explanation}</p>

              {claim.admin_notes && (
                <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                  <strong>Admin Notes:</strong>
                  <p style={{ color: '#666', marginTop: '5px' }}>{claim.admin_notes}</p>
                </div>
              )}

              <p style={{ color: '#666', fontSize: '13px' }}>
                <strong>Submitted on:</strong> {new Date(claim.created_at).toLocaleDateString()}
              </p>

              <Link to={`/items/${claim.item_id}`} className="btn btn-outline" style={{ marginTop: '15px' }}>
                View Item
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyClaims
