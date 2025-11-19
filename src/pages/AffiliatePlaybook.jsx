import React from 'react'
import './AffiliatePlaybook.css'

const AffiliatePlaybook = () => {
  return (
    <div className="playbook-page">
      <div className="playbook-header">
        <h1>📚 Playbook do Afiliado</h1>
        <h2>Como Vender Sites Automáticos</h2>
      </div>

      <div className="playbook-intro">
        <p className="intro-text">
          <strong>Bem-vindo ao time!</strong> O segredo para vender nossos sites não é ser um vendedor chato, é ser um <strong>Consultor de Negócios</strong>.
        </p>
        <p className="intro-text">
          O seu cliente (o dono de loja) sofre todos os dias com um problema: <strong>Atendimento manual no WhatsApp</strong>. Ele perde tempo respondendo "quanto é o frete?" e perde vendas porque demora a responder.
        </p>
        <p className="intro-text highlight">
          <strong>A sua missão:</strong> Mostrar que ele pode vender dormindo. Siga o passo a passo abaixo.
        </p>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <h2>Passo 1: Onde encontrar o cliente (Garimpo)</h2>
        </div>
        <div className="section-content">
          <p>O seu <strong>"ouro"</strong> está no Instagram. Você procura lojas que já têm movimento, mas estão desorganizadas.</p>
          
          <div className="info-box">
            <h3>Quem procurar:</h3>
            <ul>
              <li>Lojas de Roupas / Moda</li>
              <li>Lojas de Importados (Eletrônicos, iPhones, Tênis)</li>
              <li>Tabacarias e Acessórios</li>
              <li>Suplementos</li>
            </ul>
          </div>

          <div className="info-box">
            <h3>Como pesquisar:</h3>
            <p>Vá na busca do Instagram e digite: <strong>[Nicho] + [Cidade]</strong></p>
            <p className="example">Exemplo: "Moda Masculina SP", "Imports Recife", "Tabacaria Curitiba".</p>
          </div>

          <div className="tip-box">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Dica de Mestre:</strong> Quando achar uma loja ideal, clique na setinha ao lado do botão "Seguir". O Instagram vai te sugerir mais 10 lojas parecidas. É uma lista infinita de clientes.
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🔍</span>
          <h2>Passo 2: O Filtro de Ouro (Quem abordar?)</h2>
        </div>
        <div className="section-content">
          <p className="warning-text">Não perca tempo com quem não compra. Analise o perfil antes de mandar mensagem:</p>
          
          <div className="info-box">
            <h3>Seguidores:</h3>
            <p>Ideal entre <strong>5k e 50k</strong>. (Menos que isso não tem verba; mais que isso já tem equipe de marketing).</p>
          </div>

          <div className="info-box">
            <h3>O Link da Bio (O mais importante):</h3>
            <div className="link-types">
              <div className="link-type red">
                <span className="status-icon">🔴</span>
                <div>
                  <strong>Link direto pro WhatsApp:</strong> É o CLIENTE PERFEITO. Ele sofre com atendimento manual.
                </div>
              </div>
              <div className="link-type orange">
                <span className="status-icon">🟠</span>
                <div>
                  <strong>Linktree/Biolink:</strong> Bom cliente. Ele tenta organizar, mas ainda não é profissional.
                </div>
              </div>
              <div className="link-type green">
                <span className="status-icon">🟢</span>
                <div>
                  <strong>Site Ruim/Lento:</strong> Cliente bom. Ofereça a nossa tecnologia superior (cálculo de frete e etiqueta pronta).
                </div>
              </div>
              <div className="link-type skip">
                <span className="status-icon">❌</span>
                <div>
                  <strong>Site Profissional:</strong> Pule. Não perca tempo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">💬</span>
          <h2>Passo 3: A Abordagem (Scripts Prontos)</h2>
        </div>
        <div className="section-content">
          <p>O objetivo da primeira mensagem não é vender, é gerar curiosidade. Escolha o script que mais combina com você.</p>
          
          <div className="script-box">
            <h3>Opção A: O Consultor (Foco em Dor)</h3>
            <div className="script-content">
              <p>"Olá, [Nome da Loja]! Tudo bem? Acompanho o trabalho de vocês e vejo um potencial gigante.</p>
              <p>Notei que vocês ainda direcionam as vendas para o WhatsApp. Eu trabalho com e-commerce e vejo muitas lojas perdendo até 30% das vendas pela demora natural no atendimento humano.</p>
              <p>A Agência Elevare tem um sistema onde o cliente compra sozinho, calcula o frete e a etiqueta de envio já sai pronta na sua impressora.</p>
              <p>Você tem interesse em automatizar suas vendas ou prefere continuar no manual?"</p>
            </div>
          </div>

          <div className="script-box">
            <h3>Opção B: O Visual (Foco na Referência)</h3>
            <div className="script-content">
              <p>"Fala, equipe da [Nome da Loja]! Estava olhando o feed de vocês, as fotos são muito boas. Parabéns.</p>
              <p>Só achei que falta um site profissional para valorizar a marca de vocês e passar mais confiança pro cliente final.</p>
              <p>Dá uma olhada nesse projeto que entregamos recentemente, acho que combina muito com o estilo de vocês: 👇 <a href="https://tfimports01.com.br/" target="_blank" rel="noopener noreferrer">https://tfimports01.com.br/</a></p>
              <p>O que achou desse visual? Conseguimos montar uma estrutura dessa pra você vender no automático."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🎥</span>
          <h2>Passo 4: A Prova (O Pulo do Gato)</h2>
        </div>
        <div className="section-content">
          <p>Se o cliente responder demonstrando interesse ("Como funciona?", "Qual o valor?"), não mande apenas texto.</p>
          
          <div className="info-box">
            <h3>Envie um áudio + Vídeo:</h3>
            <div className="step-item">
              <strong>Áudio (15s):</strong> "Show! Funciona assim: é um site próprio seu. O cliente entra, escolhe e paga. O dinheiro cai na sua conta e a etiqueta de envio já sai impressa. Vou te mandar um vídeo curto mostrando."
            </div>
            <div className="step-item">
              <strong>Vídeo de Tela:</strong> Grave a tela do seu celular navegando no site de exemplo (TF Imports), simulando uma compra rápida.
            </div>
          </div>

          <div className="highlight-box">
            <strong>A regra é clara:</strong> O cliente só compra o que ele entende.
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🚀</span>
          <h2>Resumo dos Benefícios (Para você ter na ponta da língua)</h2>
        </div>
        <div className="section-content">
          <p>Se o cliente perguntar "Por que eu preciso disso?", use esses argumentos:</p>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🛒</span>
              <h3>Venda 24h</h3>
              <p>O site vende enquanto a loja está fechada ou você está dormindo.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📦</span>
              <h3>Fim do "Frete Manual"</h3>
              <p>O site calcula correios/transportadora na hora.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🏷️</span>
              <h3>Etiqueta Pronta</h3>
              <p>O pedido sai na impressora pronto para colar na caixa.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📊</span>
              <h3>Estoque Automático</h3>
              <p>Vendeu, baixou do estoque. Sem confusão.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">⭐</span>
              <h3>Credibilidade</h3>
              <p>Loja com site vende muito mais caro e fácil que loja só de Instagram.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">📅</span>
          <h2>Sua Meta Diária</h2>
        </div>
        <div className="section-content">
          <p className="warning-text">Vendas é um jogo de números. Siga essa rotina para ter resultados:</p>
          
          <div className="daily-routine">
            <div className="routine-item">
              <span className="routine-number">1</span>
              <div>
                <strong>Garimpar:</strong> Encontrar 10 novas lojas por dia.
              </div>
            </div>
            <div className="routine-item">
              <span className="routine-number">2</span>
              <div>
                <strong>Interagir:</strong> Curtir 3 fotos e comentar 1 foto dessas lojas (para eles verem seu nome).
              </div>
            </div>
            <div className="routine-item">
              <span className="routine-number">3</span>
              <div>
                <strong>Abordar:</strong> Enviar o script para as 10 lojas.
              </div>
            </div>
          </div>

          <div className="math-box">
            <h3>Matemática:</h3>
            <p>10 lojas por dia = <strong>300 lojas no mês</strong>. Se você fechar 1% disso, são <strong>3 vendas no bolso</strong>. Mantenha a constância!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliatePlaybook

