import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/dashboard'
import Students from './pages/Students'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Dashboard" element={<Dashboard/>}/>
       <Route path="/Students" element={<Students/>}/>
    </Routes>
  )
}

export default App