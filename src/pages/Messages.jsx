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
    blackFridayFollowUp: '🖤 Olá! Lembrei de você na nossa BLACK FRIDAY! 🖤\n\nAinda está pensando? Essa é a MELHOR OPORTUNIDADE DO ANO para investir no crescimento das suas redes sociais! 🚀\n\n🔥 LEMBRE-SE:\n\n💎 Descontos de até 40% (últimas horas!)\n💰 Parcelamento facilitado\n⚡ Suporte VIP\n🎁 Bônus exclusivos\n📈 Resultados garantidos\n\n⏰ A OFERTA ESTÁ ACABANDO!\n\nNão queremos que você perca essa chance única de transformar sua presença digital com condições especiais que só acontecem uma vez por ano!\n\nPosso te ajudar com alguma dúvida? Estou à disposição para conversarmos e montarmos o melhor plano para você! 💬\n\nVamos fechar essa parceria? 🚀',
    siteWhatsApp: 'Olá! Vi que você tem um negócio incrível! 💼\n\nVocê já tem um site profissional para sua empresa? 🌐\n\nA Elevare desenvolve sites modernos, responsivos e otimizados que vão transformar sua presença digital!\n\n🎯 O QUE OFERECEMOS:\n\n💻 Landing Pages (R$ 1.200)\n🍽️ Sites para Restaurantes (R$ 2.000)\n🏢 Sites Institucionais Completos (R$ 2.400)\n\n✅ Design profissional\n✅ Responsivo (mobile e desktop)\n✅ Otimizado para conversão\n✅ Integração com WhatsApp/iFood\n✅ SEO básico incluído\n\nQuer saber mais detalhes? Tem um minuto para conversarmos? 💬',
    siteInstagram: 'Oi! Adorei seu perfil! 👋\n\nVocê já pensou em ter um site profissional para seu negócio? 🌐\n\nA Elevare cria sites modernos e responsivos que vão alavancar suas vendas online!\n\n💻 Nossos serviços:\n• Landing Pages\n• Sites para Restaurantes\n• Sites Institucionais\n\n✅ Design moderno\n✅ Mobile friendly\n✅ Otimizado para conversão\n\nVamos conversar? Me chama no direct! 💬\n\n#WebDesign #SiteProfissional #MarketingDigital',
    siteClosing: 'Olá! Que tal darmos o próximo passo? 🚀\n\nUm site profissional é essencial para qualquer negócio que quer crescer no digital! 🌐\n\n🎯 O QUE VOCÊ VAI GANHAR:\n\n✅ Site moderno e responsivo\n✅ Design profissional personalizado\n✅ Otimizado para conversão\n✅ Integração com WhatsApp/iFood\n✅ SEO básico incluído\n✅ Suporte durante todo o processo\n✅ Entrega rápida e eficiente\n\n💼 NOSSOS PACOTES:\n\n💻 Landing Page: R$ 1.200\n🍽️ Site Restaurante: R$ 2.000\n🏢 Site Institucional: R$ 2.400\n\nVamos transformar sua presença digital agora mesmo? Estou aqui para tirar todas as suas dúvidas e montar a melhor solução para você! 💪\n\nMe chama para conversarmos! 💬',
    siteFollowUp: 'Olá! Espero que esteja tudo bem! 😊\n\nLembrei de você! Você ainda está pensando em criar um site profissional para seu negócio? 🌐\n\n📊 SABIA QUE:\n\n• 97% dos consumidores pesquisam online antes de comprar\n• Empresas com site profissional vendem 3x mais\n• Um site é seu cartão de visitas 24/7\n\n💼 TEMOS A SOLUÇÃO PERFEITA PARA VOCÊ:\n\n✅ Sites modernos e responsivos\n✅ Design profissional\n✅ Otimizado para conversão\n✅ Entrega rápida\n\nEstou à disposição para conversarmos e montarmos o melhor projeto para seu negócio! 💬\n\nVamos fechar essa parceria? 🚀'
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
          blackFridayFollowUp: saved.blackFridayFollowUp || prev.blackFridayFollowUp,
          // Garantir que as mensagens de Site existam
          siteWhatsApp: saved.siteWhatsApp || prev.siteWhatsApp,
          siteInstagram: saved.siteInstagram || prev.siteInstagram,
          siteClosing: saved.siteClosing || prev.siteClosing,
          siteFollowUp: saved.siteFollowUp || prev.siteFollowUp
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
    { 
      key: 'siteWhatsApp', 
      title: '💻 Site - WhatsApp', 
      icon: '💻',
      description: 'Prospecção de desenvolvimento de site via WhatsApp'
    },
    { 
      key: 'siteInstagram', 
      title: '💻 Site - Instagram', 
      icon: '💻',
      description: 'Prospecção de desenvolvimento de site via Instagram DM'
    },
    { 
      key: 'siteClosing', 
      title: '💻 Site - Fechamento', 
      icon: '💻',
      description: 'Script de fechamento para serviços de desenvolvimento web'
    },
    { 
      key: 'siteFollowUp', 
      title: '💻 Site - Follow-up', 
      icon: '💻',
      description: 'Follow-up para prospecção de sites'
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
