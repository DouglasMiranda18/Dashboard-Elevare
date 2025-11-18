import React, { useState, useEffect } from 'react'
import { storage } from '../utils/localStorage'
import './Clients.css'

const Clients = () => {
  const [clients, setClients] = useState([])

  useEffect(() => {
    const saved = storage.get('clients', [])
    if (saved && saved.length > 0) {
      setClients(saved)
    }
  }, [])

  useEffect(() => {
    storage.set('clients', clients)
  }, [clients])

  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    package: '',
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

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client.id)
      setFormData(client)
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        package: '',
        status: 'prospect',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      package: '',
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

  const deleteClient = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id))
    }
  }

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  return (
    <div className="clients-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Clientes</h1>
            <p>Gerencie seus clientes e prospects</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum cliente cadastrado</h3>
          <p>Clique no botão acima para adicionar seu primeiro cliente</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => {
            const statusInfo = getStatusInfo(client.status)
            return (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <div>
                    <h3 className="client-name">{client.name || 'Sem nome'}</h3>
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
                  {client.package && (
                    <div className="client-info-item">
                      <span className="client-info-label">📦 Pacote:</span>
                      <span>{client.package}</span>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
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
                <label>Pacote</label>
                <input
                  type="text"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  placeholder="Ex: Elevare Pro"
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
                  placeholder="Anotações sobre o cliente..."
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Salvar Alterações' : 'Adicionar Cliente'}
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
