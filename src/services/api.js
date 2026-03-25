/**
 * API Connection Blueprint
 * 
 * Este archivo centraliza la lógica de conexión al backend. 
 * Mientras no insertes las credenciales reales de Firebase, Supabase o un API REST propio,
 * estas funciones simularán llamadas asíncronas para probar el flujo de la UI de React.
 */

// 1. Aquí podrás inicializar tu cliente de BD, por ejemplo:
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, updateDoc } from "firebase/firestore";
// 
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

/** Simula un delay en milisegundos */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const API_URL = 'http://localhost:3000/api'

export const getServices = async () => {
  try {
    const res = await fetch(`${API_URL}/services`)
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getBarbers = async () => {
  try {
    const res = await fetch(`${API_URL}/barbers`)
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export const bookAppointment = async (appointmentData) => {
  try {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    })
    return await res.json()
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}

export const updateUserProfile = async (userId, profileData) => {
  // Pending Express endpoint for PUT /api/users/:id
  await new Promise(r => setTimeout(r, 800))
  return { success: true, data: profileData }
}
