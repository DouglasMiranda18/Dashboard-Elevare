# 🔧 Correção de Erros do Firebase

## ❌ Erros Encontrados

### 1. Erro de Permissões do Firestore
```
FirebaseError: Missing or insufficient permissions
```

### 2. Domínio não Autorizado para OAuth
```
The current domain is not authorized for OAuth operations
Domain: dashboardelevare.netlify.app
```

## ✅ Solução Rápida

### Passo 1: Configurar Regras de Segurança do Firestore

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto **elevare-981b1**
3. Vá em **Firestore Database** > **Regras**
4. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Coleção de usuários
    match /users/{userId} {
      // Usuários autenticados podem ler todos os usuários (necessário para página de gerenciamento)
      // Em produção, você pode restringir isso apenas para admins
      allow read: if isAuthenticated();
      // Usuários podem criar seu próprio documento
      allow create: if isAuthenticated() && request.auth.uid == userId;
      // Usuários podem atualizar seu próprio documento
      allow update: if isAuthenticated() && request.auth.uid == userId;
      // Ninguém pode deletar (ou apenas admins - configure conforme necessário)
      allow delete: if false;
    }
    
    // Dados do dashboard
    match /dashboard/{document=**} {
      // Usuários autenticados podem ler/escrever
      allow read, write: if isAuthenticated();
    }
  }
}
```

5. Clique em **Publicar** para salvar as regras

### Passo 2: Adicionar Domínio Autorizado

1. No Firebase Console, vá em **Authentication**
2. Clique em **Settings** (Configurações)
3. Vá na aba **Authorized domains** (Domínios autorizados)
4. Clique em **Add domain** (Adicionar domínio)
5. Digite: `dashboardelevare.netlify.app`
6. Clique em **Add** (Adicionar)

### Passo 3: Habilitar Autenticação por Email/Senha

1. No Firebase Console, vá em **Authentication**
2. Se ainda não habilitou, clique em **Get started**
3. Vá na aba **Sign-in method** (Métodos de login)
4. Clique em **Email/Password**
5. Ative a primeira opção **Enable**
6. Clique em **Save** (Salvar)

## 🧪 Testar

Após fazer essas configurações:

1. Recarregue a página do dashboard
2. Tente fazer login novamente
3. Os erros devem desaparecer

## 📝 Notas

- As regras de segurança permitem que usuários autenticados acessem seus próprios dados
- O domínio `dashboardelevare.netlify.app` precisa estar na lista de domínios autorizados
- A autenticação por Email/Senha precisa estar habilitada no Firebase

## 🔒 Segurança

Para produção, você pode tornar as regras mais restritivas:

- Restringir acesso à coleção `users` apenas para admins
- Adicionar validação de papel (role) nas regras
- Limitar acesso aos dados do dashboard baseado no papel do usuário

Consulte o arquivo `FIREBASE_SETUP.md` para mais detalhes.

