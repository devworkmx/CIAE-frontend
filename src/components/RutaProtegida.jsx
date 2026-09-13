import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { verificarSesion } from '../services/api'

function RutaProtegida({ children }) {
  // La cookie de sesión es httpOnly: JavaScript no puede leerla directamente,
  // así que la única forma de saber si hay sesión activa es preguntarle al
  // backend (que sí puede leerla, porque el navegador la reenvía solo).
  const [estado, setEstado] = useState('verificando') // 'verificando' | 'autorizado' | 'no-autorizado'

  useEffect(() => {
    let cancelado = false

    verificarSesion().then((usuario) => {
      if (cancelado) return
      setEstado(usuario ? 'autorizado' : 'no-autorizado')
    })

    return () => {
      cancelado = true
    }
  }, [])

  if (estado === 'verificando') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-[40vh] flex items-center justify-center text-slate-500 text-sm"
      >
        Verificando sesión...
      </div>
    )
  }

  if (estado === 'no-autorizado') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaProtegida
