# 🚀 Deploy no Netlify - Dashboard Elevare

Guia completo para fazer deploy do dashboard interno no Netlify.

## 📋 Pré-requisitos

1. Conta no Netlify (grátis): [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. Git instalado no computador
3. Conta no GitHub/GitLab/Bitbucket (opcional, mas recomendado)

## 🔧 Métodos de Deploy

### Método 1: Deploy via Interface do Netlify (Mais Fácil)

1. **Fazer build do projeto localmente:**
   ```bash
   npm install
   npm run build
   ```

2. **Arrastar e soltar:**
   - Acesse [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Arraste a pasta `dist` (gerada após o build) para a área de drop
   - Aguarde o deploy automático

3. **Pronto!** Seu site estará online em um link aleatório do Netlify.

### Método 2: Deploy via Git (Recomendado)

#### Passo 1: Criar repositório Git

```bash
# Navegue até a pasta do projeto
cd elevare-dashboard

# Inicialize o Git (se ainda não tiver)
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Initial commit - Dashboard Elevare"
```

#### Passo 2: Criar repositório no GitHub

1. Acesse [GitHub](https://github.com) e crie um novo repositório
2. Nome sugerido: `elevare-dashboard` ou `elevare-internal`
3. **IMPORTANTE:** Marque como **privado** (já que é interno)
4. Siga as instruções do GitHub para conectar seu repositório local

```bash
# Conecte ao repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/elevare-dashboard.git
git branch -M main
git push -u origin main
```

#### Passo 3: Deploy no Netlify

1. **Conectar ao Netlify:**
   - Acesse [https://app.netlify.com](https://app.netlify.com)
   - Clique em "Add new site" > "Import an existing project"
   - Escolha "Deploy with GitHub" (ou GitLab/Bitbucket)

2. **Autorizar o Netlify:**
   - Autorize o acesso ao seu GitHub
   - Selecione o repositório `elevare-dashboard`

3. **Configurar Build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - O Netlify detectará automaticamente a configuração do `netlify.toml`

4. **Deploy!**
   - Clique em "Deploy site"
   - Aguarde o build e deploy (2-5 minutos)

5. **Pronto!** Seu site estará online em um link tipo: `seu-site.netlify.app`

## ⚙️ Configurações Adicionais

### Renomear o site

1. Vá em "Site settings" > "Change site name"
2. Escolha um nome personalizado (ex: `elevare-dashboard-internal`)
3. Seu link ficará: `elevare-dashboard-internal.netlify.app`

### Adicionar domínio personalizado (Opcional)

1. Vá em "Domain settings"
2. Clique em "Add custom domain"
3. Siga as instruções para configurar seu domínio

### Configurar variáveis de ambiente (Se necessário)

1. Vá em "Site settings" > "Environment variables"
2. Adicione variáveis se precisar

## 🔒 Importante: Dados no LocalStorage

**ATENÇÃO:** O dashboard usa `localStorage` do navegador, o que significa:

- ✅ Funciona completamente offline
- ✅ Dados são específicos de cada navegador/dispositivo
- ⚠️ Dados não são compartilhados entre dispositivos
- ⚠️ Limpar cache do navegador remove os dados

Se precisar de sincronização entre dispositivos, seria necessário:
- Backend com banco de dados
- Autenticação de usuários
- API para salvar/carregar dados

## 🔄 Deploy Automático

Com o Método 2 (via Git), cada `git push` fará deploy automático:

```bash
# Sempre que fizer alterações:
git add .
git commit -m "Descrição das alterações"
git push
```

O Netlify detectará as mudanças e fará deploy automático!

## 📝 Verificar Build Localmente

Antes de fazer deploy, teste o build localmente:

```bash
# Instalar dependências
npm install

# Fazer build
npm run build

# Preview do build
npm run preview
```

Isso criará a pasta `dist` com os arquivos prontos para produção.

## 🐛 Solução de Problemas

### Erro no build

Se o build falhar no Netlify:
1. Verifique os logs de build na aba "Deploys"
2. Certifique-se que `package.json` está correto
3. Verifique se todas as dependências estão listadas

### Erro 404 ao navegar

Se aparecer 404 ao mudar de página:
- Certifique-se que o arquivo `netlify.toml` está presente
- Verifique se o arquivo `public/_redirects` foi criado

### Site não carrega

- Verifique se o "Publish directory" está como `dist`
- Confirme que o build foi bem-sucedido
- Limpe o cache do navegador

## 🎯 Próximos Passos

1. Fazer deploy no Netlify
2. Testar todas as funcionalidades
3. Compartilhar o link com a equipe (se necessário)
4. Configurar domínio personalizado (opcional)

---

**Observação:** Como este é um dashboard interno, recomendo:
- Manter o repositório como **privado** no GitHub
- Não compartilhar o link publicamente
- Considerar adicionar autenticação se precisar de segurança extra

Precisa de ajuda com algum passo específico? 🚀
