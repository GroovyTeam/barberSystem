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

export const getBarbers = async (showAll = false) => {
  try {
    const res = await fetch(`${API_URL}/barbers${showAll ? '?all=true' : ''}`)
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export const updateBarberAvailability = async (id, isAvailable) => {
  try {
    const res = await fetch(`${API_URL}/barbers/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable })
    })
    return await res.json()
  } catch (error) {
    console.error(error)
    return { error: true }
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
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    })
    return await res.json()
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}

export const getClientAppointments = async (clientId) => {
  try {
    // Para simplificar, obtenemos al usuario 'current' si no se pasa ID específico
    let actualId = clientId
    if(clientId === 'current') {
      const userRes = await fetch(`${API_URL}/users/current`)
      const user = await userRes.json()
      actualId = user.id
    }
    const res = await fetch(`${API_URL}/appointments/client/${actualId}`)
    return await res.json()
  } catch(err) {
    console.error(err)
    return []
  }
}

export const cancelAppointment = async (apptId) => {
  try {
    const res = await fetch(`${API_URL}/appointments/${apptId}/cancel`, { method: 'PUT' })
    return await res.json()
  } catch(err) {
    console.error(err)
    return { error: true }
  }
}

export const getCurrentUser = async () => {
  try {
    const res = await fetch(`${API_URL}/users/current`)
    return await res.json()
  } catch(err) {
    console.error(err)
    return null
  }
}

export const getAppointments = async () => {
  try {
    const res = await fetch(`${API_URL}/appointments`)
    return await res.json()
  } catch(err) {
    console.error(err)
    return []
  }
}
