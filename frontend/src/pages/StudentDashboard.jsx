import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import { itemsAPI, claimsAPI } from '../services/api'

function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    myItems: 0,
    myClaims: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        itemsAPI.getMyItems(),
        claimsAPI.getMyClaims()
      ])
      setStats({
        myItems: itemsRes.items.length,
        myClaims: claimsRes.claims.length
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
      <h1 style={{ marginBottom: '30px' }}>Welcome, {user?.full_name}!</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', color: '#1976d2', marginBottom: '10px' }}>{stats.myItems}</h2>
          <p style={{ color: '#666' }}>My Reports</p>
          <Link to="/my-reports" className="btn btn-outline" style={{ marginTop: '15px' }}>View Reports</Link>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', color: '#388e3c', marginBottom: '10px' }}>{stats.myClaims}</h2>
          <p style={{ color: '#666' }}>My Claims</p>
          <Link to="/my-claims" className="btn btn-outline" style={{ marginTop: '15px' }}>View Claims</Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn btn-danger">Report Lost Item</Link>
          <Link to="/report-found" className="btn btn-success">Report Found Item</Link>
          <Link to="/browse" className="btn btn-primary">Browse Items</Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
