import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { API_URL } from '../services/api'
import TarjetaCertificado from '../components/TarjetaCertificado'

export default function ValidarToken() {
  const { token } = useParams()
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function verificar() {
      try {
        const res = await fetch(`${API_URL}/api/public/validar/${token}`)
        const data = await res.json()
        if (!res.ok)
          throw new Error(data.detail || 'Certificado inválido o no encontrado')
        setDatos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    verificar()
  }, [token])

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-azulmarino font-semibold text-lg animate-pulse">
          Consultando registro institucional...
        </p>
      </div>
    )
  }

  if (error || !datos) {
    return (
      <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Documento No Válido
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {error ||
              'El folio o token no corresponde a un documento legítimo o registrado.'}
          </p>
          <Link
            to="/validacion-cursos"
            className="inline-block bg-azulmarino text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all shadow-md"
          >
            Búsqueda Manual
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <TarjetaCertificado cert={datos} />
      </div>
    </div>
  )
}
