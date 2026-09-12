// Si hay una variable de entorno definida (por ejemplo en producción), la usa;
// de lo contrario, deja un string vacío para hacer peticiones relativas al mismo origen y protocolo.
export const API_URL = import.meta.env.VITE_API_URL || ''

export function getAuthHeaders() {
  const token = localStorage.getItem('ciae_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
