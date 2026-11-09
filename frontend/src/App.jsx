import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './services/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import ReportLostItem from './pages/ReportLostItem'
import ReportFoundItem from './pages/ReportFoundItem'
import BrowseItems from './pages/BrowseItems'
import ItemDetails from './pages/ItemDetails'
import SubmitClaim from './pages/SubmitClaim'
import MyReports from './pages/MyReports'
import MyClaims from './pages/MyClaims'
import AdminDashboard from './pages/AdminDashboard'
import ReportManagement from './pages/ReportManagement'
import ClaimManagement from './pages/ClaimManagement'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-lost"
                element={
                  <ProtectedRoute>
                    <ReportLostItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-found"
                element={
                  <ProtectedRoute>
                    <ReportFoundItem />
                  </ProtectedRoute>
                }
              />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route
                path="/items/:id/claim"
                element={
                  <ProtectedRoute>
                    <SubmitClaim />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reports"
                element={
                  <ProtectedRoute>
                    <MyReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-claims"
                element={
                  <ProtectedRoute>
                    <MyClaims />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ReportManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/claims"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ClaimManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
