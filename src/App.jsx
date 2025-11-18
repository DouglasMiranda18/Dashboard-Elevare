import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'
import Sidebar from './components/Sidebar'
import UserMenu from './components/UserMenu'
import Login from './pages/Login'
import Home from './pages/Home'
import SocialMediaPlanning from './pages/SocialMediaPlanning'
import Messages from './pages/Messages'
import Packages from './pages/Packages'
import ContentIdeas from './pages/ContentIdeas'
import Clients from './pages/Clients'
import Checklists from './pages/Checklists'
import Documents from './pages/Documents'
import Affiliates from './pages/Affiliates'
import Users from './pages/Users'
import './App.css'

const ProtectedRoute = ({ children, page }) => {
  const { currentUser, canAccessPage } = useUser()

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (!canAccessPage(page)) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h1>🚫 Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Entre em contato com o administrador para solicitar acesso.</p>
        </div>
      </div>
    )
  }

  return children
}

const AdminRoute = ({ children }) => {
  const { currentUser } = useUser()
  if (currentUser?.role === 'admin') {
    return children
  }
  return <Navigate to="/" replace />
}

const AppContent = () => {
  const { currentUser, loading } = useUser()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Login />
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute page="home"><Home /></ProtectedRoute>} />
          <Route path="/social-media" element={<ProtectedRoute page="social-media"><SocialMediaPlanning /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute page="messages"><Messages /></ProtectedRoute>} />
          <Route path="/packages" element={<ProtectedRoute page="packages"><Packages /></ProtectedRoute>} />
          <Route path="/content-ideas" element={<ProtectedRoute page="content-ideas"><ContentIdeas /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute page="clients"><Clients /></ProtectedRoute>} />
          <Route path="/checklists" element={<ProtectedRoute page="checklists"><Checklists /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute page="documents"><Documents /></ProtectedRoute>} />
          <Route path="/affiliates" element={<AdminRoute><Affiliates /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  )
}

export default App
