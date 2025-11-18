import React, { useState, useEffect } from 'react'
import { storage } from '../utils/localStorage'
import './Messages.css'

const Messages = () => {
  const [messages, setMessages] = useState({
    whatsappProspecting: 'Olá! Vi que você tem um negócio incrível e gostaria de conversar sobre como podemos ajudar você a alcançar resultados ainda melhores nas redes sociais. Tem um minuto para conversarmos?',
    instagramDM: 'Oi! Adorei seu perfil! Vejo que você está investindo bastante nas redes sociais. Que tal conversarmos sobre como potencializar ainda mais seus resultados?',
    closing: 'Que tal começarmos essa parceria agora mesmo? Estou aqui para tirar todas as suas dúvidas e mostrar como podemos fazer sua empresa crescer!',
    presentation: 'A Elevare é uma agência especializada em marketing digital e gestão de redes sociais. Trabalhamos com estratégias personalizadas para cada cliente, sempre focando em resultados reais e crescimento sustentável.',
    followUp: 'Olá! Espero que esteja tudo bem! Só queria verificar se você teve a chance de avaliar nossa proposta. Estou à disposição para qualquer dúvida!'
  })

  useEffect(() => {
    const saved = storage.get('messages', null)
    if (saved) {
      setMessages(saved)
    }
  }, [])

  useEffect(() => {
    storage.set('messages', messages)
  }, [messages])

  const handleChange = (key, value) => {
    setMessages(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Mensagem copiada para a área de transferência!')
    })
  }

  const messageTypes = [
    { 
      key: 'whatsappProspecting', 
      title: 'WhatsApp - Prospecção', 
      icon: '💬',
      description: 'Mensagem inicial para prospecção via WhatsApp'
    },
    { 
      key: 'instagramDM', 
      title: 'Instagram DM', 
      icon: '📸',
      description: 'Mensagem para direct do Instagram'
    },
    { 
      key: 'closing', 
      title: 'Mensagem de Fechamento', 
      icon: '✅',
      description: 'Script para fechar vendas'
    },
    { 
      key: 'presentation', 
      title: 'Apresentação da Elevare', 
      icon: '🎯',
      description: 'Texto de apresentação da agência'
    },
    { 
      key: 'followUp', 
      title: 'Follow-up', 
      icon: '🔄',
      description: 'Scripts de acompanhamento'
    },
  ]

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Mensagens Prontas</h1>
        <p>Scripts e mensagens editáveis para uso rápido</p>
      </div>

      <div className="messages-grid">
        {messageTypes.map((msgType) => (
          <div key={msgType.key} className="message-card">
            <div className="message-card-header">
              <div className="message-header-info">
                <span className="message-icon">{msgType.icon}</span>
                <div>
                  <h3 className="message-title">{msgType.title}</h3>
                  <p className="message-description">{msgType.description}</p>
                </div>
              </div>
              <button
                className="btn btn-small btn-primary"
                onClick={() => copyToClipboard(messages[msgType.key])}
              >
                📋 Copiar
              </button>
            </div>
            <textarea
              className="message-content editable"
              value={messages[msgType.key]}
              onChange={(e) => handleChange(msgType.key, e.target.value)}
              placeholder={`Digite aqui a mensagem para ${msgType.title.toLowerCase()}...`}
              rows="8"
            />
            <div className="message-footer">
              <span className="message-character-count">
                {messages[msgType.key].length} caracteres
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
