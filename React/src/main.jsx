import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login.jsx'
import Register from './pages/register.jsx'
import Dashboard from './pages/dashboard.jsx'
import Notfound from './pages/notfound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Scholarships from './pages/scholarships.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<Notfound />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/scholarships' element={<Scholarships />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
