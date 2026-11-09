import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import { itemsAPI } from '../services/api'

function ItemDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMatches, setShowMatches] = useState(false)

  useEffect(() => {
    loadItem()
  }, [id])

  const loadItem = async () => {
    try {
      const response = await itemsAPI.getItem(id)
      setItem(response.item)

      // If it's a lost item, try to find matches
      if (response.item.item_type === 'lost') {
        try {
          const matchesResponse = await itemsAPI.findMatches(id)
          setMatches(matchesResponse.matches || [])
        } catch (error) {
          console.error('Failed to find matches:', error)
        }
      }
    } catch (error) {
      console.error('Failed to load item:', error)
    } finally {
      setLoading(false)
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

  if (!item) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Item Not Found</h2>
          <Link to="/browse" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to="/browse" className="btn btn-outline" style={{ marginBottom: '20px' }}>
        ← Back to Browse
      </Link>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <span className={`badge ${getBadgeClass(item.item_type)}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
            {item.item_type.toUpperCase()}
          </span>
          <span className={`badge ${getStatusBadgeClass(item.recovery_status)}`}>
            {item.recovery_status}
          </span>
        </div>

        <h1 style={{ marginBottom: '20px' }}>{item.title}</h1>

        {item.image_path && (
          <img
            src={`http://127.0.0.1:5000/uploads/${item.image_path}`}
            alt={item.title}
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', marginBottom: '20px' }}
          />
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Description</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>{item.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <strong>Location:</strong>
            <p style={{ color: '#666' }}>{item.location}</p>
          </div>
          <div>
            <strong>Category:</strong>
            <p style={{ color: '#666' }}>{item.category_name}</p>
          </div>
          <div>
            <strong>Date:</strong>
            <p style={{ color: '#666' }}>{new Date(item.date_occurred).toLocaleDateString()}</p>
          </div>
          <div>
            <strong>Reported By:</strong>
            <p style={{ color: '#666' }}>{item.owner_name}</p>
          </div>
          <div>
            <strong>Reported On:</strong>
            <p style={{ color: '#666' }}>{new Date(item.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {item.item_type === 'found' && item.recovery_status === 'unclaimed' && user && (
          <Link to={`/items/${item.id}/claim`} className="btn btn-primary">
            Claim This Item
          </Link>
        )}

        {item.item_type === 'lost' && matches.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => setShowMatches(!showMatches)}
              className="btn btn-outline"
              style={{ marginBottom: '15px' }}
            >
              {showMatches ? 'Hide' : 'Show'} Potential Matches ({matches.length})
            </button>

            {showMatches && (
              <div>
                <h3 style={{ marginBottom: '15px' }}>Potential Matches</h3>
                {matches.map((match, index) => (
                  <div key={index} className="card" style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>{match.item.title}</strong>
                      <span className="badge badge-approved">Match Score: {match.score}%</span>
                    </div>
                    <p style={{ color: '#666', marginBottom: '10px' }}>{match.item.description.substring(0, 100)}...</p>
                    <div>
                      <strong>Reasons:</strong>
                      <ul style={{ marginTop: '5px', marginLeft: '20px', color: '#666' }}>
                        {match.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    <Link to={`/items/${match.item.id}`} className="btn btn-outline" style={{ marginTop: '10px' }}>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetails
