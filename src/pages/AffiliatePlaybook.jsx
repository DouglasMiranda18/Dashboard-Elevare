import React from 'react'
import './AffiliatePlaybook.css'

const AffiliatePlaybook = () => {
  return (
    <div className="playbook-page">
      <div className="playbook-header">
        <h1>📚 Manual do Afiliado</h1>
        <h2>Guia Completo de Vendas (Todos os Nichos)</h2>
      </div>

      <div className="playbook-intro">
        <p className="intro-text">
          <strong>Bem-vindo ao time!</strong> O segredo para vender nossos sites não é ser um vendedor chato, é ser um <strong>Consultor de Negócios</strong>.
        </p>
        <p className="intro-text">
          Na Agência Elevare, nós não fazemos apenas lojas. Nós criamos a <strong>presença digital completa</strong>. Isso significa que qualquer empresa ou profissional que você encontrar é um cliente em potencial.
        </p>
        <p className="intro-text highlight">
          <strong>Para ter sucesso:</strong> Você precisa oferecer o produto certo para a pessoa certa. Use este guia para identificar a oportunidade.
        </p>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <h2>Resumo: Qual produto oferecer?</h2>
        </div>
        <div className="section-content">
          <p>Para facilitar sua vida, decore essa regra:</p>
          
          <div className="product-rules">
            <div className="product-rule">
              <span className="rule-icon">🛒</span>
              <div>
                <strong>Vende Produto Físico?</strong>
                <p>➔ Ofereça <strong>Loja Virtual (E-commerce)</strong></p>
              </div>
            </div>
            <div className="product-rule">
              <span className="rule-icon">💼</span>
              <div>
                <strong>Vende Serviço ou Curso?</strong>
                <p>➔ Ofereça <strong>Landing Page (LP)</strong></p>
              </div>
            </div>
            <div className="product-rule">
              <span className="rule-icon">🏢</span>
              <div>
                <strong>Vende para Outras Empresas (B2B)?</strong>
                <p>➔ Ofereça <strong>Site Institucional</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">📂</span>
          <h2>CATEGORIA 1: Lojas e Comércio (E-commerce)</h2>
        </div>
        <div className="section-content">
          <p className="category-subtitle">Para quem vende produtos físicos (Roupas, Eletrônicos, Tabacaria).</p>
          
          <div className="info-box">
            <h3>🩹 A Dor do Cliente:</h3>
            <p>Perde tempo respondendo preço no WhatsApp e perde vendas pela demora.</p>
          </div>

          <div className="info-box success">
            <h3>✅ A Solução Elevare:</h3>
            <p>Site automático, cálculo de frete, controle de estoque e etiqueta de envio pronta.</p>
          </div>

          <div className="info-box">
            <h3>🔍 Onde achar:</h3>
            <p>Instagram (Pesquisar por "Loja de...", "Imports", "Moda").</p>
            <p className="example">Exemplo: "Moda Masculina SP", "Imports Recife", "Tabacaria Curitiba".</p>
          </div>

          <div className="script-box">
            <h3>💬 Script de Abordagem:</h3>
            <div className="script-content">
              <p>"Olá! Vi que vocês vendem pelo WhatsApp. Nós criamos um sistema onde o cliente compra sozinho, calcula o frete e a etiqueta já sai pronta na sua impressora. Quer parar de perder vendas por demora no atendimento e vender no automático?"</p>
            </div>
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
          <span className="section-icon">📂</span>
          <h2>CATEGORIA 2: Profissionais e Serviços (Landing Pages / LP)</h2>
        </div>
        <div className="section-content">
          <p className="category-subtitle">Para quem vende serviço, cursos ou capta leads (Médicos, Dentistas, Personal Trainers, Corretores, Infoprodutores).</p>
          
          <div className="info-box">
            <h3>🩹 A Dor do Cliente:</h3>
            <p>Roda anúncios (tráfego pago) mas manda para o WhatsApp ou Direct e o cliente desiste. Ou usa um "Linktree" amador que não passa confiança.</p>
          </div>

          <div className="info-box success">
            <h3>✅ A Solução Elevare:</h3>
            <p>Landing Page de Alta Conversão. Uma página focada em fazer a pessoa apertar o botão de "Agendar" ou "Comprar".</p>
          </div>

          <div className="info-box">
            <h3>🔍 Onde achar:</h3>
            <ul>
              <li><strong>Biblioteca de Anúncios do Facebook:</strong> Veja quem está gastando dinheiro com anúncio mas não tem site.</li>
              <li><strong>Instagram:</strong> Perfis de Estética, Odontologia, Advocacia.</li>
            </ul>
          </div>

          <div className="script-box">
            <h3>💬 Script de Abordagem:</h3>
            <div className="script-content">
              <p>"Olá, [Nome/Doutor]! Vi que você produz um conteúdo excelente no Instagram.</p>
              <p>Notei que você usa um link simples na bio. Para um profissional do seu nível, isso acaba diminuindo a percepção de valor do seu serviço.</p>
              <p>Na Agência Elevare, criamos Landing Pages de alta conversão projetadas para transformar seguidores em agendamentos reais. Posso te mostrar um exemplo de como ficaria sua apresentação profissional?"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">📂</span>
          <h2>CATEGORIA 3: Empresas e Negócios Locais (Institucional)</h2>
        </div>
        <div className="section-content">
          <p className="category-subtitle">Para empresas que precisam passar autoridade (Escritórios de Engenharia, Construtoras, Consultorias, B2B).</p>
          
          <div className="info-box">
            <h3>🩹 A Dor do Cliente:</h3>
            <p>"Quem não é visto não é lembrado". Se alguém jogar o nome da empresa no Google, não acha nada ou acha um Facebook desatualizado. Parece empresa fantasma.</p>
          </div>

          <div className="info-box success">
            <h3>✅ A Solução Elevare:</h3>
            <p>Site Institucional. É o cartão de visitas digital. Passa seriedade, mostra o portfólio e a história da empresa.</p>
          </div>

          <div className="info-box">
            <h3>🔍 Onde achar:</h3>
            <p><strong>Google Maps.</strong> Procure empresas na sua cidade que não têm o botão "Website" no cadastro do Google.</p>
          </div>

          <div className="script-box">
            <h3>💬 Script de Abordagem:</h3>
            <div className="script-content">
              <p>"Olá, tudo bem? Estou entrando em contato com a [Nome da Empresa].</p>
              <p>Estava pesquisando empresas do setor na região e notei que vocês não possuem um site oficial. Hoje em dia, a primeira coisa que um cliente grande faz é buscar no Google, e não ter um site pode passar a impressão errada sobre o tamanho da empresa.</p>
              <p>Nós desenvolvemos sites institucionais modernos que servem como um portfólio digital para validar a autoridade de vocês. Faz sentido conversarmos sobre a modernização da marca?"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="playbook-section">
        <div className="section-header">
          <span className="section-icon">🔍</span>
          <h2>O Filtro de Ouro (Quem abordar?)</h2>
        </div>
        <div className="section-content">
          <p className="warning-text">Não perca tempo com quem não compra. Analise o perfil antes de mandar mensagem:</p>
          
          <div className="info-box">
            <h3>Seguidores (Para E-commerce):</h3>
            <p>Ideal entre <strong>5k e 50k</strong>. (Menos que isso não tem verba; mais que isso já tem equipe de marketing).</p>
          </div>

          <div className="info-box">
            <h3>O Link da Bio (O mais importante para E-commerce):</h3>
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

