import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './Packages.css'

const Packages = () => {
  const { getUserKey } = useUser()
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Elevare Start',
      description: 'Pacote ideal para empresas que estão começando no digital',
      price: 'R$ 0,00',
      items: [
        'Gestão de 2 redes sociais',
        '10 posts por mês',
        'Relatório mensal',
        'Suporte via WhatsApp'
      ]
    },
    {
      id: 2,
      name: 'Elevare Pro',
      description: 'Solução completa para empresas que querem crescer',
      price: 'R$ 0,00',
      items: [
        'Gestão de 3 redes sociais',
        '20 posts por mês',
        '5 stories diários',
        'Relatório mensal detalhado',
        'Suporte prioritário',
        '1 campanha mensal'
      ]
    },
    {
      id: 3,
      name: 'Elevare Master',
      description: 'Pacote premium com todas as funcionalidades',
      price: 'R$ 0,00',
      items: [
        'Gestão de 4+ redes sociais',
        'Posts ilimitados',
        'Stories diários',
        'Reels semanais',
        'Relatório semanal',
        'Suporte 24/7',
        '2 campanhas mensais',
        'Consultoria estratégica mensal'
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
    const savePackages = async () => {
      await storage.set(getUserKey('packages'), packages)
    }
    savePackages()
  }, [packages, getUserKey])

  const handleChange = (id, field, value) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ))
  }

  const handleItemChange = (packageId, itemIndex, value) => {
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
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, items: [...pkg.items, 'Novo item'] }
        : pkg
    ))
  }

  const removeItem = (packageId, itemIndex) => {
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
            </div>
            
            <textarea
              className="package-description editable"
              value={pkg.description}
              onChange={(e) => handleChange(pkg.id, 'description', e.target.value)}
              placeholder="Descrição do pacote..."
              rows="2"
            />

            <div className="package-items">
              <div className="package-items-header">
                <h4>Itens inclusos:</h4>
              </div>
              {pkg.items.map((item, index) => (
                <div key={index} className="package-item">
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
                </div>
              ))}
              <button
                className="btn btn-small btn-secondary"
                onClick={() => addItem(pkg.id)}
              >
                + Adicionar item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Packages
