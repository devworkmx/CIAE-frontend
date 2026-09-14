// src/components/RutaPublica.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { verificarSesion } from '../services/api'

function RutaPublica({ children }) {
  const [estado, setEstado] = useState('verificando') // 'verificando' | 'con-sesion' | 'sin-sesion'

  useEffect(() => {
    let cancelado = false

    verificarSesion().then((usuario) => {
      if (cancelado) return
      setEstado(usuario ? 'con-sesion' : 'sin-sesion')
    })

    return () => {
      cancelado = true
    }
  }, [])

  // Mientras se confirma, mostramos el contenido público (ej. el login) para
  // no dejar la pantalla en blanco -- si resulta que ya había sesión activa,
  // se redirige en cuanto el backend responde.
  if (estado === 'con-sesion') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RutaPublica
