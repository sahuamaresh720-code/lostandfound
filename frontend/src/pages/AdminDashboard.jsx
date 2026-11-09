import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI, claimsAPI, authAPI } from '../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    pendingClaims: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        itemsAPI.getItems(),
        claimsAPI.getPendingClaims()
      ])

      setStats({
        totalItems: itemsRes.items.length,
        pendingItems: itemsRes.items.filter(i => i.approval_status === 'pending').length,
        pendingClaims: claimsRes.claims.length
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Administrator Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', color: '#1976d2', marginBottom: '10px' }}>{stats.totalItems}</h2>
          <p style={{ color: '#666' }}>Total Reports</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', color: '#e65100', marginBottom: '10px' }}>{stats.pendingItems}</h2>
          <p style={{ color: '#666' }}>Pending Reports</p>
          <Link to="/admin/reports" className="btn btn-outline" style={{ marginTop: '15px' }}>Review Reports</Link>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', color: '#388e3c', marginBottom: '10px' }}>{stats.pendingClaims}</h2>
          <p style={{ color: '#666' }}>Pending Claims</p>
          <Link to="/admin/claims" className="btn btn-outline" style={{ marginTop: '15px' }}>Review Claims</Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Admin Actions</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/admin/reports" className="btn btn-primary">Manage Reports</Link>
          <Link to="/admin/claims" className="btn btn-secondary">Manage Claims</Link>
          <Link to="/browse" className="btn btn-outline">Browse All Items</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
