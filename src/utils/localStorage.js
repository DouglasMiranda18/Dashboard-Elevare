// Utilitário para gerenciar localStorage
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erro ao ler ${key} do localStorage:`, error)
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error)
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error)
    }
  },

  // Método para usar com contexto de usuário
  getUserData: (userKey, defaultValue = null) => {
    return storage.get(userKey, defaultValue)
  },

  setUserData: (userKey, value) => {
    storage.set(userKey, value)
  }
}