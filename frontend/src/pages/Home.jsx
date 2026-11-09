import { Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#1976d2' }}>
          University Lost & Found Portal
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Report lost items, publish found items, search for missing belongings, and submit claims to recover items.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/browse" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 30px' }}>
            Browse Items
          </Link>
          {user ? (
            <>
              <Link to="/report-lost" className="btn btn-secondary" style={{ fontSize: '16px', padding: '12px 30px' }}>
                Report Lost Item
              </Link>
              <Link to="/report-found" className="btn btn-success" style={{ fontSize: '16px', padding: '12px 30px' }}>
                Report Found Item
              </Link>
            </>
          ) : (
            <Link to="/register" className="btn btn-outline" style={{ fontSize: '16px', padding: '12px 30px' }}>
              Register to Report
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '15px', color: '#1976d2' }}>Report Lost Items</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Easily report items you have lost. Provide details like description, location, and date to help others find your belongings.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px', color: '#388e3c' }}>Report Found Items</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Help others by reporting items you have found. Upload photos and provide details to help reunite items with their owners.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px', color: '#757575' }}>Search & Claim</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Search through reported items using filters and keywords. Submit claims for items that belong to you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
