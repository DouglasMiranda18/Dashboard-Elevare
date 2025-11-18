import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './Clients.css'

const Clients = () => {
  const { getUserKey, currentUser } = useUser()
  const isAffiliate = currentUser?.role === 'affiliate'
  const [clients, setClients] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    const loadClients = async () => {
      const saved = await storage.get(getUserKey('clients'), [])
      if (saved && saved.length > 0) {
        setClients(saved)
      }
    }
    loadClients()

    // Observar mudanças em tempo real (Firebase)
    const unsubscribe = storage.subscribe(
      getUserKey('clients'),
      (data) => {
        if (data && data.length > 0) {
          setClients(data)
        }
      },
      []
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getUserKey])

  useEffect(() => {
    const saveClients = async () => {
      if (clients.length > 0 || Object.keys(clients).length > 0) {
        await storage.set(getUserKey('clients'), clients)
      }
    }
    saveClients()
  }, [clients, getUserKey])

  const [showModal, setShowModal] = useState(false)
  const [showRevenueModal, setShowRevenueModal] = useState(false)
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [editingRevenueClient, setEditingRevenueClient] = useState(null)
  const [editingSiteClient, setEditingSiteClient] = useState(null)
  const [formData, setFormData] = useState({
    type: 'client',
    name: '',
    email: '',
    phone: '',
    company: '',
    package: '',
    monthlyRevenueHistory: {},
    siteValueHistory: {},
    siteCommission: '',
    status: 'prospect',
    notes: ''
  })

  const statusOptions = [
    { value: 'prospect', label: 'Prospect', color: '#f39c12' },
    { value: 'negotiation', label: 'Em Negociação', color: '#3498db' },
    { value: 'active', label: 'Cliente Ativo', color: '#27ae60' },
    { value: 'inactive', label: 'Inativo', color: '#95a5a6' },
    { value: 'lost', label: 'Perdido', color: '#e74c3c' }
  ]

  const typeOptions = [
    { value: 'client', label: 'Cliente', icon: '👥' },
    { value: 'site', label: 'Site', icon: '🌐' }
  ]

  const formatCurrency = (value) => {
    if (!value || value === '') return 'R$ 0,00'
    const numValue = parseFloat(value.toString().replace(/[^\d,.-]/g, '').replace(',', '.'))
    if (isNaN(numValue)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  const parseCurrency = (value) => {
    if (!value) return ''
    return value.toString().replace(/[^\d,.-]/g, '').replace(',', '.')
  }

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-')
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  const changeMonth = (direction) => {
    const [year, month] = selectedMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month + direction

    if (newMonth > 12) {
      newMonth = 1
      newYear++
    } else if (newMonth < 1) {
      newMonth = 12
      newYear--
    }

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const goToCurrentMonth = () => {
    const now = new Date()
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  }

  const getClientRevenueForMonth = (client, month) => {
    if (client.type !== 'client' || !client.monthlyRevenueHistory) return 0
    const monthRevenue = client.monthlyRevenueHistory[month]
    if (!monthRevenue) return 0
    const revenue = parseFloat(parseCurrency(monthRevenue))
    return isNaN(revenue) ? 0 : revenue
  }

  const getSiteValueForMonth = (site, month) => {
    if (site.type !== 'site' || !site.siteValueHistory) return 0
    const monthValue = site.siteValueHistory[month]
    if (!monthValue) return 0
    const value = parseFloat(parseCurrency(monthValue))
    return isNaN(value) ? 0 : value
  }

  const calculateRevenue = () => {
    let monthlyRevenue = 0
    let sitesRevenue = 0
    let totalRevenue = 0 // Renda total para afiliados (clientes + sites)

    clients.forEach(item => {
      if (item.type === 'client' && item.status === 'active') {
        const revenue = getClientRevenueForMonth(item, selectedMonth)
        monthlyRevenue += revenue
        // Para afiliados, somar renda de clientes também
        if (isAffiliate) {
          totalRevenue += revenue
        }
      } else if (item.type === 'site' && item.status === 'active') {
        const value = getSiteValueForMonth(item, selectedMonth)
        sitesRevenue += value
        // Para afiliados, somar valor dos sites como renda
        if (isAffiliate) {
          totalRevenue += value
        }
      }
    })

    const total = monthlyRevenue + sitesRevenue
    
    return {
      monthlyRevenue: monthlyRevenue || 0,
      sitesRevenue: sitesRevenue || 0,
      total: total || 0,
      totalRevenue: totalRevenue || 0 // Renda total para afiliados
    }
  }

  const revenue = calculateRevenue()

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client.id)
      setFormData({
        type: client.type || 'client',
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        package: client.package || '',
        monthlyRevenueHistory: client.monthlyRevenueHistory || {},
        siteValueHistory: client.siteValueHistory || {},
        siteCommission: client.siteCommission || '',
        status: client.status || 'prospect',
        notes: client.notes || ''
      })
    } else {
      setEditingClient(null)
      setFormData({
        type: 'client',
        name: '',
        email: '',
        phone: '',
        company: '',
        package: '',
        monthlyRevenueHistory: {},
        siteValueHistory: {},
        siteCommission: '',
        status: 'prospect',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const openRevenueModal = (client) => {
    setEditingRevenueClient(client.id)
    setFormData({
      ...client,
      monthlyRevenueHistory: client.monthlyRevenueHistory || {}
    })
    setShowRevenueModal(true)
  }

  const openSiteModal = (site) => {
    setEditingSiteClient(site.id)
    setFormData({
      ...site,
      siteValueHistory: site.siteValueHistory || {}
    })
    setShowSiteModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setShowRevenueModal(false)
    setShowSiteModal(false)
    setEditingClient(null)
    setEditingRevenueClient(null)
    setEditingSiteClient(null)
    setFormData({
      type: 'client',
      name: '',
      email: '',
      phone: '',
      company: '',
      package: '',
      monthlyRevenueHistory: {},
      siteValueHistory: {},
      siteCommission: '',
      status: 'prospect',
      notes: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient ? { ...client, ...formData } : client
      ))
    } else {
      const newClient = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setClients(prev => [newClient, ...prev])
    }
    closeModal()
  }

  const handleRevenueSubmit = (e) => {
    e.preventDefault()
    setClients(prev => prev.map(client => 
      client.id === editingRevenueClient ? { ...client, monthlyRevenueHistory: formData.monthlyRevenueHistory } : client
    ))
    closeModal()
  }

  const handleSiteSubmit = (e) => {
    e.preventDefault()
    setClients(prev => prev.map(client => 
      client.id === editingSiteClient ? { ...client, siteValueHistory: formData.siteValueHistory } : client
    ))
    closeModal()
  }

  const updateRevenueForMonth = (month, value) => {
    setFormData(prev => ({
      ...prev,
      monthlyRevenueHistory: {
        ...prev.monthlyRevenueHistory,
        [month]: value
      }
    }))
  }

  const updateSiteValueForMonth = (month, value) => {
    setFormData(prev => ({
      ...prev,
      siteValueHistory: {
        ...prev.siteValueHistory,
        [month]: value
      }
    }))
  }

  const deleteClient = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setClients(prev => prev.filter(client => client.id !== id))
    }
  }

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const getTypeInfo = (type) => {
    return typeOptions.find(t => t.value === type) || typeOptions[0]
  }

  const activeClients = clients.filter(c => c.type === 'client' && c.status === 'active').length
  const activeSites = clients.filter(c => c.type === 'site' && c.status === 'active').length

  return (
    <div className="clients-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Clientes e Sites</h1>
            <p>Gerencie seus clientes e sites</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Novo Item
          </button>
        </div>
      </div>

      {/* Seção de Acompanhamento de Renda - Apenas para Admins */}
      {!isAffiliate && (
        <div className="revenue-section">
          <div className="revenue-header">
            <h2 className="revenue-title">Acompanhamento de Renda</h2>
            <div className="month-selector">
              <button className="btn-month-nav" onClick={() => changeMonth(-1)}>
                ← Mês Anterior
              </button>
              <div className="month-display">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-picker"
                />
                <span className="month-label">{formatMonth(selectedMonth)}</span>
              </div>
              <button className="btn-month-nav" onClick={() => changeMonth(1)}>
                Próximo Mês →
              </button>
              <button className="btn-today-month" onClick={goToCurrentMonth}>
                Hoje
              </button>
            </div>
          </div>
          <div className="revenue-cards">
            <div className="revenue-card revenue-monthly">
              <div className="revenue-icon">👥</div>
              <div className="revenue-content">
                <h3>Renda Mensal (Clientes)</h3>
                <p className="revenue-value">{formatCurrency(revenue.monthlyRevenue)}</p>
                <p className="revenue-count">{activeClients} cliente{activeClients !== 1 ? 's' : ''} ativo{activeClients !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="revenue-card revenue-sites">
              <div className="revenue-icon">🌐</div>
              <div className="revenue-content">
                <h3>Total Sites Vendidos</h3>
                <p className="revenue-value">{formatCurrency(revenue.sitesRevenue)}</p>
                <p className="revenue-count">{activeSites} site{activeSites !== 1 ? 's' : ''} ativo{activeSites !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="revenue-card revenue-total">
              <div className="revenue-icon">💵</div>
              <div className="revenue-content">
                <h3>Total Geral</h3>
                <p className="revenue-value revenue-total-value">{formatCurrency(revenue.total)}</p>
                <p className="revenue-count">Renda mensal + Sites</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção de Renda - Apenas para Afiliados */}
      {isAffiliate && (
        <div className="revenue-section commission-section">
          <div className="revenue-header">
            <h2 className="revenue-title">Minha Renda</h2>
            <div className="month-selector">
              <button className="btn-month-nav" onClick={() => changeMonth(-1)}>
                ← Mês Anterior
              </button>
              <div className="month-display">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-picker"
                />
                <span className="month-label">{formatMonth(selectedMonth)}</span>
              </div>
              <button className="btn-month-nav" onClick={() => changeMonth(1)}>
                Próximo Mês →
              </button>
              <button className="btn-today-month" onClick={goToCurrentMonth}>
                Hoje
              </button>
            </div>
          </div>
          <div className="revenue-cards">
            <div className="revenue-card revenue-commission">
              <div className="revenue-icon">💵</div>
              <div className="revenue-content">
                <h3>Renda Total ({formatMonth(selectedMonth)})</h3>
                <p className="revenue-value revenue-commission-value">{formatCurrency(revenue.totalRevenue)}</p>
                <p className="revenue-count">Renda de clientes e sites que você adicionou</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum cliente ou site cadastrado</h3>
          <p>Clique no botão acima para adicionar seu primeiro item</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => {
            const statusInfo = getStatusInfo(client.status)
            const typeInfo = getTypeInfo(client.type)
            const currentRevenue = client.type === 'client' ? getClientRevenueForMonth(client, selectedMonth) : 0
            const currentSiteValue = client.type === 'site' ? getSiteValueForMonth(client, selectedMonth) : 0
            return (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{typeInfo.icon}</span>
                      <h3 className="client-name">{client.name || 'Sem nome'}</h3>
                      <span className="client-type-badge">{typeInfo.label}</span>
                    </div>
                    {client.company && (
                      <p className="client-company">{client.company}</p>
                    )}
                  </div>
                  <span 
                    className="client-status"
                    style={{ 
                      backgroundColor: `${statusInfo.color}20`,
                      color: statusInfo.color,
                      borderColor: statusInfo.color
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Mostrar valor baseado no tipo - Apenas para Admins */}
                {!isAffiliate && client.type === 'client' && (
                  <div className="client-revenue">
                    <span className="revenue-label revenue-label-money">Renda Mensal ({formatMonth(selectedMonth)}):</span>
                    <span className="revenue-amount">{formatCurrency(currentRevenue)}</span>
                    <button 
                      className="btn-edit-revenue"
                      onClick={() => openRevenueModal(client)}
                      title="Editar renda mensal"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                {!isAffiliate && client.type === 'site' && (
                  <div className="client-revenue">
                    <span className="revenue-label revenue-label-site">Valor do Site ({formatMonth(selectedMonth)}):</span>
                    <span className="revenue-amount">{formatCurrency(currentSiteValue)}</span>
                    <button 
                      className="btn-edit-revenue"
                      onClick={() => openSiteModal(client)}
                      title="Editar valor do site"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                {/* Mostrar renda para afiliados */}
                {isAffiliate && client.type === 'client' && (
                  <div className="client-revenue client-commission">
                    <span className="revenue-label revenue-label-money">Renda Mensal ({formatMonth(selectedMonth)}):</span>
                    <span className="revenue-amount commission-amount">{formatCurrency(currentRevenue)}</span>
                  </div>
                )}
                {isAffiliate && client.type === 'site' && (
                  <div className="client-revenue client-commission">
                    <span className="revenue-label revenue-label-site">Valor do Site ({formatMonth(selectedMonth)}):</span>
                    <span className="revenue-amount commission-amount">{formatCurrency(currentSiteValue)}</span>
                  </div>
                )}

                <div className="client-info">
                  {client.email && (
                    <div className="client-info-item">
                      <span className="client-info-label">📧 Email:</span>
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="client-info-item">
                      <span className="client-info-label">📱 Telefone:</span>
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.type === 'client' && client.package && (
                    <div className="client-info-item">
                      <span className="client-info-label">📦 Pacote:</span>
                      <span>{client.package}</span>
                    </div>
                  )}
                  {client.type === 'site' && client.siteCommission && (
                    <div className="client-info-item">
                      <span className="client-info-label client-info-label-money">Comissão:</span>
                      <span>{formatCurrency(client.siteCommission)}</span>
                    </div>
                  )}
                  {client.notes && (
                    <div className="client-notes">
                      <strong>Observações:</strong>
                      <p>{client.notes}</p>
                    </div>
                  )}
                </div>

                <div className="client-actions">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => openModal(client)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => deleteClient(client.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Edição Normal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Editar Item' : 'Novo Item'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-group input"
                  style={{ padding: '0.75rem', border: '2px solid var(--cream)', borderRadius: '8px' }}
                  required
                >
                  {typeOptions.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.type === 'client' ? 'Nome completo' : 'Nome do site/projeto'}
                  required
                />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              {formData.type === 'client' ? (
                <>
                  <div className="form-group">
                    <label>Pacote</label>
                    <input
                      type="text"
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      placeholder="Ex: Elevare Pro"
                    />
                  </div>
                  <div className="form-group">
                    <label>Renda Mensal Atual ({formatMonth(selectedMonth)})</label>
                    <input
                      type="text"
                      value={formData.monthlyRevenueHistory[selectedMonth] || ''}
                      onChange={(e) => updateRevenueForMonth(selectedMonth, e.target.value)}
                      placeholder="Ex: 1500 ou 1500,00"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Valor do Site ({formatMonth(selectedMonth)})</label>
                    <input
                      type="text"
                      value={formData.siteValueHistory[selectedMonth] || ''}
                      onChange={(e) => updateSiteValueForMonth(selectedMonth, e.target.value)}
                      placeholder="Ex: 5000 ou 5000,00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Comissão (R$)</label>
                    <input
                      type="text"
                      value={formData.siteCommission}
                      onChange={(e) => setFormData({ ...formData, siteCommission: e.target.value })}
                      placeholder="Ex: 500 ou 500,00"
                    />
                  </div>
                </>
              )}
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
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-group input"
                  style={{ padding: '0.75rem', border: '2px solid var(--cream)', borderRadius: '8px' }}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações..."
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Salvar Alterações' : 'Adicionar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Renda Mensal */}
      {showRevenueModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-revenue" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Renda Mensal - {formData.name}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleRevenueSubmit}>
              <div className="revenue-history">
                <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
                  Edite a renda mensal para cada mês. Apenas meses com valor serão contabilizados.
                </p>
                {[...Array(12)].map((_, index) => {
                  const currentYear = new Date().getFullYear()
                  const monthIndex = index + 1
                  const monthKey = `${currentYear}-${String(monthIndex).padStart(2, '0')}`
                  return (
                    <div key={monthKey} className="revenue-month-item">
                      <label>{formatMonth(monthKey)}</label>
                      <input
                        type="text"
                        value={formData.monthlyRevenueHistory[monthKey] || ''}
                        onChange={(e) => updateRevenueForMonth(monthKey, e.target.value)}
                        placeholder="Ex: 1500"
                        className="revenue-input"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Rendas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Valor do Site */}
      {showSiteModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-revenue" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Valor do Site - {formData.name}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSiteSubmit}>
              <div className="revenue-history">
                <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
                  Edite o valor do site para cada mês. Insira o valor apenas no mês em que a venda foi feita.
                </p>
                {[...Array(12)].map((_, index) => {
                  const currentYear = new Date().getFullYear()
                  const monthIndex = index + 1
                  const monthKey = `${currentYear}-${String(monthIndex).padStart(2, '0')}`
                  return (
                    <div key={monthKey} className="revenue-month-item">
                      <label>{formatMonth(monthKey)}</label>
                      <input
                        type="text"
                        value={formData.siteValueHistory[monthKey] || ''}
                        onChange={(e) => updateSiteValueForMonth(monthKey, e.target.value)}
                        placeholder="Ex: 5000"
                        className="revenue-input"
                      />
                    </div>
                  )
                })}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Valores
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients