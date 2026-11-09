import { useState, useEffect } from 'react'
import { claimsAPI } from '../services/api'

function ClaimManagement() {
  const [claims, setClaims] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClaims()
  }, [filter])

  const loadClaims = async () => {
    setLoading(true)
    try {
      let response
      if (filter === 'pending') {
        response = await claimsAPI.getPendingClaims()
      } else {
        response = await claimsAPI.getAllClaims()
        if (filter === 'approved') {
          response.claims = response.claims.filter(c => c.status === 'approved')
        } else if (filter === 'rejected') {
          response.claims = response.claims.filter(c => c.status === 'rejected')
        }
      }
      setClaims(response.claims)
    } catch (error) {
      console.error('Failed to load claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (claimId) => {
    const notes = prompt('Add admin notes (optional):')
    try {
      await claimsAPI.approveClaim(claimId, notes ? { admin_notes: notes } : {})
      loadClaims()
    } catch (error) {
      console.error('Failed to approve claim:', error)
      alert('Failed to approve claim')
    }
  }

  const handleReject = async (claimId) => {
    const notes = prompt('Add rejection reason (optional):')
    if (notes === null) return

    try {
      await claimsAPI.rejectClaim(claimId, notes ? { admin_notes: notes } : {})
      loadClaims()
    } catch (error) {
      console.error('Failed to reject claim:', error)
      alert('Failed to reject claim')
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
    return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Claim Management</h1>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <strong>Filter:</strong>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All ({claims.length})
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

      {claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>No claims found.</p>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Claimant:</strong> {claim.claimant_name}</p>
                <p style={{ color: '#666', fontSize: '13px' }}><strong>Submitted:</strong> {new Date(claim.created_at).toLocaleDateString()}</p>
              </div>

              <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                <strong>Explanation:</strong>
                <p style={{ color: '#666', marginTop: '5px' }}>{claim.explanation}</p>
              </div>

              {claim.admin_notes && (
                <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                  <strong>Admin Notes:</strong>
                  <p style={{ color: '#666', marginTop: '5px' }}>{claim.admin_notes}</p>
                </div>
              )}

              {claim.status === 'pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleApprove(claim.id)}
                    className="btn btn-success"
                  >
                    Approve Claim
                  </button>
                  <button
                    onClick={() => handleReject(claim.id)}
                    className="btn btn-danger"
                  >
                    Reject Claim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClaimManagement
