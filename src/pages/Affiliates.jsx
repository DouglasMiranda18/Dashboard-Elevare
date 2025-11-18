import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import './Affiliates.css'

const Affiliates = () => {
  const { affiliates, addAffiliate, updateAffiliate, deleteAffiliate, canAccessPage } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

  const openModal = (affiliate = null) => {
    if (affiliate) {
      setEditingAffiliate(affiliate.id)
      setFormData({
        name: affiliate.name || '',
        email: affiliate.email || '',
        phone: affiliate.phone || '',
        permissions: affiliate.permissions || []
      })
    } else {
      setEditingAffiliate(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        permissions: []
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAffiliate(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      permissions: []
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAffiliate) {
      updateAffiliate(editingAffiliate, formData)
    } else {
      addAffiliate(formData)
    }
    closeModal()
  }

  const togglePermission = (pageKey) => {
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
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes('all') ? [] : ['all']
    }))
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este afiliado?')) {
      deleteAffiliate(id)
    }
  }

  return (
    <div className="affiliates-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Afiliados</h1>
            <p>Gerencie afiliados e suas permissões de acesso</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Novo Afiliado
          </button>
        </div>
      </div>

      <div className="info-card">
        <h3>ℹ️ Como funciona</h3>
        <ul>
          <li><strong>Admin/Sócio:</strong> Têm acesso completo a todos os dados compartilhados</li>
          <li><strong>Afiliados:</strong> Têm acesso limitado apenas às páginas que você permitir</li>
          <li><strong>Dados:</strong> Admins e Sócios compartilham os mesmos dados. Afiliados têm dados separados</li>
        </ul>
      </div>

      {affiliates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h3>Nenhum afiliado cadastrado</h3>
          <p>Clique no botão acima para adicionar seu primeiro afiliado</p>
        </div>
      ) : (
        <div className="affiliates-grid">
          {affiliates.map((affiliate) => (
            <div key={affiliate.id} className="affiliate-card">
              <div className="affiliate-header">
                <div>
                  <h3 className="affiliate-name">
                    <span className="affiliate-icon">🤝</span>
                    {affiliate.name}
                  </h3>
                  {affiliate.email && (
                    <p className="affiliate-email">{affiliate.email}</p>
                  )}
                  {affiliate.phone && (
                    <p className="affiliate-phone">{affiliate.phone}</p>
                  )}
                </div>
                <span className="affiliate-badge">Afiliado</span>
              </div>

              <div className="affiliate-permissions">
                <h4>Permissões:</h4>
                {affiliate.permissions?.includes('all') ? (
                  <div className="permission-item all-permissions">
                    <span>✅ Acesso Total</span>
                  </div>
                ) : affiliate.permissions?.length > 0 ? (
                  <div className="permissions-list">
                    {availablePages
                      .filter(page => affiliate.permissions.includes(page.key))
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

              <div className="affiliate-actions">
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => openModal(affiliate)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(affiliate.id)}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAffiliate ? 'Editar Afiliado' : 'Novo Afiliado'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do afiliado"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
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

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAffiliate ? 'Salvar Alterações' : 'Adicionar Afiliado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Affiliates
