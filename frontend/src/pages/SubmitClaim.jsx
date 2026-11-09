import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { itemsAPI, claimsAPI } from '../services/api'

function SubmitClaim() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(true)

  useEffect(() => {
    loadItem()
  }, [id])

  const loadItem = async () => {
    try {
      const response = await itemsAPI.getItem(id)
      setItem(response.item)
    } catch (error) {
      console.error('Failed to load item:', error)
      setError('Failed to load item details')
    } finally {
      setItemLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await claimsAPI.createClaim({
        item_id: parseInt(id),
        explanation: explanation
      })
      navigate('/my-claims')
    } catch (err) {
      setError(err.message || 'Failed to submit claim')
    } finally {
      setLoading(false)
    }
  }

  if (itemLoading) {
    return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
  }

  if (!item) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Item Not Found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Claim Item</h2>

        <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
          <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
          <p style={{ color: '#666' }}>{item.description}</p>
          <p style={{ color: '#666' }}><strong>Location:</strong> {item.location}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Why does this item belong to you?</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              required
              placeholder="Provide details that prove this item belongs to you (e.g., describe unique features, contents, when and where you lost it)"
              style={{ minHeight: '150px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitClaim
