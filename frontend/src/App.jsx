import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/dashboard'
import Students from './pages/Students'
import ImportStudents from './pages/ImportStudents'
import IssueCertificate from './pages/issuecertificate'
import CertificatesHub from './pages/Certificatehub'
import IssueResultCard from './pages/issueresult'
import FeeManagement from './pages/fee'
function App() {
  const isLoggedIn = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  return (
    <Routes>
      <Route path="/result-card" element={isLoggedIn ? <IssueResultCard /> : <Navigate to="/login" />} />
      <Route path="/certificates" element={isLoggedIn ? <CertificatesHub /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/fees" element={isLoggedIn ? <FeeManagement /> : <Navigate to="/login" />}/>

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
      
      <Route path="/issue-certificate" element={isLoggedIn ? <IssueCertificate /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App