import './App.css'
import Welcome from './pages/Welcome'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ErrorComponent from './components/Error/ErrorComponent'
import AuthProvider from './context/Security/AuthContext'
import AuthenticatedRoute from './context/Security/AuthenticatedRoute'
import AccessProvider from './context/AccessContext'
import UserDashboardProvider from './context/UserDashboardContext'

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />

          {/* restricting access to dashboard page without login */}
          <Route path="/todo-dashboard" element={
            <AuthenticatedRoute>
              <AccessProvider>
                <UserDashboardProvider>
                  <Dashboard />
                </UserDashboardProvider>
              </AccessProvider>
            </AuthenticatedRoute>
          } />
          
          {/* handling 404 error */}
          <Route path="*" element={<ErrorComponent/>} />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}
export default App;