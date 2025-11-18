import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Utilitário para gerenciar Firebase Firestore
export const firebaseStorage = {
  // Salvar dados
  set: async (key, value) => {
    try {
      const docRef = doc(db, 'dashboard', key)
      await setDoc(docRef, { data: value }, { merge: true })
      return true
    } catch (error) {
      console.error(`Erro ao salvar ${key} no Firebase:`, error)
      return false
    }
  },

  // Ler dados
  get: async (key, defaultValue = null) => {
    try {
      const docRef = doc(db, 'dashboard', key)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data().data
      }
      return defaultValue
    } catch (error) {
      console.error(`Erro ao ler ${key} do Firebase:`, error)
      return defaultValue
    }
  },

  // Remover dados
  remove: async (key) => {
    try {
      const docRef = doc(db, 'dashboard', key)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error(`Erro ao remover ${key} do Firebase:`, error)
      return false
    }
  },

  // Observar mudanças em tempo real
  subscribe: (key, callback, defaultValue = null) => {
    const docRef = doc(db, 'dashboard', key)
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data().data)
        } else {
          callback(defaultValue)
        }
      },
      (error) => {
        console.error(`Erro ao observar ${key} no Firebase:`, error)
        callback(defaultValue)
      }
    )

    return unsubscribe
  }
}

