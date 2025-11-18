import React, { useState, useEffect } from 'react'
import { storage } from '../utils/localStorage'
import './Checklists.css'

const Checklists = () => {
  const [checklists, setChecklists] = useState({
    monthly: {
      title: 'Checklist Mensal',
      items: [
        { id: 1, text: 'Revisar metas do mês', checked: false },
        { id: 2, text: 'Analisar relatórios de desempenho', checked: false },
        { id: 3, text: 'Atualizar portfólio', checked: false },
        { id: 4, text: 'Reunião com equipe', checked: false }
      ]
    },
    weekly: {
      title: 'Checklist Semanal',
      items: [
        { id: 1, text: 'Planejar conteúdo da semana', checked: false },
        { id: 2, text: 'Publicar posts agendados', checked: false },
        { id: 3, text: 'Interagir com seguidores', checked: false },
        { id: 4, text: 'Revisar métricas', checked: false }
      ]
    },
    prospecting: {
      title: 'Checklist de Prospecção',
      items: [
        { id: 1, text: 'Identificar potenciais clientes', checked: false },
        { id: 2, text: 'Enviar mensagens de prospecção', checked: false },
        { id: 3, text: 'Fazer follow-up', checked: false },
        { id: 4, text: 'Agendar reuniões', checked: false }
      ]
    },
    closing: {
      title: 'Checklist de Fechamento',
      items: [
        { id: 1, text: 'Apresentar proposta', checked: false },
        { id: 2, text: 'Responder objeções', checked: false },
        { id: 3, text: 'Negociar condições', checked: false },
        { id: 4, text: 'Enviar contrato', checked: false }
      ]
    }
  })

  useEffect(() => {
    const saved = storage.get('checklists', null)
    if (saved) {
      setChecklists(saved)
    }
  }, [])

  useEffect(() => {
    storage.set('checklists', checklists)
  }, [checklists])

  const toggleItem = (checklistKey, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [checklistKey]: {
        ...prev[checklistKey],
        items: prev[checklistKey].items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }
    }))
  }

  const updateItemText = (checklistKey, itemId, newText) => {
    setChecklists(prev => ({
      ...prev,
      [checklistKey]: {
        ...prev[checklistKey],
        items: prev[checklistKey].items.map(item =>
          item.id === itemId ? { ...item, text: newText } : item
        )
      }
    }))
  }

  const addItem = (checklistKey) => {
    const newId = Math.max(...checklists[checklistKey].items.map(i => i.id), 0) + 1
    setChecklists(prev => ({
      ...prev,
      [checklistKey]: {
        ...prev[checklistKey],
        items: [...prev[checklistKey].items, { id: newId, text: 'Nova tarefa', checked: false }]
      }
    }))
  }

  const removeItem = (checklistKey, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [checklistKey]: {
        ...prev[checklistKey],
        items: prev[checklistKey].items.filter(item => item.id !== itemId)
      }
    }))
  }

  const getProgress = (items) => {
    const checked = items.filter(item => item.checked).length
    return items.length > 0 ? Math.round((checked / items.length) * 100) : 0
  }

  return (
    <div className="checklists-page">
      <div className="page-header">
        <h1>Checklists</h1>
        <p>Organize suas tarefas e rotinas</p>
      </div>

      <div className="checklists-grid">
        {Object.entries(checklists).map(([key, checklist]) => {
          const progress = getProgress(checklist.items)
          return (
            <div key={key} className="checklist-card">
              <div className="checklist-header">
                <h3 className="checklist-title">{checklist.title}</h3>
                <div className="checklist-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              </div>

              <div className="checklist-items">
                {checklist.items.map((item) => (
                  <div key={item.id} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(key, item.id)}
                      className="checklist-checkbox"
                    />
                    <input
                      type="text"
                      className={`checklist-item-text ${item.checked ? 'checked' : ''}`}
                      value={item.text}
                      onChange={(e) => updateItemText(key, item.id, e.target.value)}
                    />
                    <button
                      className="btn-remove-checklist-item"
                      onClick={() => removeItem(key, item.id)}
                      title="Remover item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-small btn-secondary"
                onClick={() => addItem(key)}
              >
                + Adicionar item
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Checklists
