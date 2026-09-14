import { useState, useRef, useEffect, useId, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
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
  ShieldAlert,
  ExternalLink,
  Upload,
} from 'lucide-react'
import { API_URL } from '../services/api'

function formatearFecha(fechaStr) {
  if (!fechaStr) return ''
  const partes = String(fechaStr).split('-')
  if (partes.length !== 3) return fechaStr
  const [anio, mes, dia] = partes
  return `${dia}/${mes}/${anio}`
}

function TarjetaCertificadoOficial({ cert, alumnoActivo = true, fechaHoy }) {
  const tieneVig = Boolean(cert.tiene_vigencia)
  const fechaExp = cert.fecha_vigencia
  const esExpirado = tieneVig && fechaExp && fechaExp < fechaHoy
  const alumnoDadoDeBaja =
    cert.alumno_activo === false || alumnoActivo === false
  const esValido = cert.valido !== false && !esExpirado && !alumnoDadoDeBaja
  const folioMostrar = cert.folio_manual || cert.folio || 'N/A'

  return (
    <article className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition hover:shadow-2xl">
      <div
        className={`p-6 text-white text-center transition-colors ${
          esValido ? 'bg-[#1b3a6b]' : 'bg-red-800'
        }`}
      >
        {esValido ? (
          <>
            <CheckCircle2
              className="w-14 h-14 mx-auto mb-2 text-dorado"
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold tracking-tight">
              Certificado Oficial Auténtico
            </h3>
            <p className="text-xs uppercase tracking-widest text-crema/90 mt-1 font-mono">
              Folio: {folioMostrar}
            </p>
          </>
        ) : (
          <>
            <XCircle
              className="w-14 h-14 mx-auto mb-2 text-red-200"
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold tracking-tight">
              {alumnoDadoDeBaja
                ? 'Documento Inhabilitado (Baja Institucional)'
                : esExpirado
                  ? 'Certificado Vencido o Expirado'
                  : 'Certificado Revocado o No Válido'}
            </h3>
            <p className="text-xs uppercase tracking-widest text-red-200 mt-1 font-mono">
              Folio: {folioMostrar}
            </p>
          </>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Acreditado a
          </span>
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <User className="w-4 h-4 text-dorado shrink-0" aria-hidden="true" />
            <span>{cert.alumno_nombre}</span>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Programa Académico
          </span>
          <div className="flex items-center gap-2 text-base font-bold text-[#1b3a6b]">
            <Award
              className="w-4 h-4 text-dorado shrink-0"
              aria-hidden="true"
            />
            <span>{cert.curso_nombre}</span>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Instructor / Evaluador
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UserCheck
              className="w-4 h-4 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span>{cert.instructor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Duración Curricular
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
              <Clock
                className="w-4 h-4 text-slate-400 shrink-0"
                aria-hidden="true"
              />
              <span>{cert.duracion_horas} horas</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Fecha de Emisión
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
              <Calendar
                className="w-4 h-4 text-slate-400 shrink-0"
                aria-hidden="true"
              />
              <span>{formatearFecha(cert.fecha_emision)}</span>
            </div>
          </div>
        </div>

        <div className="pt-1">
          {tieneVig ? (
            esValido ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
                <ShieldCheck
                  className="w-4 h-4 text-emerald-600 shrink-0"
                  aria-hidden="true"
                />
                <span>Vigente hasta el {formatearFecha(fechaExp)}</span>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
                <ShieldAlert
                  className="w-4 h-4 text-red-600 shrink-0"
                  aria-hidden="true"
                />
                <span>Expiró el {formatearFecha(fechaExp)}</span>
              </div>
            )
          ) : (
            <div className="bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-xl text-center text-sm font-medium">
              Vigencia: <strong>Permanente / Sin caducidad</strong>
            </div>
          )}
        </div>

        {cert.token_publico && (
          <div className="pt-2 text-center">
            <a
              href={`/validar/${cert.token_publico}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline transition py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Abrir vista directa con Código QR</span>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export default function Validacion() {
  const navigate = useNavigate()
  const [tabActiva, setTabActiva] = useState('manual')
  const [metodoBusqueda, setMetodoBusqueda] = useState('folio')
  const [valorBusqueda, setValorBusqueda] = useState('')

  const [cargando, setCargando] = useState(false)
  const [datosRespuesta, setDatosRespuesta] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)
  const [errorCamara, setErrorCamara] = useState('')
  const [escaneando, setEscaneando] = useState(false)

  const inputBusquedaId = useId()
  const fechaHoy = new Date().toISOString().split('T')[0]

  const procesarResultadoQR = useCallback(
    (textoQR) => {
      if (!textoQR) return

      if (textoQR.includes('/validar/')) {
        const partes = textoQR.split('/validar/')[1]
        const tokenExtraido = partes.split('?')[0].split('#')[0]
        navigate(`/validar/${tokenExtraido}`)
      } else {
        setTabActiva('manual')
        setMetodoBusqueda('folio')
        setValorBusqueda(textoQR.trim())
      }
    },
    [navigate]
  )

  // Escaneo continuo con la cámara en vivo
  useEffect(() => {
    let detenido = false
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    function escanearFrame() {
      if (detenido) return

      const video = videoRef.current
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const codigo = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })

        if (codigo && codigo.data) {
          detenerCamara()
          procesarResultadoQR(codigo.data)
          return
        }
      }

      animFrameRef.current = requestAnimationFrame(escanearFrame)
    }

    async function iniciarCamara() {
      setErrorCamara('')

      if (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
      ) {
        setErrorCamara(
          'Para usar la cámara en vivo desde un celular se requiere HTTPS. Puedes subir una foto del código QR abajo o usar la búsqueda manual.'
        )
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorCamara(
          'Tu navegador no permite el acceso a la cámara. Sube la foto del QR abajo.'
        )
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true')
          await videoRef.current.play()
          setEscaneando(true)
          animFrameRef.current = requestAnimationFrame(escanearFrame)
        }
      } catch (err) {
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError'
        ) {
          setErrorCamara(
            'Permiso denegado. Permite el acceso a la cámara en las opciones de tu navegador.'
          )
        } else {
          setErrorCamara(
            'No se pudo acceder a la cámara. Puedes subir una fotografía del código QR.'
          )
        }
      }
    }

    function detenerCamara() {
      detenido = true
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      setEscaneando(false)
    }

    if (tabActiva === 'qr') {
      iniciarCamara()
    } else {
      detenerCamara()
    }

    return () => detenerCamara()
  }, [tabActiva, procesarResultadoQR])

  // Lector de archivos subidos por el usuario compatible con cualquier navegador
  function handleSubirImagenQR(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setErrorCamara('')
    const lector = new FileReader()

    lector.onload = (eventoCarga) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const codigo = jsQR(imageData.data, imageData.width, imageData.height)

        if (codigo && codigo.data) {
          procesarResultadoQR(codigo.data)
        } else {
          setErrorCamara(
            'No se detectó un código QR válido en la imagen. Asegúrate de que la foto sea nítida.'
          )
        }
      }
      img.src = eventoCarga.target.result
    }

    lector.readAsDataURL(archivo)
  }

  async function handleBuscar(e) {
    e.preventDefault()
    const valorLimpio = valorBusqueda.trim()
    if (!valorLimpio) return

    setCargando(true)
    setErrorBusqueda('')
    setDatosRespuesta(null)

    try {
      const url = `${API_URL}/api/public/buscar?tipo=${metodoBusqueda}&valor=${encodeURIComponent(valorLimpio)}`
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.detail || 'No se encontró información para los datos ingresados.'
        )
      }

      if (data.certificados && Array.isArray(data.certificados)) {
        setDatosRespuesta(data)
      } else if (Array.isArray(data)) {
        setDatosRespuesta({
          tipo_consulta: metodoBusqueda,
          alumno: data[0]
            ? {
                nombre: data[0].alumno_nombre,
                curp: valorLimpio,
                activo: data[0].alumno_activo,
              }
            : null,
          certificados: data,
        })
      } else {
        setDatosRespuesta({
          tipo_consulta: 'folio',
          alumno: {
            nombre: data.alumno_nombre,
            curp: data.curp || '',
            activo: data.alumno_activo !== false,
          },
          certificados: [data],
        })
      }
    } catch (err) {
      setErrorBusqueda(err.message)
    } finally {
      setCargando(false)
    }
  }

  const esBusquedaCurp = datosRespuesta?.tipo_consulta === 'curp'
  const alumnoInfo = datosRespuesta?.alumno
  const certificadosList = datosRespuesta?.certificados || []

  return (
    <main className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3a6b] mb-2 tracking-tight">
            Validación de Cursos y Certificados
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Verifica la autenticidad académica oficial mediante el número de
            folio institucional, CURP del alumno o escaneando el código QR.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div
            role="tablist"
            aria-label="Modo de validación"
            className="grid grid-cols-2 border-b border-slate-200"
          >
            <button
              type="button"
              role="tab"
              id="tab-manual"
              aria-selected={tabActiva === 'manual'}
              aria-controls="panel-manual"
              onClick={() => {
                setTabActiva('manual')
                setErrorBusqueda('')
              }}
              className={`min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                tabActiva === 'manual'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Búsqueda manual</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-qr"
              aria-selected={tabActiva === 'qr'}
              aria-controls="panel-qr"
              onClick={() => {
                setTabActiva('qr')
                setErrorBusqueda('')
              }}
              className={`min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                tabActiva === 'qr'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              <span>Escanear QR</span>
            </button>
          </div>

          {tabActiva === 'manual' && (
            <div
              role="tabpanel"
              id="panel-manual"
              aria-labelledby="tab-manual"
              className="p-6 sm:p-8"
            >
              <form onSubmit={handleBuscar} className="space-y-6">
                <fieldset>
                  <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Selecciona el método de consulta:
                  </legend>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMetodoBusqueda('folio')
                        setDatosRespuesta(null)
                        setErrorBusqueda('')
                      }}
                      className={`min-h-[44px] flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                        metodoBusqueda === 'folio'
                          ? 'border-[#1b3a6b] bg-blue-50/70 text-[#1b3a6b]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FileDigit className="w-4 h-4" aria-hidden="true" />
                      <span>Por Folio de Certificado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMetodoBusqueda('curp')
                        setDatosRespuesta(null)
                        setErrorBusqueda('')
                      }}
                      className={`min-h-[44px] flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                        metodoBusqueda === 'curp'
                          ? 'border-[#1b3a6b] bg-blue-50/70 text-[#1b3a6b]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <IdCard className="w-4 h-4" aria-hidden="true" />
                      <span>Por CURP del Alumno</span>
                    </button>
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor={inputBusquedaId}
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    {metodoBusqueda === 'folio'
                      ? 'Número de Folio Asignado *'
                      : 'CURP del Alumno (18 caracteres) *'}
                  </label>
                  <input
                    id={inputBusquedaId}
                    type="text"
                    required
                    maxLength={metodoBusqueda === 'curp' ? 18 : 60}
                    value={valorBusqueda}
                    onChange={(e) =>
                      setValorBusqueda(
                        metodoBusqueda === 'curp'
                          ? e.target.value.toUpperCase()
                          : e.target.value
                      )
                    }
                    placeholder={
                      metodoBusqueda === 'folio'
                        ? 'Ej. CER-01'
                        : 'Ej. ABCD960101HDFXYZ01'
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full min-h-[44px] bg-dorado text-[#0f1f3d] font-bold text-sm py-3 px-6 rounded-lg hover:brightness-95 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {cargando
                      ? 'Verificando en padrón oficial...'
                      : 'Consultar Autenticidad'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {tabActiva === 'qr' && (
            <div
              role="tabpanel"
              id="panel-qr"
              aria-labelledby="tab-qr"
              className="p-6 sm:p-8 flex flex-col items-center"
            >
              <div className="relative w-full max-w-sm aspect-square bg-slate-950 rounded-2xl overflow-hidden mb-5 shadow-lg border border-slate-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {escaneando && (
                  <div className="absolute inset-10 border-2 border-dashed border-dorado rounded-2xl pointer-events-none animate-pulse flex items-center justify-center">
                    <span className="text-[11px] font-bold text-dorado bg-slate-900/80 px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      Enfocando QR...
                    </span>
                  </div>
                )}
              </div>

              {errorCamara && (
                <div
                  role="alert"
                  className="w-full max-w-sm text-xs sm:text-sm text-amber-900 bg-amber-50 border border-amber-200 p-3.5 rounded-xl mb-4 text-center leading-relaxed"
                >
                  {errorCamara}
                </div>
              )}

              {/* Selector de archivo universal */}
              <div className="w-full max-w-sm border-t border-slate-200 pt-4 flex flex-col items-center gap-3">
                <label className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl cursor-pointer transition focus-within:ring-2 focus-within:ring-[#1b3a6b]">
                  <Upload
                    className="w-4 h-4 text-slate-600"
                    aria-hidden="true"
                  />
                  <span>Subir imagen o foto del QR</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubirImagenQR}
                    className="sr-only"
                  />
                </label>

                <p className="text-xs text-slate-500 text-center flex items-center gap-1.5">
                  <Camera
                    className="w-3.5 h-3.5 text-slate-400 shrink-0"
                    aria-hidden="true"
                  />
                  Compatible con fotos de constancias tomadas desde cualquier
                  móvil o PC.
                </p>
              </div>
            </div>
          )}
        </div>

        {errorBusqueda && (
          <aside
            role="alert"
            className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium mb-8"
          >
            <XCircle
              className="w-6 h-6 mx-auto mb-1.5 text-red-500"
              aria-hidden="true"
            />
            <p>{errorBusqueda}</p>
          </aside>
        )}

        {datosRespuesta && (
          <section aria-labelledby="resultado-titulo" className="space-y-6">
            {esBusquedaCurp ? (
              <>
                {alumnoInfo && (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Expediente del Titular
                      </span>
                      <h2
                        id="resultado-titulo"
                        className="text-lg font-bold text-slate-900 flex items-center gap-2"
                      >
                        <User
                          className="w-5 h-5 text-dorado shrink-0"
                          aria-hidden="true"
                        />
                        {alumnoInfo.nombre}
                      </h2>
                      {alumnoInfo.curp && (
                        <p className="text-xs font-mono text-slate-500 mt-0.5">
                          CURP: {alumnoInfo.curp}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          alumnoInfo.activo !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {alumnoInfo.activo !== false ? (
                          <>
                            <CheckCircle2
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            Padrón Activo
                          </>
                        ) : (
                          <>
                            <ShieldAlert
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            Baja Institucional
                          </>
                        )}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {certificadosList.length}{' '}
                        {certificadosList.length === 1
                          ? 'constancia'
                          : 'constancias'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {certificadosList.map((cert, index) => (
                    <TarjetaCertificadoOficial
                      key={cert.id || cert.token_publico || index}
                      cert={cert}
                      alumnoActivo={alumnoInfo?.activo !== false}
                      fechaHoy={fechaHoy}
                    />
                  ))}
                </div>
              </>
            ) : (
              certificadosList[0] && (
                <TarjetaCertificadoOficial
                  cert={certificadosList[0]}
                  alumnoActivo={
                    alumnoInfo
                      ? alumnoInfo.activo !== false
                      : certificadosList[0].alumno_activo !== false
                  }
                  fechaHoy={fechaHoy}
                />
              )
            )}
          </section>
        )}
      </div>
    </main>
  )
}
