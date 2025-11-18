import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCray6IDDaZ-n76vChV2KKuu17SECL5hXY",
  authDomain: "elevare-981b1.firebaseapp.com",
  projectId: "elevare-981b1",
  storageBucket: "elevare-981b1.firebasestorage.app",
  messagingSenderId: "1034421294665",
  appId: "1:1034421294665:web:f2535ece4f604ca4a21198",
  measurementId: "G-BGJJVBSE2C"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

export default app

