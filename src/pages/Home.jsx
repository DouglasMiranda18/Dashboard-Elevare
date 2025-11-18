import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const quickLinks = [
    { path: '/social-media', label: 'Agenda Diária', icon: '📅', color: 'var(--primary)' },
    { path: '/messages', label: 'Mensagens Prontas', icon: '💬', color: 'var(--primary-dark)' },
    { path: '/packages', label: 'Pacotes', icon: '📦', color: 'var(--brown)' },
    { path: '/content-ideas', label: 'Ideias de Conteúdo', icon: '💡', color: 'var(--primary)' },
    { path: '/clients', label: 'Clientes e Sites', icon: '👥', color: 'var(--primary-dark)' },
    { path: '/checklists', label: 'Checklists', icon: '✅', color: 'var(--brown)' },
  ]

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Bem-vindo ao Dashboard Elevare</h1>
        <p>Organize todas as estratégias, planos e informações da sua agência</p>
      </div>

      <div className="hero-section">
        <div className="hero-card">
          <h2>Elevare</h2>
          <p className="tagline">Transformando ideias em resultados</p>
          <p className="description">
            Seu centro de comando para gerenciar estratégias, mensagens, pacotes e 
            rotinas da Agência Elevare. Tudo organizado em um só lugar.
          </p>
        </div>
      </div>

      <div className="objectives-section">
        <h3>Objetivos Internos</h3>
        <div className="objectives-grid">
          <div className="objective-card">
            <span className="objective-icon">🎯</span>
            <h4>Organização</h4>
            <p>Centralizar todas as informações estratégicas em um único local</p>
          </div>
          <div className="objective-card">
            <span className="objective-icon">⚡</span>
            <h4>Eficiência</h4>
            <p>Acesso rápido a mensagens, scripts e conteúdos prontos para uso</p>
          </div>
          <div className="objective-card">
            <span className="objective-icon">📊</span>
            <h4>Planejamento</h4>
            <p>Estruturar estratégias e acompanhar metas de forma clara</p>
          </div>
          <div className="objective-card">
            <span className="objective-icon">🤝</span>
            <h4>Gestão</h4>
            <p>Gerenciar clientes, pacotes e processos de forma organizada</p>
          </div>
        </div>
      </div>

      <div className="quick-links-section">
        <h3>Acesso Rápido</h3>
        <div className="quick-links-grid">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="quick-link-card">
              <div className="quick-link-icon" style={{ backgroundColor: `${link.color}20`, color: link.color }}>
                {link.icon}
              </div>
              <span className="quick-link-label">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
