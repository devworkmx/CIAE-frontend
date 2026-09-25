import { ShieldAlert, ShieldCheck, Clock } from 'lucide-react'

const ESTILOS_ESTADO = {
  activo: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  congelado: 'bg-red-50 border-red-200 text-red-700',
  suspendido: 'bg-amber-50 border-amber-200 text-amber-700',
}

const ETIQUETAS_ESTADO = {
  activo: 'Activo',
  congelado: 'Licencia vencida',
  suspendido: 'Suspendido',
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return null
  const [y, m, d] = fechaIso.split('-')
  if (!y || !m || !d) return fechaIso
  return `${d}/${m}/${y}`
}

// Chip compacto de "Plan X · Activo/Vencido" + vigencia, para mostrar
// siempre en el encabezado del panel admin (el usuario debe poder ver en
// todo momento qué plan tiene y hasta cuándo, sin tener que preguntar).
export function ChipPlanSuscripcion({ tenant }) {
  if (!tenant) return null
  const estado = tenant.estado_acceso || 'activo'
  const dias = tenant.dias_restantes
  const porVencerPronto =
    estado === 'activo' && typeof dias === 'number' && dias <= 7

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
          ESTILOS_ESTADO[estado] || ESTILOS_ESTADO.activo
        }`}
      >
        {estado === 'activo' ? (
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        Plan {tenant.plan ? tenant.plan : 'sin asignar'} ·{' '}
        {ETIQUETAS_ESTADO[estado] || estado}
      </span>

      {tenant.fecha_vencimiento && (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            porVencerPronto
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          {estado === 'activo'
            ? `Vigente hasta ${formatearFecha(tenant.fecha_vencimiento)}${
                porVencerPronto ? ` (${dias} día${dias === 1 ? '' : 's'})` : ''
              }`
            : `Venció el ${formatearFecha(tenant.fecha_vencimiento)}`}
        </span>
      )}
    </div>
  )
}

// Banner de ancho completo que se muestra solo cuando el tenant está
// congelado (venció) o suspendido (freno manual del superadmin). Explica
// qué puede y qué no puede hacer el usuario, en línea con el flujo donde
// todo pago/renovación pasa por el administrador de la plataforma.
export default function BannerLicenciaCongelada({ tenant }) {
  if (!tenant || (tenant.estado_acceso || 'activo') === 'activo') return null

  const esSuspendido = tenant.estado_acceso === 'suspendido'

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-800"
    >
      <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="font-black text-sm">
          {esSuspendido
            ? 'Tu institución fue suspendida'
            : 'Tu licencia venció'}
        </p>
        <p className="text-sm mt-1 leading-relaxed">
          Puedes consultar todo tu historial de certificados, alumnos y cursos
          con normalidad, pero no podrás crear, editar ni emitir nada hasta que
          se renueve. Contacta al administrador de la plataforma para renovar tu
          licencia
          {tenant.plan ? ` (plan ${tenant.plan})` : ''}.
        </p>
      </div>
    </div>
  )
}
