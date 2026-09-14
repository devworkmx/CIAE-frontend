import {
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
  Building2,
  Infinity,
  AlertTriangle,
} from 'lucide-react'

function formatearFecha(fechaStr) {
  if (!fechaStr) return ''
  const partes = String(fechaStr).split('-')
  if (partes.length !== 3) return fechaStr
  const [anio, mes, dia] = partes
  return `${dia}/${mes}/${anio}`
}

export default function TarjetaCertificado({
  cert,
  alumnoActivo = true,
  fechaHoy = new Date().toISOString().split('T')[0],
  mostrarEnlaceDirecto = false,
}) {
  const tieneVig = Boolean(cert.tiene_vigencia)
  const fechaExp = cert.fecha_vigencia
  const esExpirado = tieneVig && fechaExp && fechaExp < fechaHoy
  const alumnoDadoDeBaja =
    cert.alumno_activo === false || alumnoActivo === false
  const esRevocado = cert.estatus && cert.estatus !== 'vigente'
  const esValido =
    cert.valido !== false && !esExpirado && !alumnoDadoDeBaja && !esRevocado
  const folioMostrar = cert.folio_manual || cert.folio || 'S/N'

  // Determinación de paleta visual y estado
  let cabeceraBg = 'bg-azulmarino'
  let IconoEstado = CheckCircle2
  let tituloEstado = 'Certificado Oficial Auténtico'
  let subtituloEstado = 'Registro validado en padrón institucional'

  if (alumnoDadoDeBaja) {
    cabeceraBg = 'bg-gradient-to-r from-red-900 to-rose-950'
    IconoEstado = ShieldAlert
    tituloEstado = 'Documento Inhabilitado'
    subtituloEstado = 'Titular con estatus de baja en la institución'
  } else if (esRevocado) {
    cabeceraBg = 'bg-gradient-to-r from-red-800 to-rose-900'
    IconoEstado = XCircle
    tituloEstado = 'Certificado Revocado'
    subtituloEstado = 'La emisión de esta constancia ha sido cancelada'
  } else if (esExpirado) {
    cabeceraBg = 'bg-gradient-to-r from-amber-600 to-yellow-700'
    IconoEstado = AlertTriangle
    tituloEstado = 'Certificado Vencido'
    subtituloEstado = 'El periodo oficial de acreditación ha concluido'
  }

  return (
    <article className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Cabecera dinámica con banner de estado */}
      <div
        className={`p-6 sm:p-7 text-white text-center relative ${cabeceraBg}`}
      >
        <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-3 ring-1 ring-white/20">
          <IconoEstado
            className="w-10 h-10 text-dorado drop-shadow-sm"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          {tituloEstado}
        </h3>
        <p className="text-xs tracking-wider text-slate-100/90 mt-1 uppercase font-medium">
          {subtituloEstado}
        </p>

        <div className="mt-4 inline-block bg-black/25 backdrop-blur-sm border border-white/20 px-3.5 py-1 rounded-full text-xs font-mono tracking-wider">
          FOLIO: <span className="font-bold text-dorado">{folioMostrar}</span>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-5">
        {/* Institución Emisora */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-azulmarino" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase block">
              Institución Emisora
            </span>
            <p className="text-base font-black text-slate-900 leading-tight">
              {cert.institucion || 'Institución Oficial'}
            </p>
          </div>
        </div>

        {/* Alumno Titular */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Acreditado a
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-dorado shrink-0" />
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                {cert.alumno_nombre}
              </span>
            </div>
            {alumnoDadoDeBaja && (
              <span className="text-[10px] font-extrabold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200 shrink-0">
                BAJA INSTITUCIONAL
              </span>
            )}
          </div>
        </div>

        {/* Programa Académico */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Programa Académico / Curso
          </span>
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-dorado shrink-0" />
            <span className="text-base font-bold text-azulmarino">
              {cert.curso_nombre}
            </span>
          </div>
        </div>

        {/* Instructor */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Instructor / Evaluador
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{cert.instructor}</span>
          </div>
        </div>

        {/* Duración y Emisión */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Carga Curricular
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{cert.duracion_horas} horas</span>
            </div>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Fecha de Emisión
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatearFecha(cert.fecha_emision)}</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Visual de Vigencia con Colores Semánticos */}
        <div>
          {alumnoDadoDeBaja ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                INHABILITADO: El titular no se encuentra activo en el padrón
              </span>
            </div>
          ) : tieneVig ? (
            esValido ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>VIGENTE HASTA EL {formatearFecha(fechaExp)}</span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  EXPIRÓ EL {formatearFecha(fechaExp)} (Requiere renovación)
                </span>
              </div>
            )
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-azulmarino p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs">
              <Infinity className="w-4 h-4 text-dorado shrink-0" />
              <span>ACREDITACIÓN PERMANENTE (Sin fecha de caducidad)</span>
            </div>
          )}
        </div>

        {/* Enlace Directo (Opcional, útil para la búsqueda general) */}
        {mostrarEnlaceDirecto && cert.token_publico && (
          <div className="pt-1 text-center">
            <a
              href={`/validar/${cert.token_publico}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-azulmarino hover:text-dorado transition-colors py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir certificado con su código QR</span>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
