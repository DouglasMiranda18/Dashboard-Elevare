import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, updateDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { storage } from '../utils/storage'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  // Carregar currentUser do localStorage primeiro (síncrono)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [users, setUsers] = useState([])
  const [affiliates, setAffiliates] = useState([])
  const [allFirebaseUsers, setAllFirebaseUsers] = useState([]) // Todos os usuários do Firestore
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  // Buscar todos os usuários do Firestore
  const fetchAllUsers = async () => {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const usersList = []
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() })
      })
      setAllFirebaseUsers(usersList)
      return usersList
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return []
    }
  }

  // Observar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true)
      if (firebaseUser) {
        // Usuário autenticado - buscar dados do Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = { id: firebaseUser.uid, ...userDoc.data() }
            setCurrentUser(userData)
            localStorage.setItem('currentUser', JSON.stringify(userData))
          } else {
            // Se não existe documento, verificar se é o primeiro usuário
            const existingUsers = await fetchAllUsers()
            const isFirstUser = existingUsers.length === 0
            
            const newUserData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              role: isFirstUser ? 'admin' : 'affiliate',
              permissions: isFirstUser ? ['all'] : [],
              createdAt: new Date().toISOString()
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData)
            setCurrentUser(newUserData)
            localStorage.setItem('currentUser', JSON.stringify(newUserData))
            await fetchAllUsers()
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      } else {
        // Usuário não autenticado
        setCurrentUser(null)
        localStorage.removeItem('currentUser')
      }
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Carregar dados do Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUsers = await storage.get('users', [])
        const savedAffiliates = await storage.get('affiliates', [])

        // Criar usuários padrão se não existir
        if (savedUsers.length === 0) {
          const defaultUsers = [
            {
              id: 1,
              name: 'Admin',
              role: 'admin',
              permissions: ['all'],
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              name: 'Sócio',
              role: 'admin',
              permissions: ['all'],
              createdAt: new Date().toISOString()
            }
          ]
          await storage.set('users', defaultUsers)
          setUsers(defaultUsers)
        } else {
          setUsers(savedUsers)
        }

        setAffiliates(savedAffiliates || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Observar mudanças em tempo real
    const unsubscribeUsers = storage.subscribe('users', (data) => {
      if (data && data.length > 0) {
        setUsers(data)
      }
    }, [])

    const unsubscribeAffiliates = storage.subscribe('affiliates', (data) => {
      if (data) {
        setAffiliates(data)
      }
    }, [])

    return () => {
      if (unsubscribeUsers) unsubscribeUsers()
      if (unsubscribeAffiliates) unsubscribeAffiliates()
    }
  }, [])

  useEffect(() => {
    const saveUsers = async () => {
      if (users.length > 0) {
        await storage.set('users', users)
      }
    }
    saveUsers()
  }, [users])

  useEffect(() => {
    const saveAffiliates = async () => {
      await storage.set('affiliates', affiliates)
    }
    saveAffiliates()
  }, [affiliates])

  const login = async (userId) => {
    const user = [...users, ...affiliates].find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
      // Salvar no localStorage (rápido) e Firebase
      localStorage.setItem('currentUser', JSON.stringify(user))
      await storage.set('currentUser', user)
    }
  }

  // Login com Firebase Auth
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // O onAuthStateChanged vai atualizar o currentUser automaticamente
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error('Erro no login:', error)
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado. Verifique o email ou crie uma conta.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Tente novamente.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Esta conta foi desabilitada.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.'
      }
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  // Atualizar papel do usuário
  const updateUserRole = async (userId, newRole, permissions = []) => {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: newRole,
        permissions: newRole === 'admin' ? ['all'] : permissions,
        updatedAt: new Date().toISOString()
      })
      
      // Atualizar lista local
      await fetchAllUsers()
      
      // Se for o usuário atual, atualizar também
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, role: newRole, permissions: newRole === 'admin' ? ['all'] : permissions }
        setCurrentUser(updatedUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar papel do usuário:', error)
      return { success: false, error: error.message }
    }
  }

  // Registro com Firebase Auth - cria como afiliado por padrão
  const registerWithEmail = async (email, password, name) => {
    try {
      // Verificar se é o primeiro usuário (será admin)
      const existingUsers = await fetchAllUsers()
      const isFirstUser = existingUsers.length === 0

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Criar documento do usuário no Firestore
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.email?.split('@')[0] || 'Usuário',
        role: isFirstUser ? 'admin' : 'affiliate', // Primeiro usuário é admin, demais são afiliados
        permissions: isFirstUser ? ['all'] : [],
        createdAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      
      // Atualizar lista de usuários
      await fetchAllUsers()
      
      // O onAuthStateChanged vai atualizar o currentUser automaticamente
      return { success: true, user: firebaseUser }
    } catch (error) {
      console.error('Erro no registro:', error)
      let errorMessage = 'Erro ao criar conta.'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.'
      }
      return { success: false, error: errorMessage }
    }
  }

  const loginByName = async (userName) => {
    let user = [...users, ...affiliates].find(u => u.name === userName)
    
    if (!user) {
      // Criar novo usuário admin/sócio se não existir
      user = {
        id: Date.now(),
        name: userName,
        role: 'admin',
        permissions: ['all'],
        createdAt: new Date().toISOString()
      }
      const newUsers = [...users, user]
      setUsers(newUsers)
      await storage.set('users', newUsers)
    }
    
    setCurrentUser(user)
    // Salvar no localStorage (rápido) e Firebase
    localStorage.setItem('currentUser', JSON.stringify(user))
    await storage.set('currentUser', user)
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      // O onAuthStateChanged vai limpar o currentUser automaticamente
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Fallback: limpar manualmente
      setCurrentUser(null)
      localStorage.removeItem('currentUser')
      await storage.remove('currentUser')
    }
  }

  const addAffiliate = (affiliateData) => {
    const newAffiliate = {
      id: Date.now(),
      ...affiliateData,
      role: 'affiliate',
      createdAt: new Date().toISOString()
    }
    setAffiliates(prev => [...prev, newAffiliate])
    return newAffiliate
  }

  const updateAffiliate = (id, affiliateData) => {
    setAffiliates(prev => prev.map(aff => 
      aff.id === id ? { ...aff, ...affiliateData } : aff
    ))
  }

  const deleteAffiliate = (id) => {
    setAffiliates(prev => prev.filter(aff => aff.id !== id))
  }

  const getUserKey = (key) => {
    // Admin e Sócio compartilham os mesmos dados (sem prefixo)
    if (currentUser && (currentUser.role === 'admin')) {
      return key // Dados compartilhados
    }
    // Afiliados têm dados separados
    if (currentUser && currentUser.role === 'affiliate') {
      return `${currentUser.id}_${key}`
    }
    return key
  }

  const hasPermission = (page) => {
    if (!currentUser) return false
    
    // Admin e Sócio têm acesso a tudo
    if (currentUser.role === 'admin') {
      return true
    }
    
    // Afiliados: verificar permissões
    if (currentUser.role === 'affiliate') {
      return currentUser.permissions?.includes('all') || 
             currentUser.permissions?.includes(page) || 
             false
    }
    
    return false
  }

  const canAccessPage = (page) => {
    return hasPermission(page)
  }

  // Permitir acesso à página de afiliados apenas para admins
  const canAccessAffiliates = () => {
    return currentUser && currentUser.role === 'admin'
  }

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      users,
      affiliates,
      allFirebaseUsers,
      loading: loading || authLoading,
      login, 
      loginByName,
      loginWithEmail,
      registerWithEmail,
      logout, 
      getUserKey, 
      hasPermission,
      canAccessPage,
      addAffiliate,
      updateAffiliate,
      deleteAffiliate,
      fetchAllUsers,
      updateUserRole
    }}>
      {children}
    </UserContext.Provider>
  )
}