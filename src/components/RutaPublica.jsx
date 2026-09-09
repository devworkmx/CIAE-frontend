// src/components/RutaPublica.jsx
import { Navigate } from 'react-router-dom'

function RutaPublica({ children }) {
  const token = localStorage.getItem('ciae_token')

  // Si ya tiene sesión activa, lo mandamos al panel de control
  if (token) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RutaPublica
