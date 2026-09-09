// Si estás navegando desde 192.168.x.x:5173, apuntará a http://192.168.x.x:8000 automáticamente
const hostname = window.location.hostname
export const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:8000`

export function getAuthHeaders() {
  const token = localStorage.getItem('ciae_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
