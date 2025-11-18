import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import './Users.css'

const Users = () => {
  const { allFirebaseUsers, currentUser, fetchAllUsers, updateUserRole } = useUser()
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    role: 'affiliate',
    permissions: []
  })

  const availablePages = [
    { key: 'home', label: 'Página Inicial', icon: '🏠' },
    { key: 'social-media', label: 'Agenda Diária', icon: '📅' },
    { key: 'messages', label: 'Mensagens Prontas', icon: '💬' },
    { key: 'packages', label: 'Pacotes', icon: '📦' },
    { key: 'content-ideas', label: 'Ideias de Conteúdo', icon: '💡' },
    { key: 'clients', label: 'Clientes e Sites', icon: '👥' },
    { key: 'checklists', label: 'Checklists', icon: '✅' },
    { key: 'documents', label: 'Documentos', icon: '📄' }
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    await fetchAllUsers()
    setLoading(false)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      role: user.role || 'affiliate',
      permissions: user.permissions || []
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      role: 'affiliate',
      permissions: []
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    const result = await updateUserRole(
      editingUser.id,
      formData.role,
      formData.role === 'admin' ? ['all'] : formData.permissions
    )

    if (result.success) {
      closeModal()
      await loadUsers()
    } else {
      alert('Erro ao atualizar usuário: ' + result.error)
    }
  }

  const togglePermission = (pageKey) => {
    if (formData.role === 'admin') return // Admin tem todas as permissões
    
    setFormData(prev => {
      if (prev.permissions.includes('all')) {
        return { ...prev, permissions: [pageKey] }
      }
      if (prev.permissions.includes(pageKey)) {
        return { 
          ...prev, 
          permissions: prev.permissions.filter(p => p !== pageKey)
        }
      }
      return { 
        ...prev, 
        permissions: [...prev.permissions, pageKey]
      }
    })
  }

  const toggleAllPermissions = () => {
    if (formData.role === 'admin') return
    
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes('all') ? [] : ['all']
    }))
  }

  const getRoleBadge = (user) => {
    if (user.role === 'admin') {
      return <span className="role-badge role-admin">👑 Admin</span>
    }
    if (user.pending) {
      return <span className="role-badge role-pending">⏳ Pendente</span>
    }
    return <span className="role-badge role-affiliate">🤝 Afiliado</span>
  }

  // Filtrar usuários (excluir deletados)
  const activeUsers = allFirebaseUsers.filter(u => !u.deleted)

  if (loading) {
    return (
      <div className="users-page">
        <div className="page-header">
          <h1>Usuários</h1>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Usuários</h1>
            <p>Gerencie os papéis e permissões dos usuários do sistema</p>
          </div>
          <button className="btn btn-secondary" onClick={loadUsers}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      <div className="info-card">
        <h3>ℹ️ Como funciona</h3>
        <ul>
          <li><strong>Admin:</strong> Tem acesso completo a todos os dados compartilhados</li>
          <li><strong>Afiliado:</strong> Tem acesso limitado apenas às páginas permitidas</li>
          <li><strong>Primeiro usuário:</strong> Automaticamente se torna admin</li>
          <li><strong>Novos usuários:</strong> São criados como afiliados por padrão</li>
        </ul>
      </div>

      {activeUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum usuário cadastrado</h3>
          <p>Os usuários aparecerão aqui após se registrarem no sistema</p>
        </div>
      ) : (
        <div className="users-grid">
          {activeUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <div>
                  <h3 className="user-name">
                    {user.name || 'Sem nome'}
                  </h3>
                  <p className="user-email">{user.email}</p>
                  {user.createdAt && (
                    <p className="user-date">
                      Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {user.pending && (
                    <p className="user-pending-notice">
                      ⚠️ Aguardando registro do usuário
                    </p>
                  )}
                </div>
                {getRoleBadge(user)}
              </div>

              <div className="user-permissions">
                <h4>Permissões:</h4>
                {user.role === 'admin' ? (
                  <div className="permission-item all-permissions">
                    <span>✅ Acesso Total</span>
                  </div>
                ) : user.permissions?.includes('all') ? (
                  <div className="permission-item all-permissions">
                    <span>✅ Acesso Total</span>
                  </div>
                ) : user.permissions?.length > 0 ? (
                  <div className="permissions-list">
                    {availablePages
                      .filter(page => user.permissions.includes(page.key))
                      .map(page => (
                        <div key={page.key} className="permission-item">
                          <span>{page.icon}</span>
                          <span>{page.label}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="permission-item no-permissions">
                    <span>⚠️ Sem permissões</span>
                  </div>
                )}
              </div>

              {currentUser?.role === 'admin' && (
                <div className="user-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => openEditModal(user)}
                  >
                    ✏️ Editar Papel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && editingUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Papel do Usuário</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={editingUser.name || ''}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  disabled
                  className="disabled-input"
                />
              </div>
              
              <div className="form-group">
                <label>Papel *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, permissions: e.target.value === 'admin' ? ['all'] : formData.permissions })}
                  required
                >
                  <option value="affiliate">🤝 Afiliado</option>
                  <option value="admin">👑 Admin</option>
                </select>
                <p className="form-hint">
                  Admins têm acesso completo. Afiliados têm acesso limitado.
                </p>
              </div>

              {formData.role === 'affiliate' && (
                <div className="form-group">
                  <label>Permissões de Acesso *</label>
                  <div className="permissions-selector">
                    <button
                      type="button"
                      className={`permission-toggle-all ${formData.permissions.includes('all') ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleAllPermissions()
                      }}
                    >
                      {formData.permissions.includes('all') ? '✅ Acesso Total' : '☐ Acesso Total'}
                    </button>
                    <div className="permissions-grid">
                      {availablePages.map((page) => (
                        <button
                          key={page.key}
                          type="button"
                          className={`permission-toggle ${formData.permissions.includes(page.key) || formData.permissions.includes('all') ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            togglePermission(page.key)
                          }}
                        >
                          <span className="permission-icon">{page.icon}</span>
                          <span className="permission-label">{page.label}</span>
                          {formData.permissions.includes(page.key) || formData.permissions.includes('all') ? (
                            <span className="permission-check">✓</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="form-hint">
                    Selecione as páginas que este afiliado poderá acessar
                  </p>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

