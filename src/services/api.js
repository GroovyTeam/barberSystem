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

export const updateUserProfile = async (userId, profileData) => {
  // AQUI IRÍA LA CONEXIÓN REAL:
  // const userRef = doc(db, "users", userId);
  // await updateDoc(userRef, profileData);
  
  // Fake API delay simulation
  console.log(`[API Mock] Actualizando perfil del usuario ${userId}...`, profileData)
  await delay(800) 
  
  return { success: true, data: profileData }
}

export const getBarbers = async () => {
  await delay(500)
  // ... fetch de base de datos
  return []
}

export const bookAppointment = async (appointmentData) => {
  console.log('[API Mock] Procesando reserva...', appointmentData)
  await delay(1200)
  // Aquí se enviaría el payload de Stripe y la info a la BD.
  return { success: true, appointmentId: 'APT-12345' }
}
