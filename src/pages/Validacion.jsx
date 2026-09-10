import { useState, useRef, useEffect, useId } from 'react'
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
} from 'lucide-react'
import { API_URL } from '../services/api'

function formatearFecha(fechaStr) {
  if (!fechaStr) return ''
  const partes = fechaStr.split('-')
  if (partes.length !== 3) return fechaStr
  const [anio, mes, dia] = partes
  return `${dia}/${mes}/${anio}`
}

export default function Validacion() {
  const [tabActiva, setTabActiva] = useState('manual')
  const [metodoBusqueda, setMetodoBusqueda] = useState('folio')
  const [valorBusqueda, setValorBusqueda] = useState('')

  const [cargando, setCargando] = useState(false)
  const [datosRespuesta, setDatosRespuesta] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [errorCamara, setErrorCamara] = useState('')

  const inputBusquedaId = useId()
  const fechaHoy = new Date().toISOString().split('T')[0]

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
      } catch {
        setErrorCamara(
          'No se pudo acceder a la cámara. Verifica los permisos de tu navegador o dispositivo.'
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

      setDatosRespuesta(data)
    } catch (err) {
      setErrorBusqueda(err.message)
    } finally {
      setCargando(false)
    }
  }

  const alumnoInfo = datosRespuesta?.alumno
  const certificadosList = datosRespuesta?.certificados || []
  const esBajaInstitucional = alumnoInfo && alumnoInfo.activo === false

  return (
    <main className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado accesible */}
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3a6b] mb-2 tracking-tight">
            Validación de Cursos y Certificados
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Verifica la autenticidad académica oficial mediante el número de
            folio institucional, CURP del alumno o escaneando el código QR.
          </p>
        </header>

        {/* Caja de Búsqueda */}
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
                        ? 'Ej. CERT-2024-001'
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
              <div className="relative w-full max-w-sm aspect-square bg-black rounded-xl overflow-hidden mb-4 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-8 border-2 border-dashed border-dorado rounded-xl pointer-events-none animate-pulse" />
              </div>

              {errorCamara && (
                <p
                  role="alert"
                  className="text-sm text-red-600 text-center mb-2 font-medium"
                >
                  {errorCamara}
                </p>
              )}

              <p className="text-xs text-slate-500 text-center flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-400" aria-hidden="true" />
                Apunta la cámara del dispositivo directamente al código QR del
                documento.
              </p>
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

        {/* ===================== RESULTADOS ===================== */}
        {datosRespuesta && (
          <section aria-labelledby="resultado-titulo" className="space-y-6">
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
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {certificadosList.length}{' '}
                    {certificadosList.length === 1
                      ? 'constancia'
                      : 'constancias'}
                  </span>
                </div>
              </div>
            )}

            {esBajaInstitucional && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl">
                <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-1">
                  <ShieldAlert
                    className="w-4 h-4 text-red-600 shrink-0"
                    aria-hidden="true"
                  />
                  REGISTROS ACADÉMICOS INHABILITADOS
                </div>
                <p className="text-xs text-red-700 leading-relaxed">
                  Las certificaciones mostradas a continuación no cuentan con
                  validez oficial activa debido a que el titular ha causado baja
                  del sistema institucional.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {certificadosList.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
                  No se encontraron cursos o certificados asociados a este
                  registro.
                </div>
              ) : (
                certificadosList.map((cert) => {
                  const tieneVig = Boolean(cert.tiene_vigencia)
                  const fechaExp = cert.fecha_vigencia
                  const esExpirado = tieneVig && fechaExp && fechaExp < fechaHoy
                  const esValido =
                    cert.valido !== false && !esExpirado && !esBajaInstitucional

                  return (
                    <article
                      key={cert.id || cert.folio || cert.token_publico}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md"
                    >
                      <div
                        className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white ${
                          esValido ? 'bg-[#1b3a6b]' : 'bg-red-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {esValido ? (
                            <CheckCircle2
                              className="w-5 h-5 text-dorado shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <XCircle
                              className="w-5 h-5 text-red-200 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <div>
                            <h3 className="text-sm font-bold tracking-wide">
                              {esValido
                                ? 'Documento Oficial Acreditado'
                                : 'Documento Sin Validez Vigente'}
                            </h3>
                            <p className="text-[11px] font-mono opacity-80">
                              Folio: {cert.folio_manual || cert.folio}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`self-start sm:self-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            !tieneVig
                              ? 'bg-blue-100 text-[#1b3a6b]'
                              : esExpirado || !esValido
                                ? 'bg-red-200 text-red-900'
                                : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {!tieneVig
                            ? 'Permanente'
                            : esExpirado
                              ? 'Expirado'
                              : 'Vigente'}
                        </span>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Programa Académico
                          </span>
                          <p className="text-base font-bold text-[#1b3a6b] flex items-center gap-2">
                            <Award
                              className="w-4 h-4 text-dorado shrink-0"
                              aria-hidden="true"
                            />
                            {cert.curso_nombre}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-400 block mb-0.5">
                              Evaluador / Emisor:
                            </span>
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <UserCheck
                                className="w-3.5 h-3.5 text-slate-400"
                                aria-hidden="true"
                              />
                              <span>{cert.instructor}</span>
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-400 block mb-0.5">
                              Duración Curricular:
                            </span>
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <Clock
                                className="w-3.5 h-3.5 text-slate-400"
                                aria-hidden="true"
                              />
                              <span>{cert.duracion_horas} horas</span>
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-400 block mb-0.5">
                              Fecha de Emisión:
                            </span>
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <Calendar
                                className="w-3.5 h-3.5 text-slate-400"
                                aria-hidden="true"
                              />
                              <span>{formatearFecha(cert.fecha_emision)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-xs">
                            {tieneVig ? (
                              esExpirado ? (
                                <span className="text-red-700 font-medium">
                                  Caducó el:{' '}
                                  <strong>{formatearFecha(fechaExp)}</strong>
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-medium flex items-center gap-1">
                                  <ShieldCheck
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  Vigente hasta el:{' '}
                                  <strong>{formatearFecha(fechaExp)}</strong>
                                </span>
                              )
                            ) : (
                              <span className="text-slate-500 font-medium">
                                Vigencia:{' '}
                                <strong>Permanente (Sin expiración)</strong>
                              </span>
                            )}
                          </div>

                          {cert.token_publico && (
                            <a
                              href={`/validar/${cert.token_publico}`}
                              target="_blank"
                              rel="noreferrer"
                              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition py-1 self-end sm:self-auto"
                            >
                              <ExternalLink
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Constancia Oficial Digital</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
