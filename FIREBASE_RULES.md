# 🔐 Regras do Firestore - Referência Rápida

Este arquivo contém as regras de segurança do Firestore para fácil referência e atualização.

## 📋 Como Atualizar as Regras

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `elevare-981b1`
3. Vá em **Firestore Database** > **Regras**
4. Copie o conteúdo do arquivo `firestore.rules`
5. Cole no editor de regras do Firebase
6. Clique em **Publicar**

---

## 📄 Regras Atuais (Versão Simplificada)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função helper para verificar se usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Coleção de usuários
    match /users/{userId} {
      // Usuários autenticados podem ler todos os usuários
      allow read: if isAuthenticated();
      
      // Usuários podem criar seu próprio documento ao se registrar
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Usuários podem atualizar seu próprio documento
      allow update: if isAuthenticated() && request.auth.uid == userId;
      
      // Ninguém pode deletar
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

---

## 📄 Regras Avançadas (Com Controle de Admin)

Se você quiser permitir que admins atualizem qualquer usuário:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && 
                       (request.auth.uid == userId || isAdmin());
      allow delete: if false; // ou: allow delete: if isAdmin();
    }
    
    match /dashboard/{document=**} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---

## 🔍 Explicação das Regras

### Coleção `users`
- **read**: Qualquer usuário autenticado pode ler todos os usuários (necessário para a página de gerenciamento)
- **create**: Usuários só podem criar seu próprio documento (ao se registrar)
- **update**: Usuários podem atualizar apenas seu próprio documento
- **delete**: Ninguém pode deletar (ou apenas admins, se você habilitar)

### Coleção `dashboard`
- **read, write**: Qualquer usuário autenticado pode ler e escrever
- Isso inclui: `clients`, `dailyAgenda`, `messages`, `packages`, `contentIdeas`, etc.

---

## ⚠️ Notas Importantes

1. **Autenticação obrigatória**: Todas as operações requerem autenticação
2. **Isolamento de dados**: Afiliados têm dados isolados usando prefixos `{userId}_` nas chaves
3. **Segurança**: As regras atuais são básicas. Para produção, considere restrições mais específicas
4. **Teste sempre**: Após atualizar as regras, teste no Firebase Console usando o simulador

---

## 🧪 Como Testar as Regras

1. No Firebase Console, vá em **Firestore Database** > **Regras**
2. Clique em **Simulador** (aba no topo)
3. Configure:
   - **Localização**: `users/{userId}` ou `dashboard/{document}`
   - **Tipo**: read, write, create, delete
   - **Autenticação**: Simulado ou real
4. Clique em **Executar** para ver se a regra permite ou nega

---

## 📝 Histórico de Alterações

- **Versão atual**: Regras básicas com autenticação obrigatória
- **Última atualização**: Configuração inicial do sistema de afiliados

---

**Arquivo de referência**: `firestore.rules` (copie este arquivo para o Firebase Console)

