# 🚀 Configuração do Git - Dashboard Elevare

Comandos para subir o projeto para o Git (GitHub/GitLab/Bitbucket).

## 📝 Passo a Passo

### 1. Inicializar o repositório Git

```bash
cd C:\Users\cleit\elevare-dashboard
git init
```

### 2. Adicionar todos os arquivos

```bash
git add .
```

### 3. Fazer o commit inicial

```bash
git commit -m "Initial commit - Dashboard Elevare interno"
```

### 4. Conectar ao repositório remoto (GitHub)

Primeiro, crie um repositório no GitHub:
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `elevare-dashboard` (ou outro)
4. **Marque como PRIVADO** (já que é interno)
5. **NÃO** marque "Initialize with README"
6. Clique em "Create repository"

Depois, conecte:

```bash
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/elevare-dashboard.git

# Ou se usar SSH:
git remote add origin git@github.com:SEU_USUARIO/elevare-dashboard.git

# Renomear branch para main
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

## ✅ Comandos Completos (Copiar e Colar)

```bash
cd C:\Users\cleit\elevare-dashboard
git init
git add .
git commit -m "Initial commit - Dashboard Elevare interno"
git remote add origin https://github.com/SEU_USUARIO/elevare-dashboard.git
git branch -M main
git push -u origin main
```

**Lembre-se de substituir `SEU_USUARIO` pelo seu usuário do GitHub!**

## 🔄 Comandos para Futuras Atualizações

Depois do commit inicial, para enviar novas alterações:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

## 🔒 Importante

- ✅ Repositório deve ser **PRIVADO** no GitHub (site interno)
- ✅ `.gitignore` já está configurado (ignora node_modules, dist, etc)
- ✅ Todos os arquivos necessários estão incluídos

## 📦 Arquivos que Serão Enviados

- ✅ Todo o código fonte (src/)
- ✅ Arquivos de configuração (package.json, vite.config.js)
- ✅ Documentação (README.md, INSTRUCOES.md)
- ✅ Configuração do Netlify (netlify.toml)
- ❌ node_modules (ignorado pelo .gitignore)
- ❌ dist (ignorado pelo .gitignore)

---

**Pronto para fazer commit!** 🎉
