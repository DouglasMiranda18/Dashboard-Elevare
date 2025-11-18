import React, { useState, useEffect } from 'react'
import { storage } from '../utils/localStorage'
import './Documents.css'

const Documents = () => {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const saved = storage.get('documents', [])
    if (saved && saved.length > 0) {
      setDocuments(saved)
    }
  }, [])

  useEffect(() => {
    storage.set('documents', documents)
  }, [documents])

  const [showModal, setShowModal] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: ''
  })

  const openModal = (doc = null) => {
    if (doc) {
      setEditingDoc(doc.id)
      setFormData(doc)
    } else {
      setEditingDoc(null)
      setFormData({
        name: '',
        description: '',
        link: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingDoc(null)
    setFormData({
      name: '',
      description: '',
      link: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDoc) {
      setDocuments(prev => prev.map(doc => 
        doc.id === editingDoc ? { ...doc, ...formData } : doc
      ))
    } else {
      const newDoc = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setDocuments(prev => [newDoc, ...prev])
    }
    closeModal()
  }

  const deleteDocument = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    }
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Documentos</h1>
            <p>Armazene links, PDFs e documentos internos</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Documento
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>Nenhum documento cadastrado</h3>
          <p>Clique no botão acima para adicionar seu primeiro documento ou link</p>
        </div>
      ) : (
        <div className="documents-table-container">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Link</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="doc-name">{doc.name || 'Sem nome'}</td>
                  <td className="doc-description">{doc.description || '-'}</td>
                  <td className="doc-link">
                    {doc.link && isValidUrl(doc.link) ? (
                      <a 
                        href={doc.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="doc-link-btn"
                      >
                        🔗 Abrir Link
                      </a>
                    ) : (
                      <span className="doc-link-text">{doc.link || '-'}</span>
                    )}
                  </td>
                  <td className="doc-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openModal(doc)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => deleteDocument(doc.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDoc ? 'Editar Documento' : 'Novo Documento'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do documento"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do documento..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Link ou URL *</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://exemplo.com/documento ou caminho do arquivo"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDoc ? 'Salvar Alterações' : 'Adicionar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Documents
