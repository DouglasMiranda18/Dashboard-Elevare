# 📋 Instruções de Instalação e Uso

## 🚀 Instalação Rápida

1. **Navegue até o diretório do projeto:**
   ```bash
   cd elevare-dashboard
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse o dashboard:**
   Abra seu navegador em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
elevare-dashboard/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Sidebar.jsx      # Menu de navegação lateral
│   │   └── Sidebar.css
│   ├── pages/               # Páginas do dashboard
│   │   ├── Home.jsx         # Página inicial
│   │   ├── SocialMediaPlanning.jsx  # Planejamento Social Media
│   │   ├── Messages.jsx     # Mensagens Prontas
│   │   ├── Packages.jsx     # Pacotes
│   │   ├── ContentIdeas.jsx # Ideias de Conteúdo
│   │   ├── Clients.jsx      # Clientes
│   │   ├── Checklists.jsx   # Checklists
│   │   └── Documents.jsx    # Documentos
│   ├── utils/
│   │   └── localStorage.js  # Utilitário para persistência
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globais do App
│   ├── main.jsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ✨ Funcionalidades

### 🏠 Página Inicial
- Visão geral da Agência Elevare
- Objetivos internos
- Acesso rápido a todas as seções

### 📱 Planejamento Social Media
- 10 blocos editáveis com estratégias:
  - Posicionamento
  - Portfólio
  - Apresentação
  - Prospecção
  - Conteúdos
  - Ofertas e Gatilhos
  - Pacotes
  - Fechamento
  - Rotina Semanal
  - Metas

### 💬 Mensagens Prontas
- 5 tipos de mensagens editáveis:
  - WhatsApp - Prospecção
  - Instagram DM
  - Mensagem de Fechamento
  - Apresentação da Elevare
  - Follow-up
- Botão para copiar mensagens rapidamente

### 📦 Pacotes
- Gerenciamento dos 3 pacotes:
  - Elevare Start
  - Elevare Pro
  - Elevare Master
- Edição de nome, preço, descrição e itens
- Adicionar/remover itens dos pacotes

### 💡 Ideias de Conteúdo
- Criar e gerenciar ideias de conteúdo
- Tipos: Post, Reel, Story, Carrossel, Tema
- Descrição e notas adicionais
- Edição e exclusão de ideias

### 👥 Clientes
- Cadastro completo de clientes
- Campos: Nome, Empresa, Email, Telefone, Pacote
- Status: Prospect, Em Negociação, Ativo, Inativo, Perdido
- Observações personalizadas

### ✅ Checklists
- 4 checklists editáveis:
  - Checklist Mensal
  - Checklist Semanal
  - Checklist de Prospecção
  - Checklist de Fechamento
- Sistema de progresso visual
- Adicionar/remover itens
- Marcar itens como concluídos

### 📄 Documentos
- Armazenar links e documentos
- Tabela organizada com nome, descrição e link
- Links clicáveis
- Edição e exclusão

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador. Isso significa:

- ✅ Dados persistem mesmo após fechar o navegador
- ✅ Funciona completamente offline
- ⚠️ Dados são específicos do navegador/dispositivo
- ⚠️ Limpar dados do navegador remove as informações

## 🎨 Cores da Marca

O dashboard utiliza as cores oficiais da Elevare:

- `#3a8b99` - Primary Dark (azul escuro)
- `#55aebe` - Primary (azul)
- `#efe2d3` - Cream (creme)
- `#d4c0a8` - Tan (bege)
- `#826f59` - Brown (marrom)

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:

- 💻 Desktop
- 📱 Tablet
- 📱 Mobile (menu lateral colapsável)

## 🔧 Build para Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 📝 Observações Importantes

1. **Este é um site interno** - Não está configurado para deploy público
2. **Dados locais** - Todos os dados ficam armazenados no navegador
3. **Sem backend** - Não há servidor, tudo funciona no frontend
4. **Navegador recomendado** - Use navegadores modernos (Chrome, Firefox, Edge)

## 🆘 Problemas Comuns

**Erro ao instalar dependências:**
```bash
# Tente limpar o cache e reinstalar
npm cache clean --force
npm install
```

**Porta 3000 já em uso:**
```bash
# O Vite tentará usar outra porta automaticamente
# Ou altere a porta no arquivo vite.config.js
```

**Dados não estão salvando:**
- Verifique se o localStorage está habilitado no navegador
- Não use modo privado/anônimo

## 🎯 Próximos Passos

1. Personalize os conteúdos iniciais em cada página
2. Adicione seus clientes reais
3. Configure seus pacotes com valores reais
4. Preencha as mensagens prontas
5. Organize suas ideias de conteúdo

---

**Desenvolvido para Agência Elevare** 🚀
