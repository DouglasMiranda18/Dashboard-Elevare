import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import './UserMenu.css'

const UserMenu = () => {
  const { currentUser, logout } = useUser()
  const [showMenu, setShowMenu] = useState(false)

  if (!currentUser) return null

  return (
    <div className="user-menu">
      <button className="user-menu-button" onClick={() => setShowMenu(!showMenu)}>
        <span className="user-icon">👤</span>
        <span className="user-name">{currentUser.name}</span>
        <span className="user-chevron">{showMenu ? '▲' : '▼'}</span>
      </button>
      {showMenu && (
        <>
          <div className="user-menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="user-menu-dropdown">
            <div className="user-menu-info">
              <span className="user-menu-label">Perfil ativo:</span>
              <span className="user-menu-value">{currentUser.name}</span>
            </div>
            <button className="user-menu-item" onClick={logout}>
              🚪 Trocar de Perfil
            </button>
            <p className="user-menu-note">
              Seus dados estão salvos separadamente para este perfil
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default UserMenu
