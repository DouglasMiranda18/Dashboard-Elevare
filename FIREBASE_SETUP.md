# 🔥 Configuração do Firebase

O dashboard agora está configurado para usar Firebase Firestore para armazenar os dados.

## ✅ O que foi implementado

### 1. Integração com Firebase
- ✅ Configuração do Firebase conectada
- ✅ Firestore para armazenar todos os dados
- ✅ Sincronização em tempo real entre dispositivos
- ✅ Fallback para localStorage se Firebase falhar ou estiver offline

### 2. Estrutura de dados no Firebase

Todos os dados são salvos na coleção `dashboard` do Firestore:

- `clients` - Clientes e Sites (compartilhado entre admins)
- `dailyAgenda` - Agenda Diária
- `messages` - Mensagens Prontas
- `packages` - Pacotes
- `contentIdeas` - Ideias de Conteúdo
- `checklists` - Checklists
- `documents` - Documentos
- `users` - Usuários Admin/Sócio
- `affiliates` - Afiliados
- `{userId}_clients` - Dados de afiliados (separados)

### 3. Funcionalidades

- **Sincronização em tempo real**: Mudanças aparecem instantaneamente em todos os dispositivos
- **Dados compartilhados**: Admin e Sócio veem os mesmos dados
- **Dados separados**: Afiliados têm seus próprios dados isolados
- **Offline**: Funciona offline usando localStorage como fallback
- **Backup automático**: Todos os dados ficam na nuvem

## 🔧 Configuração do Firebase

### Passo 1: Instalar dependências

```bash
npm install
```

### Passo 2: Configurar Firestore

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `elevare-981b1`
3. Vá em **Firestore Database**
4. Clique em **Criar banco de dados**
5. Escolha **Modo de produção** ou **Modo de teste** (para desenvolvimento)
6. Selecione a localização (ex: `southamerica-east1` - Brasil)

### Passo 3: Configurar Regras de Segurança

Vá em **Regras** do Firestore e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para dashboard
    match /dashboard/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ ATENÇÃO**: As regras acima permitem acesso público. Para produção, configure autenticação adequada.

### Passo 4: Testar

1. Execute `npm run dev`
2. Acesse o dashboard
3. Adicione algum dado
4. Verifique no Firebase Console se os dados foram salvos

## 📊 Estrutura dos Dados

### Admin/Sócio (Dados Compartilhados)
```
dashboard/clients → Array de clientes
dashboard/dailyAgenda → Objeto com tarefas por data
dashboard/messages → Objeto com mensagens
...
```

### Afiliados (Dados Separados)
```
dashboard/123_clients → Array de clientes do afiliado 123
dashboard/123_dailyAgenda → Tarefas do afiliado 123
...
```

## 🔄 Sincronização em Tempo Real

O sistema usa `onSnapshot` do Firebase para atualizar dados automaticamente:
- Quando você faz uma mudança, ela aparece instantaneamente
- Quando seu sócio faz uma mudança, você vê em tempo real
- Não precisa atualizar a página!

## 💾 Fallback Offline

Se o Firebase estiver offline ou com erro:
- Sistema automaticamente usa localStorage
- Quando voltar online, dados são sincronizados
- Nada é perdido!

## 🔐 Segurança

**Importante**: Configure regras de segurança adequadas no Firebase:

1. Vá em Firestore > Regras
2. Configure regras baseadas em autenticação (se necessário)
3. Ou mantenha privado no console do Firebase

## 📈 Custos

Firebase tem plano gratuito generoso:
- **Grátis até**: 50.000 leituras/dia, 20.000 escritas/dia
- **Perfeito para uso interno**: Normalmente não excede o limite
- **Escalável**: Se crescer, pode fazer upgrade

## 🚀 Vantagens

✅ **Sincronização instantânea** entre você e o sócio
✅ **Backup automático** na nuvem
✅ **Acesso de qualquer lugar**
✅ **Afiliados acessam de qualquer dispositivo**
✅ **Dados compartilhados** para admins
✅ **Dados isolados** para afiliados
✅ **Funciona offline** (localStorage)

---

**Configuração completa!** 🎉

Os dados agora estão no Firebase e sincronizam automaticamente entre todos os usuários.
