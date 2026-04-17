/**
 * API Connection Layer — Black & Blade Barbershop
 * 
 * Todas las llamadas al backend pasan por este archivo.
 * Configurado con credentials: 'include' para enviar cookies httpOnly (JWT).
 */

const API_URL = 'http://localhost:3000'

// ═══════════════════════════════════════════════════════════════
// Helper: fetch con manejo de errores y credenciales
// ═══════════════════════════════════════════════════════════════
const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      credentials: 'include', // Enviar cookies httpOnly automáticamente
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    // Si es 401 (no autorizado), redirigir al login
    if (res.status === 401) {
      // Solo redirigir si no estamos ya en login o welcome
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/' && !path.includes('/auth')) {
        window.location.href = '/login'
      }
      return null
    }

    // Intentar parsear JSON solo si hay contenido
    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    if (!res.ok) {
      throw new Error(data?.error || `Error ${res.status}: ${res.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`🔴 API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
export const login = async (email, password) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export const register = async (firstName, lastName, email, password, phone) => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password, phone })
  })
}

export const socialLogin = async (userData) => {
  return apiFetch('/auth/social-login', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export const logout = async () => {
  return apiFetch('/auth/logout', { method: 'POST' })
}

export const getCurrentUser = async () => {
  try {
    return await apiFetch('/users/current')
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════
// SERVICIOS (público)
// ═══════════════════════════════════════════════════════════════
export const getServices = async () => {
  try {
    const data = await apiFetch('/services')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════
// BARBEROS (público para lectura)
// ═══════════════════════════════════════════════════════════════
export const getBarbers = async (showAll = false) => {
  try {
    const data = await apiFetch(`/barbers${showAll ? '?all=true' : ''}`)
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw error
  }
}

export const updateBarberAvailability = async (id, isAvailable) => {
  try {
    return await apiFetch(`/barbers/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable })
    })
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}

// ═══════════════════════════════════════════════════════════════
// CITAS
// ═══════════════════════════════════════════════════════════════
export const bookAppointment = async (appointmentData) => {
  try {
    return await apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    })
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}

export const getMyAppointments = async () => {
  try {
    return await apiFetch('/appointments/mine')
  } catch (err) {
    console.error(err)
    return []
  }
}

export const cancelAppointment = async (apptId) => {
  try {
    return await apiFetch(`/appointments/${apptId}/cancel`, { method: 'PUT' })
  } catch (err) {
    console.error(err)
    return { error: true }
  }
}

export const getAppointments = async () => {
  try {
    return await apiFetch('/appointments')
  } catch (err) {
    console.error(err)
    return []
  }
}

// ═══════════════════════════════════════════════════════════════
// USUARIOS
// ═══════════════════════════════════════════════════════════════
export const updateProfile = async (profileData) => {
  try {
    return await apiFetch('/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}



// ═══════════════════════════════════════════════════════════════
// DASHBOARD (admin)
// ═══════════════════════════════════════════════════════════════
export const getDashboardStats = async (date) => {
  try {
    return await apiFetch(`/dashboard/stats${date ? `?date=${date}` : ''}`)
  } catch (error) {
    console.error(error)
    return null
  }
}
