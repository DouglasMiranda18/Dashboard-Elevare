import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import UserMenu from './UserMenu'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { currentUser, canAccessPage } = useUser()

  const allMenuItems = [
    { path: '/', label: 'Página Inicial', icon: '🏠', key: 'home' },
    { path: '/social-media', label: 'Agenda Diária', icon: '📅', key: 'social-media' },
    { path: '/messages', label: 'Mensagens Prontas', icon: '💬', key: 'messages' },
    { path: '/packages', label: 'Pacotes', icon: '📦', key: 'packages' },
    { path: '/content-ideas', label: 'Ideias de Conteúdo', icon: '💡', key: 'content-ideas' },
    { path: '/clients', label: 'Clientes e Sites', icon: '👥', key: 'clients' },
    { path: '/commissions', label: 'Comissões', icon: '💵', key: 'commissions' },
    { path: '/checklists', label: 'Checklists', icon: '✅', key: 'checklists' },
    { path: '/documents', label: 'Documentos', icon: '📄', key: 'documents' },
  ]

  // Filtrar menu baseado em permissões
  const adminMenuItems = currentUser && currentUser.role === 'admin' 
    ? [
        { path: '/users', label: 'Usuários', icon: '👥', key: 'users' },
        { path: '/affiliates', label: 'Afiliados', icon: '🤝', key: 'affiliates' }
      ]
    : []
  
  // Afiliados também podem acessar a página de Afiliados para cadastrar outros
  const affiliateMenuItems = currentUser && currentUser.role === 'affiliate' && canAccessPage('affiliates')
    ? [
        { path: '/affiliates', label: 'Afiliados', icon: '🤝', key: 'affiliates' }
      ]
    : []
  
  const menuItems = currentUser && currentUser.role === 'admin' 
    ? [...allMenuItems, ...adminMenuItems]
    : [...allMenuItems.filter(item => canAccessPage(item.key)), ...affiliateMenuItems]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Elevare</h2>
          <p className="sidebar-subtitle">Dashboard Interno</p>
        </div>
        {currentUser && (
          <div className="sidebar-user">
            <UserMenu />
          </div>
        )}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
