const API_BASE_URL = 'http://localhost:5000'

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'An error occurred')
  }

  return response.json()
}

export const authAPI = {
  register: (data) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  login: (data) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  logout: () => apiCall('/api/auth/logout', {
    method: 'POST'
  }),

  checkAuth: () => apiCall('/api/auth/check'),

  getCurrentUser: () => apiCall('/api/auth/me')
}

export const itemsAPI = {
  getItems: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/api/items?${queryString}`)
  },

  getItem: (id) => apiCall(`/api/items/${id}`),

  createItem: (formData) => apiCall('/api/items', {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for FormData
    body: formData
  }),

  getMyItems: () => apiCall('/api/items/my'),

  updateItem: (id, data) => apiCall(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteItem: (id) => apiCall(`/api/items/${id}`, {
    method: 'DELETE'
  }),

  approveItem: (id) => apiCall(`/api/items/${id}/approve`, {
    method: 'POST'
  }),

  rejectItem: (id) => apiCall(`/api/items/${id}/reject`, {
    method: 'POST'
  }),

  findMatches: (id) => apiCall(`/api/items/${id}/matches`)
}

export const claimsAPI = {
  createClaim: (data) => apiCall('/api/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getMyClaims: () => apiCall('/api/claims/my'),

  getAllClaims: () => apiCall('/api/claims'),

  getPendingClaims: () => apiCall('/api/claims/pending'),

  approveClaim: (id, data) => apiCall(`/api/claims/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  rejectClaim: (id, data) => apiCall(`/api/claims/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const categoriesAPI = {
  getCategories: () => apiCall('/api/categories'),

  createCategory: (data) => apiCall('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateCategory: (id, data) => apiCall(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteCategory: (id) => apiCall(`/api/categories/${id}`, {
    method: 'DELETE'
  })
}
