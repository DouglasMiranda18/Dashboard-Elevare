import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { path: '/', label: 'Página Inicial', icon: '🏠' },
    { path: '/social-media', label: 'Agenda Diária', icon: '📅' },
    { path: '/messages', label: 'Mensagens Prontas', icon: '💬' },
    { path: '/packages', label: 'Pacotes', icon: '📦' },
    { path: '/content-ideas', label: 'Ideias de Conteúdo', icon: '💡' },
    { path: '/clients', label: 'Clientes', icon: '👥' },
    { path: '/checklists', label: 'Checklists', icon: '✅' },
    { path: '/documents', label: 'Documentos', icon: '📄' },
  ]

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
