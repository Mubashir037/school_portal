import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/dashboard'
import Students from './pages/Students'
import ImportStudents from './pages/ImportStudents'

function App() {
  const isLoggedIn = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/students"
        element={isLoggedIn ? <Students /> : <Navigate to="/login" />}
      />
      <Route
        path="/import"
        element={isLoggedIn ? <ImportStudents /> : <Navigate to="/login" />}
      />
    </Routes>
  )
}

export default App