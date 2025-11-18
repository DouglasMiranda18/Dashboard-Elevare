// Storage wrapper que usa Firebase ou localStorage como fallback
import { firebaseStorage } from './firebaseStorage'
import { storage as localStorage } from './localStorage'

// Flag para controlar se usa Firebase ou localStorage
const USE_FIREBASE = true

// Função para detectar se há conexão
const isOnline = () => {
  return navigator.onLine
}

export const storage = {
  // Salvar dados
  set: async (key, value) => {
    if (USE_FIREBASE && isOnline()) {
      try {
        await firebaseStorage.set(key, value)
        // Também salvar no localStorage como backup offline
        localStorage.set(key, value)
        return true
      } catch (error) {
        console.warn('Erro ao salvar no Firebase, usando localStorage:', error)
        localStorage.set(key, value)
        return false
      }
    } else {
      localStorage.set(key, value)
      return true
    }
  },

  // Ler dados
  get: async (key, defaultValue = null) => {
    if (USE_FIREBASE && isOnline()) {
      try {
        const data = await firebaseStorage.get(key, defaultValue)
        // Atualizar localStorage com dados do Firebase
        if (data !== defaultValue) {
          localStorage.set(key, data)
        }
        return data || defaultValue
      } catch (error) {
        console.warn('Erro ao ler do Firebase, usando localStorage:', error)
        return localStorage.get(key, defaultValue)
      }
    } else {
      return localStorage.get(key, defaultValue)
    }
  },

  // Remover dados
  remove: async (key) => {
    if (USE_FIREBASE && isOnline()) {
      try {
        await firebaseStorage.remove(key)
        localStorage.remove(key)
        return true
      } catch (error) {
        console.warn('Erro ao remover do Firebase, usando localStorage:', error)
        localStorage.remove(key)
        return false
      }
    } else {
      localStorage.remove(key)
      return true
    }
  },

  // Observar mudanças em tempo real (apenas Firebase)
  subscribe: (key, callback, defaultValue = null) => {
    if (USE_FIREBASE && isOnline()) {
      try {
        return firebaseStorage.subscribe(key, callback, defaultValue)
      } catch (error) {
        console.warn('Erro ao observar Firebase:', error)
        // Fallback: retornar valor atual do localStorage
        callback(localStorage.get(key, defaultValue))
        return () => {}
      }
    } else {
      // Fallback: retornar valor atual do localStorage
      callback(localStorage.get(key, defaultValue))
      return () => {}
    }
  },

  // Métodos de compatibilidade
  getUserData: async (userKey, defaultValue = null) => {
    return storage.get(userKey, defaultValue)
  },

  setUserData: async (userKey, value) => {
    return storage.set(userKey, value)
  }
}

