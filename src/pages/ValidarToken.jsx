import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Award,
  Calendar,
  Clock,
  User,
  UserCheck,
  ShieldCheck,
} from 'lucide-react'
import { API_URL } from '../services/api'

function ValidarToken() {
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
        <p className="text-[#1b3a6b] font-semibold text-lg animate-pulse">
          Consultando registro institucional...
        </p>
      </div>
    )
  }

  const esValidoYVigente = datos?.valido && datos?.vigente

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div
          className={`p-6 text-white text-center ${esValidoYVigente ? 'bg-[#1b3a6b]' : 'bg-red-800'}`}
        >
          {esValidoYVigente ? (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto mb-2 text-dorado" />
              <h1 className="text-2xl font-bold">Certificado Oficial Válido</h1>
              <p className="text-xs uppercase tracking-widest text-crema/80">
                Folio: {datos.folio}
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-2 text-red-200" />
              <h1 className="text-2xl font-bold">
                {datos?.valido && !datos?.vigente
                  ? 'Certificado Vencido'
                  : 'Certificado No Válido'}
              </h1>
              <p className="text-xs uppercase tracking-widest text-red-200">
                {datos?.valido && !datos?.vigente
                  ? 'El documento superó su fecha límite de vigencia'
                  : 'Registro no encontrado o revocado'}
              </p>
            </>
          )}
        </div>

        <div className="p-6">
          {datos?.valido ? (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Acreditado a
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <User className="w-4 h-4 text-dorado" />
                  {datos.alumno_nombre}
                </div>
              </div>

              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Programa Académico
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-[#1b3a6b]">
                  <Award className="w-4 h-4 text-dorado" />
                  {datos.curso_nombre}
                </div>
              </div>

              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Instructor / Emisor
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  {datos.instructor}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Duración
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {datos.duracion_horas} horas
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Emisión
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {datos.fecha_emision}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg text-sm text-center font-medium">
                {datos.tiene_vigencia ? (
                  datos.vigente ? (
                    <div className="bg-emerald-50 text-emerald-800 p-2 rounded flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Vigente hasta el {datos.fecha_vigencia}
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 p-2 rounded">
                      Expiró el {datos.fecha_vigencia}
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 text-slate-700 p-2 rounded">
                    Vigencia: Permanente / Sin caducidad
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-5">
                {error ||
                  'El folio o token no corresponde a un documento legítimo.'}
              </p>
              <Link
                to="/validacion-cursos"
                className="inline-block bg-[#1b3a6b] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-opacity-90"
              >
                Búsqueda Manual
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidarToken
