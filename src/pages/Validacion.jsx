import { useState, useRef, useEffect } from 'react'
import {
  Search,
  QrCode,
  Camera,
  FileDigit,
  IdCard,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Clock,
  User,
  UserCheck,
  ShieldCheck,
} from 'lucide-react'
import { API_URL } from '../services/api'

function Validacion() {
  const [tabActiva, setTabActiva] = useState('manual')
  const [metodoBusqueda, setMetodoBusqueda] = useState('folio')
  const [valorBusqueda, setValorBusqueda] = useState('')

  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [errorCamara, setErrorCamara] = useState('')

  useEffect(() => {
    async function iniciarCamara() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setErrorCamara('')
      } catch (error) {
        setErrorCamara(
          'No se pudo acceder a la cámara. Verifica los permisos de tu navegador.'
        )
      }
    }

    function detenerCamara() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }

    if (tabActiva === 'qr') {
      iniciarCamara()
    } else {
      detenerCamara()
    }

    return () => detenerCamara()
  }, [tabActiva])

  async function handleBuscar(e) {
    e.preventDefault()
    if (!valorBusqueda.trim()) return

    setCargando(true)
    setErrorBusqueda('')
    setResultado(null)

    try {
      const url = `${API_URL}/api/public/buscar?tipo=${metodoBusqueda}&valor=${encodeURIComponent(
        valorBusqueda.trim()
      )}`
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.detail || 'No se encontró información para los datos ingresados.'
        )
      }

      setResultado(data)
    } catch (err) {
      setErrorBusqueda(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1b3a6b] mb-2">
            Validación de Cursos y Certificados
          </h1>
          <p className="text-gray-500">
            Verifica la autenticidad académica por folio institucional, CURP o
            escaneando el código QR.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-2">
            <button
              onClick={() => {
                setTabActiva('manual')
                setErrorBusqueda('')
              }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tabActiva === 'manual'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Búsqueda manual
            </button>

            <button
              onClick={() => {
                setTabActiva('qr')
                setErrorBusqueda('')
              }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tabActiva === 'qr'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Escanear QR
            </button>
          </div>

          {tabActiva === 'manual' && (
            <form onSubmit={handleBuscar} className="p-8">
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMetodoBusqueda('folio')
                    setResultado(null)
                    setErrorBusqueda('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    metodoBusqueda === 'folio'
                      ? 'border-[#1b3a6b] bg-[#1b3a6b]/10 text-[#1b3a6b] font-bold'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FileDigit className="w-4 h-4" />
                  Folio Manual
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMetodoBusqueda('curp')
                    setResultado(null)
                    setErrorBusqueda('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    metodoBusqueda === 'curp'
                      ? 'border-[#1b3a6b] bg-[#1b3a6b]/10 text-[#1b3a6b] font-bold'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <IdCard className="w-4 h-4" />
                  CURP
                </button>
              </div>

              <label
                htmlFor="valorBusqueda"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {metodoBusqueda === 'folio'
                  ? 'Número de Folio Asignado'
                  : 'CURP del Alumno'}
              </label>
              <input
                id="valorBusqueda"
                type="text"
                required
                value={valorBusqueda}
                onChange={(e) => setValorBusqueda(e.target.value)}
                placeholder={
                  metodoBusqueda === 'folio'
                    ? 'Ej. CIAE-2026-001'
                    : 'Ej. ABCD960101HDFXYZ01'
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] mb-6"
              />

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-dorado text-[#0f1f3d] font-semibold py-3 rounded-lg hover:brightness-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {cargando ? 'Verificando...' : 'Validar Certificado'}
              </button>
            </form>
          )}

          {tabActiva === 'qr' && (
            <div className="p-8 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-8 border-2 border-dashed border-dorado rounded-lg pointer-events-none" />
              </div>

              {errorCamara && (
                <p className="text-sm text-red-600 text-center mb-2">
                  {errorCamara}
                </p>
              )}

              <p className="text-sm text-gray-500 text-center flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Apunta la cámara al código QR impreso en el documento.
              </p>
            </div>
          )}
        </div>

        {errorBusqueda && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm font-medium mb-6">
            <XCircle className="w-6 h-6 mx-auto mb-1 text-red-500" />
            {errorBusqueda}
          </div>
        )}

        {resultado && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div
              className={`p-6 text-white text-center ${
                resultado.valido && resultado.vigente
                  ? 'bg-[#1b3a6b]'
                  : 'bg-red-800'
              }`}
            >
              {resultado.valido && resultado.vigente ? (
                <>
                  <CheckCircle2 className="w-14 h-14 mx-auto mb-2 text-dorado" />
                  <h2 className="text-xl font-bold">
                    Certificado Oficial Auténtico
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-crema/80">
                    Folio: {resultado.folio}
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-14 h-14 mx-auto mb-2 text-red-200" />
                  <h2 className="text-xl font-bold">
                    Certificado Vencido o No Vigente
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-red-200">
                    Folio: {resultado.folio}
                  </p>
                </>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Acreditado a
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <User className="w-4 h-4 text-dorado" />
                  {resultado.alumno_nombre}
                </div>
              </div>

              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Programa Académico
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-[#1b3a6b]">
                  <Award className="w-4 h-4 text-dorado" />
                  {resultado.curso_nombre}
                </div>
              </div>

              <div className="border-b pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Instructor / Emisor
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  {resultado.instructor}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Duración
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {resultado.duracion_horas} horas
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Emisión
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {resultado.fecha_emision}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg text-sm text-center font-medium">
                {resultado.tiene_vigencia ? (
                  resultado.vigente ? (
                    <div className="bg-emerald-50 text-emerald-800 p-2 rounded flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Vigente hasta el {resultado.fecha_vigencia}
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 p-2 rounded">
                      Expiró el {resultado.fecha_vigencia}
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 text-slate-700 p-2 rounded">
                    Vigencia: Permanente / Sin caducidad
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Validacion
