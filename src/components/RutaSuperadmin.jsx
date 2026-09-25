import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { verificarSesion } from '../services/api'

// Igual que RutaProtegida, pero además exige rol === 'superadmin'. Un admin
// de tenant autenticado que intente entrar aquí es enviado a /admin en vez
// de a /login, porque sí tiene sesión válida, solo que no tiene permiso.
function RutaSuperadmin({ children }) {
  const [estado, setEstado] = useState('verificando') // 'verificando' | 'superadmin' | 'sin-permiso' | 'no-autorizado'

  useEffect(() => {
    let cancelado = false

    verificarSesion().then((usuario) => {
      if (cancelado) return
      if (!usuario) {
        setEstado('no-autorizado')
      } else if (usuario.rol === 'superadmin') {
        setEstado('superadmin')
      } else {
        setEstado('sin-permiso')
      }
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

  if (estado === 'sin-permiso') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RutaSuperadmin
