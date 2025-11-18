import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import './Affiliates.css'

const Affiliates = () => {
  const { allFirebaseUsers, addAffiliate, updateAffiliate, deleteAffiliate, fetchAllUsers, getAffiliateLevel } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    permissions: [],
    recruitedBy: null
  })

  // Filtrar apenas afiliados (excluir pendentes deletados)
  const affiliates = allFirebaseUsers.filter(u => 
    u.role === 'affiliate' && !u.deleted
  )

  // Lista de afiliados disponíveis para recrutamento (excluindo o próprio se estiver editando)
  const availableRecruiters = affiliates.filter(a => 
    !editingAffiliate || a.id !== editingAffiliate
  )

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

  const openModal = async (affiliate = null) => {
    // Atualizar lista de usuários antes de abrir modal
    await fetchAllUsers()
    
    if (affiliate) {
      setEditingAffiliate(affiliate.id)
      setFormData({
        name: affiliate.name || '',
        email: affiliate.email || '',
        phone: affiliate.phone || '',
        permissions: affiliate.permissions || [],
        recruitedBy: affiliate.recruitedBy || null
      })
    } else {
      setEditingAffiliate(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        permissions: ['home', 'social-media', 'messages', 'packages', 'content-ideas', 'clients', 'commissions'], // Permissões padrão
        recruitedBy: null
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
      permissions: ['home', 'social-media', 'messages', 'packages', 'content-ideas', 'clients'], // Permissões padrão
      recruitedBy: null
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingAffiliate) {
        const result = await updateAffiliate(editingAffiliate, formData)
        if (!result.success) {
          alert('Erro ao atualizar afiliado: ' + result.error)
        }
      } else {
        const result = await addAffiliate(formData)
        if (!result.success) {
          alert('Erro ao adicionar afiliado: ' + result.error)
        }
      }
      await fetchAllUsers()
      closeModal()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar afiliado')
    } finally {
      setLoading(false)
    }
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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este afiliado?')) {
      setLoading(true)
      try {
        const result = await deleteAffiliate(id)
        if (result.success) {
          await fetchAllUsers()
        } else {
          alert('Erro ao excluir afiliado: ' + result.error)
        }
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao excluir afiliado')
      } finally {
        setLoading(false)
      }
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
          <li><strong>Registro:</strong> Quando você adiciona um afiliado, ele precisa se registrar com o email informado para ativar a conta</li>
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
                  {affiliate.recruitedBy && (() => {
                    const recruiter = allFirebaseUsers.find(u => u.id === affiliate.recruitedBy)
                    return recruiter ? (
                      <p className="affiliate-recruiter">
                        👤 Recrutado por: {recruiter.name}
                        {getAffiliateLevel && (
                          <span className="affiliate-level">
                            (Nível {getAffiliateLevel(affiliate.id, allFirebaseUsers)})
                          </span>
                        )}
                      </p>
                    ) : null
                  })()}
                  {affiliate.pending && (
                    <p className="affiliate-pending-notice">
                      ⏳ Aguardando registro
                    </p>
                  )}
                </div>
                <span className={`affiliate-badge ${affiliate.pending ? 'affiliate-pending' : ''}`}>
                  {affiliate.pending ? '⏳ Pendente' : '🤝 Afiliado'}
                </span>
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
                <label>Email *</label>
                {editingAffiliate ? (
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                    placeholder="email@exemplo.com"
                  />
                ) : (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                  />
                )}
                <p className="form-hint">
                  {editingAffiliate 
                    ? 'O email não pode ser alterado após a criação' 
                    : 'O afiliado precisará usar este email para se registrar no sistema'}
                </p>
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
                <label>Recrutado por (Opcional)</label>
                <select
                  value={formData.recruitedBy || ''}
                  onChange={(e) => setFormData({ ...formData, recruitedBy: e.target.value || null })}
                  className="form-select"
                >
                  <option value="">Nenhum (Nível 1)</option>
                  {availableRecruiters.map(recruiter => (
                    <option key={recruiter.id} value={recruiter.id}>
                      {recruiter.name} {recruiter.pending ? '(Pendente)' : ''}
                      {getAffiliateLevel && ` - Nível ${getAffiliateLevel(recruiter.id, allFirebaseUsers)}`}
                    </option>
                  ))}
                </select>
                <p className="form-hint">
                  Selecione o afiliado que recrutou este novo afiliado. Isso define a hierarquia de comissões.
                  {formData.recruitedBy && getAffiliateLevel && (
                    <span className="level-preview">
                      {' '}Este afiliado será Nível {getAffiliateLevel(formData.recruitedBy, allFirebaseUsers) + 1}
                    </span>
                  )}
                </p>
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
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Salvando...' : (editingAffiliate ? 'Salvar Alterações' : 'Adicionar Afiliado')}
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
