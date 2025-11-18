import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './ContentIdeas.css'

const ContentIdeas = () => {
  const { getUserKey } = useUser()
  const [ideas, setIdeas] = useState([])

  useEffect(() => {
    const loadIdeas = async () => {
      const saved = await storage.get(getUserKey('contentIdeas'), [])
      if (saved && saved.length > 0) {
        setIdeas(saved)
      }
    }
    loadIdeas()

    // Observar mudanças em tempo real (Firebase)
    const unsubscribe = storage.subscribe(
      getUserKey('contentIdeas'),
      (data) => {
        if (data && data.length > 0) {
          setIdeas(data)
        } else if (Array.isArray(data)) {
          setIdeas(data)
        }
      },
      []
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getUserKey])

  useEffect(() => {
    const saveIdeas = async () => {
      await storage.set(getUserKey('contentIdeas'), ideas)
    }
    saveIdeas()
  }, [ideas, getUserKey])

  const [showModal, setShowModal] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'post',
    description: '',
    notes: ''
  })

  const contentTypes = [
    { value: 'post', label: 'Post', icon: '📝' },
    { value: 'reel', label: 'Reel', icon: '🎬' },
    { value: 'story', label: 'Story', icon: '📸' },
    { value: 'carousel', label: 'Carrossel', icon: '🎠' },
    { value: 'theme', label: 'Tema', icon: '🎨' }
  ]

  const openModal = (idea = null) => {
    if (idea) {
      setEditingIdea(idea.id)
      setFormData(idea)
    } else {
      setEditingIdea(null)
      setFormData({
        title: '',
        type: 'post',
        description: '',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingIdea(null)
    setFormData({
      title: '',
      type: 'post',
      description: '',
      notes: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingIdea) {
      setIdeas(prev => prev.map(idea => 
        idea.id === editingIdea ? { ...idea, ...formData } : idea
      ))
    } else {
      const newIdea = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setIdeas(prev => [newIdea, ...prev])
    }
    closeModal()
  }

  const deleteIdea = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta ideia?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id))
    }
  }

  const getTypeIcon = (type) => {
    const typeObj = contentTypes.find(t => t.value === type)
    return typeObj ? typeObj.icon : '📝'
  }

  const getTypeLabel = (type) => {
    const typeObj = contentTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : 'Post'
  }

  return (
    <div className="content-ideas-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Ideias de Conteúdo</h1>
            <p>Organize suas ideias para posts, reels, stories e mais</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Ideia
          </button>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💡</div>
          <h3>Nenhuma ideia cadastrada</h3>
          <p>Clique no botão acima para adicionar sua primeira ideia de conteúdo</p>
        </div>
      ) : (
        <div className="ideas-grid">
          {ideas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <div className="idea-header">
                <div className="idea-type-badge">
                  <span className="idea-type-icon">{getTypeIcon(idea.type)}</span>
                  <span>{getTypeLabel(idea.type)}</span>
                </div>
                <div className="idea-actions">
                  <button
                    className="btn-icon"
                    onClick={() => openModal(idea)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => deleteIdea(idea.id)}
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <h3 className="idea-title">{idea.title || 'Sem título'}</h3>
              {idea.description && (
                <p className="idea-description">{idea.description}</p>
              )}
              {idea.notes && (
                <div className="idea-notes">
                  <strong>Notas:</strong> {idea.notes}
                </div>
              )}
              {idea.createdAt && (
                <div className="idea-date">
                  Criada em: {new Date(idea.createdAt).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingIdea ? 'Editar Ideia' : 'Nova Ideia de Conteúdo'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Post sobre dicas de marketing"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo de Conteúdo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-group input"
                  style={{ padding: '0.75rem', border: '2px solid var(--cream)', borderRadius: '8px' }}
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a ideia do conteúdo..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Notas Adicionais</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações, referências, hashtags..."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIdea ? 'Salvar Alterações' : 'Adicionar Ideia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentIdeas
