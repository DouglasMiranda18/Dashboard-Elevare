import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import './Commissions.css'

const Commissions = () => {
  const { currentUser, allFirebaseUsers, fetchAllUsers, getAffiliateLevel } = useUser()
  const [selectedAffiliate, setSelectedAffiliate] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, paid, cancelled
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const isAdmin = currentUser?.role === 'admin'
  const affiliates = allFirebaseUsers.filter(u => u.role === 'affiliate' && !u.deleted && !u.pending)

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  // Se for afiliado, mostrar apenas suas próprias comissões
  const displayAffiliate = isAdmin ? selectedAffiliate : currentUser
  const affiliate = displayAffiliate 
    ? allFirebaseUsers.find(u => u.id === displayAffiliate.id || u.id === displayAffiliate)
    : null

  const formatCurrency = (value) => {
    if (!value || value === '') return 'R$ 0,00'
    const numValue = parseFloat(value.toString().replace(/[^\d,.-]/g, '').replace(',', '.'))
    if (isNaN(numValue)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-')
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: '⏳ Pendente', class: 'status-pending', color: '#f39c12' },
      paid: { text: '✅ Pago', class: 'status-paid', color: '#27ae60' },
      cancelled: { text: '❌ Cancelado', class: 'status-cancelled', color: '#e74c3c' }
    }
    return badges[status] || badges.pending
  }

  const getTypeBadge = (type) => {
    return type === 'direct' 
      ? { text: '💰 Venda Direta', class: 'type-direct' }
      : { text: '🎁 Bônus Recrutamento', class: 'type-recruitment' }
  }

  // Filtrar comissões
  const commissionHistory = affiliate?.commissionHistory || []
  const filteredCommissions = commissionHistory.filter(comm => {
    if (filterStatus !== 'all' && comm.status !== filterStatus) return false
    
    // Filtrar por mês
    const commDate = new Date(comm.date)
    const [year, month] = selectedMonth.split('-').map(Number)
    return commDate.getFullYear() === year && commDate.getMonth() + 1 === month
  })

  // Calcular totais
  const totals = filteredCommissions.reduce((acc, comm) => {
    if (comm.status === 'paid') {
      acc.paid += comm.amount || 0
    } else if (comm.status === 'pending') {
      acc.pending += comm.amount || 0
    }
    acc.total += comm.amount || 0
    return acc
  }, { paid: 0, pending: 0, total: 0 })

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

  return (
    <div className="commissions-page">
      <div className="page-header">
        <h1>💵 Comissões</h1>
        <p>{isAdmin ? 'Visualize e gerencie comissões de afiliados' : 'Acompanhe suas comissões e ganhos'}</p>
      </div>

      {isAdmin && (
        <div className="affiliate-selector-card">
          <label>Selecione o Afiliado:</label>
          <select
            value={selectedAffiliate?.id || ''}
            onChange={(e) => {
              const affiliate = affiliates.find(a => a.id === e.target.value)
              setSelectedAffiliate(affiliate || null)
            }}
            className="form-select"
          >
            <option value="">Selecione um afiliado...</option>
            {affiliates.map(aff => (
              <option key={aff.id} value={aff.id}>
                {aff.name} {aff.email ? `(${aff.email})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {displayAffiliate && affiliate ? (
        <>
          <div className="commission-summary-card">
            <div className="summary-header">
              <h2>Resumo de Comissões - {affiliate.name}</h2>
              {getAffiliateLevel && (
                <span className="affiliate-level-badge">
                  Nível {getAffiliateLevel(affiliate.id, allFirebaseUsers)}
                </span>
              )}
            </div>
            <div className="summary-stats">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Acumulado</h3>
                  <p className="stat-value">{formatCurrency(affiliate.totalCommissions || 0)}</p>
                </div>
              </div>
              <div className="stat-card stat-paid">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Pago</h3>
                  <p className="stat-value">{formatCurrency(totals.paid)}</p>
                </div>
              </div>
              <div className="stat-card stat-pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Pendente</h3>
                  <p className="stat-value">{formatCurrency(totals.pending)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="commissions-filters">
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
            <div className="status-filter">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="commissions-list">
            {filteredCommissions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💵</div>
                <h3>Nenhuma comissão encontrada</h3>
                <p>Não há comissões para o período selecionado</p>
              </div>
            ) : (
              <div className="commissions-table">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>Valor da Venda</th>
                      <th>Comissão</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommissions.map((comm) => {
                      const statusBadge = getStatusBadge(comm.status)
                      const typeBadge = getTypeBadge(comm.type)
                      return (
                        <tr key={comm.id}>
                          <td>{formatDate(comm.date)}</td>
                          <td>
                            <div className="commission-description">
                              <strong>{comm.description}</strong>
                              {comm.sellerId !== affiliate.id && (
                                <span className="seller-info">Vendedor: {comm.sellerName}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`type-badge ${typeBadge.class}`}>
                              {typeBadge.text}
                            </span>
                          </td>
                          <td>{formatCurrency(comm.saleValue)}</td>
                          <td>
                            <strong className="commission-amount">
                              {formatCurrency(comm.amount)} ({comm.percentage}%)
                            </strong>
                          </td>
                          <td>
                            <span className={`status-badge ${statusBadge.class}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : isAdmin ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>Selecione um afiliado</h3>
          <p>Escolha um afiliado acima para visualizar suas comissões</p>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💵</div>
          <h3>Nenhuma comissão disponível</h3>
          <p>Suas comissões aparecerão aqui quando houver vendas registradas</p>
        </div>
      )}
    </div>
  )
}

export default Commissions

