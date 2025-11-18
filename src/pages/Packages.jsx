import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './Packages.css'

const Packages = () => {
  const { getUserKey, currentUser } = useUser()
  const isAffiliate = currentUser?.role === 'affiliate'
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Plano Profissional',
      description: 'Este pacote é focado em manter o perfil da marca sempre atualizado, dinâmico e com presença digital forte.',
      price: 'R$ 800,00 / mês',
      items: [
        '8 Reels por mês',
        'Stories diários',
        '3 dias de acompanhamento presencial por semana',
        'Até 15 artes promocionais por mês',
        'Gestão completa da rede social',
        'Planejamento estratégico de postagens',
        'Estratégia básica de engajamento',
        'Relatório mensal de desempenho'
      ]
    },
    {
      id: 2,
      name: 'Plano Premium',
      description: 'Um pacote mais robusto, ideal para elevar o nível da marca, com foco em produção profissional e crescimento.',
      price: 'R$ 1.000,00 / mês',
      items: [
        '12 Reels por mês',
        'Stories diários',
        '5 dias de acompanhamento presencial por semana',
        'Fotos gastronômicas',
        'Artes ilimitadas',
        'Gestão de tráfego pago',
        'Planejamento estratégico avançado',
        'Otimização de engajamento',
        'Relatório semanal de desempenho'
      ]
    },
    {
      id: 3,
      name: 'Landing Page (Página de Conversão)',
      description: 'Ideal para lançamentos, promoções específicas ou cardápio digital simplificado. Página única, carregamento rápido e foco total em levar o cliente para o WhatsApp/iFood.',
      price: 'R$ 1.200,00',
      items: [
        'Página única otimizada',
        'Carregamento rápido',
        'Foco em conversão',
        'Integração com WhatsApp',
        'Integração com iFood',
        'Design responsivo',
        'Pagamento único'
      ]
    },
    {
      id: 4,
      name: 'Site para Lojas',
      description: 'Ideal para lojas físicas e e-commerce que precisam de um site completo para vender online. Design moderno focado em conversão e experiência do cliente.',
      price: 'R$ 2.000,00',
      items: [
        'Design moderno e profissional',
        'Catálogo de produtos interativo',
        'Integração com botão de pedidos',
        'Carrinho de compras',
        'Mapa de localização',
        'Área de contato e suporte',
        'Design responsivo',
        'Pagamento único'
      ]
    },
    {
      id: 5,
      name: 'Site Institucional Completo',
      description: 'Ideal para empresas de médio/grande porte que precisam de autoridade corporativa. Estrutura completa com múltiplas páginas, blog e SEO avançado.',
      price: 'R$ 2.400,00',
      items: [
        'Estrutura completa (múltiplas páginas)',
        'Blog integrado',
        'Área institucional detalhada',
        'SEO avançado',
        'Design corporativo profissional',
        'Sistema de gestão de conteúdo',
        'Design responsivo',
        'Pagamento único'
      ]
    }
  ])

  useEffect(() => {
    const loadPackages = async () => {
      const saved = await storage.get(getUserKey('packages'), null)
      if (saved) {
        setPackages(saved)
      }
    }
    loadPackages()

    // Observar mudanças em tempo real (Firebase)
    const unsubscribe = storage.subscribe(
      getUserKey('packages'),
      (data) => {
        if (data) {
          setPackages(data)
        }
      },
      packages
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getUserKey])

  useEffect(() => {
    // Afiliados não podem salvar alterações
    if (!isAffiliate) {
      const savePackages = async () => {
        await storage.set(getUserKey('packages'), packages)
      }
      savePackages()
    }
  }, [packages, getUserKey, isAffiliate])

  const handleChange = (id, field, value) => {
    if (isAffiliate) return // Afiliados não podem editar
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ))
  }

  const handleItemChange = (packageId, itemIndex, value) => {
    if (isAffiliate) return // Afiliados não podem editar
    setPackages(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        const newItems = [...pkg.items]
        newItems[itemIndex] = value
        return { ...pkg, items: newItems }
      }
      return pkg
    }))
  }

  const addItem = (packageId) => {
    if (isAffiliate) return // Afiliados não podem adicionar
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, items: [...pkg.items, 'Novo item'] }
        : pkg
    ))
  }

  const removeItem = (packageId, itemIndex) => {
    if (isAffiliate) return // Afiliados não podem remover
    setPackages(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        const newItems = pkg.items.filter((_, index) => index !== itemIndex)
        return { ...pkg, items: newItems }
      }
      return pkg
    }))
  }

  return (
    <div className="packages-page">
      <div className="page-header">
        <h1>Pacotes</h1>
        <p>Gerencie os pacotes oferecidos pela Elevare</p>
      </div>

      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className="package-header">
              {isAffiliate ? (
                <>
                  <h3 className="package-name">{pkg.name}</h3>
                  <span className="package-price">{pkg.price}</span>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="package-name editable"
                    value={pkg.name}
                    onChange={(e) => handleChange(pkg.id, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    className="package-price"
                    value={pkg.price}
                    onChange={(e) => handleChange(pkg.id, 'price', e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </>
              )}
            </div>
            
            {isAffiliate ? (
              <p className="package-description">{pkg.description}</p>
            ) : (
              <textarea
                className="package-description editable"
                value={pkg.description}
                onChange={(e) => handleChange(pkg.id, 'description', e.target.value)}
                placeholder="Descrição do pacote..."
                rows="2"
              />
            )}

            <div className="package-items">
              <div className="package-items-header">
                <h4>Itens inclusos:</h4>
              </div>
              {pkg.items.map((item, index) => (
                <div key={index} className="package-item">
                  {isAffiliate ? (
                    <span className="package-item-text">{item}</span>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="package-item-input editable"
                        value={item}
                        onChange={(e) => handleItemChange(pkg.id, index, e.target.value)}
                        placeholder="Item do pacote..."
                      />
                      <button
                        className="btn-remove-item"
                        onClick={() => removeItem(pkg.id, index)}
                        title="Remover item"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}
              {!isAffiliate && (
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => addItem(pkg.id)}
                >
                  + Adicionar item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Packages
