import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './Messages.css'

const Messages = () => {
  const { getUserKey } = useUser()
  const [messages, setMessages] = useState({
    whatsappProspecting: 'Olá! Vi que você tem um negócio incrível e gostaria de conversar sobre como podemos ajudar você a alcançar resultados ainda melhores nas redes sociais. Tem um minuto para conversarmos?',
    instagramDM: 'Oi! Adorei seu perfil! Vejo que você está investindo bastante nas redes sociais. Que tal conversarmos sobre como potencializar ainda mais seus resultados?',
    closing: 'Que tal começarmos essa parceria agora mesmo? Estou aqui para tirar todas as suas dúvidas e mostrar como podemos fazer sua empresa crescer!',
    presentation: 'A Elevare é uma agência especializada em marketing digital e gestão de redes sociais. Trabalhamos com estratégias personalizadas para cada cliente, sempre focando em resultados reais e crescimento sustentável.',
    followUp: 'Olá! Espero que esteja tudo bem! Só queria verificar se você teve a chance de avaliar nossa proposta. Estou à disposição para qualquer dúvida!',
    blackFridayWhatsApp: '🖤 BLACK FRIDAY ELEVARE - A MAIOR PROMOÇÃO DO ANO! 🖤\n\nOlá! Chegou o momento que você estava esperando! 🎉\n\nA Black Friday da Elevare está aqui com condições IMPERDÍVEIS para transformar suas redes sociais!\n\n🔥 O QUE VOCÊ VAI GANHAR:\n\n💎 Descontos EXCLUSIVOS de até 40% nos nossos pacotes\n💰 Condições especiais de pagamento (parcelamento facilitado)\n⚡ Suporte prioritário e atendimento VIP\n🎁 Bônus: Consultoria estratégica GRÁTIS no primeiro mês\n📈 Relatórios detalhados de performance\n\n⏰ OFERTA VÁLIDA APENAS ATÉ [DATA]\n\nEssa é a oportunidade perfeita para alavancar seu negócio em 2024! Quer saber todos os detalhes? Me chama aqui! 💬',
    blackFridayInstagram: '🖤 BLACK FRIDAY ELEVARE chegou! 🖤\n\nOi! Que tal aproveitar a maior promoção do ano para dar um UP nas suas redes sociais? 🚀\n\n🔥 OFERTAS ESPECIAIS:\n\n💎 Até 40% OFF nos pacotes\n💰 Parcelamento em até 12x\n⚡ Suporte VIP\n🎁 Bônus exclusivos\n📊 Relatórios semanais\n\nEssa oportunidade é única e por tempo limitado! 🕐\n\nVamos conversar? Me chama no direct ou WhatsApp! 💬\n\n#BlackFriday #MarketingDigital #RedesSociais',
    blackFridayClosing: '🖤 BLACK FRIDAY - ÚLTIMAS HORAS! ⏰\n\nOlá! Ainda está pensando? Essa é sua ÚLTIMA CHANCE de transformar suas redes sociais com condições EXCLUSIVAS! 🎯\n\n🔥 O QUE ESTÁ INCLUÍDO:\n\n✅ Descontos de até 40% nos pacotes\n✅ Condições de pagamento facilitadas (até 12x)\n✅ Suporte prioritário 24/7\n✅ Consultoria estratégica GRÁTIS\n✅ Relatórios detalhados de performance\n✅ Bônus exclusivos da Black Friday\n\n⏰ A OFERTA TERMINA EM POUCAS HORAS!\n\nNão deixe essa oportunidade passar! Vamos fechar essa parceria agora? Estou aqui para tirar todas as suas dúvidas e montar o melhor plano para o seu negócio! 💪\n\nMe chama agora mesmo! 💬',
    blackFridayFollowUp: '🖤 Olá! Lembrei de você na nossa BLACK FRIDAY! 🖤\n\nAinda está pensando? Essa é a MELHOR OPORTUNIDADE DO ANO para investir no crescimento das suas redes sociais! 🚀\n\n🔥 LEMBRE-SE:\n\n💎 Descontos de até 40% (últimas horas!)\n💰 Parcelamento facilitado\n⚡ Suporte VIP\n🎁 Bônus exclusivos\n📈 Resultados garantidos\n\n⏰ A OFERTA ESTÁ ACABANDO!\n\nNão queremos que você perca essa chance única de transformar sua presença digital com condições especiais que só acontecem uma vez por ano!\n\nPosso te ajudar com alguma dúvida? Estou à disposição para conversarmos e montarmos o melhor plano para você! 💬\n\nVamos fechar essa parceria? 🚀'
  })

  useEffect(() => {
    const loadMessages = async () => {
      const saved = await storage.get(getUserKey('messages'), null)
      if (saved) {
        // Mesclar mensagens salvas com as novas mensagens de Black Friday
        setMessages(prev => ({
          ...prev,
          ...saved,
          // Garantir que as mensagens de Black Friday existam (mesmo que não estejam salvas)
          blackFridayWhatsApp: saved.blackFridayWhatsApp || prev.blackFridayWhatsApp,
          blackFridayInstagram: saved.blackFridayInstagram || prev.blackFridayInstagram,
          blackFridayClosing: saved.blackFridayClosing || prev.blackFridayClosing,
          blackFridayFollowUp: saved.blackFridayFollowUp || prev.blackFridayFollowUp
        }))
      }
    }
    loadMessages()

    // Observar mudanças em tempo real (Firebase)
    const unsubscribe = storage.subscribe(
      getUserKey('messages'),
      (data) => {
        if (data) {
          setMessages(data)
        }
      },
      messages
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getUserKey])

  useEffect(() => {
    const saveMessages = async () => {
      await storage.set(getUserKey('messages'), messages)
    }
    saveMessages()
  }, [messages, getUserKey])

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
    { 
      key: 'blackFridayWhatsApp', 
      title: '🖤 Black Friday - WhatsApp', 
      icon: '🖤',
      description: 'Mensagem de Black Friday para WhatsApp',
      highlight: true
    },
    { 
      key: 'blackFridayInstagram', 
      title: '🖤 Black Friday - Instagram', 
      icon: '🖤',
      description: 'Mensagem de Black Friday para Instagram DM',
      highlight: true
    },
    { 
      key: 'blackFridayClosing', 
      title: '🖤 Black Friday - Fechamento', 
      icon: '🖤',
      description: 'Script de fechamento para Black Friday',
      highlight: true
    },
    { 
      key: 'blackFridayFollowUp', 
      title: '🖤 Black Friday - Follow-up', 
      icon: '🖤',
      description: 'Follow-up com urgência de Black Friday',
      highlight: true
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
          <div key={msgType.key} className={`message-card ${msgType.highlight ? 'highlight' : ''}`}>
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
