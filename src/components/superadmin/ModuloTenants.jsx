import { useState, useEffect } from 'react'
import {
  Building2,
  Plus,
  X,
  KeyRound,
  UserPlus,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  ShieldOff,
  ShieldCheck,
  RefreshCcw,
} from 'lucide-react'
import {
  crearTenant,
  actualizarSuscripcion,
  renovarSuscripcion,
  obtenerTenant,
  obtenerPlanesSuscripcion,
  crearUsuarioSuperadmin,
  resetearPasswordSuperadmin,
  cambiarEstadoUsuarioSuperadmin,
} from '../../services/api'

// Estado de ACCESO efectivo (lo que ya calculó el backend combinando
// estatus_suscripcion + fecha_vencimiento). Es lo que le importa al
// superadmin de un vistazo: ¿este cliente puede trabajar hoy o no?
const ESTILOS_ESTADO_ACCESO = {
  activo: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  congelado: 'bg-red-50 border-red-200 text-red-700',
  suspendido: 'bg-amber-50 border-amber-200 text-amber-700',
}

const ETIQUETAS_ESTADO_ACCESO = {
  activo: 'Activo',
  congelado: 'Vencido',
  suspendido: 'Suspendido',
}

function Badge({ tenant }) {
  const estado = tenant?.estado_acceso || 'activo'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
        ESTILOS_ESTADO_ACCESO[estado] ||
        'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      {ETIQUETAS_ESTADO_ACCESO[estado] || estado}
    </span>
  )
}

function textoVigencia(tenant) {
  if (!tenant?.fecha_vencimiento) return null
  const dias = tenant.dias_restantes
  if (typeof dias !== 'number') return `vence ${tenant.fecha_vencimiento}`
  if (dias < 0) return `venció hace ${Math.abs(dias)} día(s)`
  if (dias === 0) return 'vence hoy'
  return `vence en ${dias} día(s)`
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition'

// Calcula la fecha (YYYY-MM-DD) resultante de sumar N meses a hoy. Se usa
// tanto al dar de alta una institución como al renovarla, para que el
// superadmin nunca tenga que calcular fechas de vencimiento a mano.
function sumarMesesAHoy(meses) {
  if (!meses) return ''
  const fecha = new Date()
  fecha.setMonth(fecha.getMonth() + Number(meses))
  return fecha.toISOString().slice(0, 10)
}

// ===================== MODAL: NUEVA INSTITUCIÓN =====================
function ModalNuevoTenant({ onCerrar, onCreado, onAlerta }) {
  const [form, setForm] = useState({
    nombre_institucion: '',
    slug: '',
    plan: '',
    fecha_vencimiento: sumarMesesAHoy(1),
    username: '',
    email: '',
    nombre_completo: '',
    password: '',
  })
  const [duracionMeses, setDuracionMeses] = useState('1')
  const [catalogoPlanes, setCatalogoPlanes] = useState({
    planes: [],
    duraciones_meses: [1, 3, 6, 12],
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    obtenerPlanesSuscripcion()
      .then(setCatalogoPlanes)
      .catch(() => {
        // Si falla (ej. sin red), el formulario sigue funcionando con
        // texto libre y duraciones por defecto; no es bloqueante.
      })
  }, [])

  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  function cambiarDuracion(e) {
    const meses = e.target.value
    setDuracionMeses(meses)
    setForm((f) => ({ ...f, fecha_vencimiento: sumarMesesAHoy(meses) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    try {
      const payload = { ...form }
      if (!payload.slug.trim()) delete payload.slug
      if (!payload.plan.trim()) delete payload.plan
      if (!payload.fecha_vencimiento) delete payload.fecha_vencimiento
      const tenant = await crearTenant(payload)
      onAlerta(
        `Institución "${tenant.nombre}" creada. Envía a "${form.username}" su usuario y esta contraseña por WhatsApp.`,
        'exito'
      )
      onCreado(tenant)
    } catch (err) {
      onAlerta(err.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">
            Nueva institución
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-500 -mt-1">
            Crea la institución y su primer usuario administrador en un solo
            paso. Después le compartes el usuario y la contraseña por el canal
            que uses (WhatsApp, correo, etc).
          </p>

          <Campo label="Nombre de la institución *">
            <input
              required
              value={form.nombre_institucion}
              onChange={cambiar('nombre_institucion')}
              placeholder="Academia Ejemplo"
              className={inputCls}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Slug (opcional)">
              <input
                value={form.slug}
                onChange={cambiar('slug')}
                placeholder="se genera solo"
                className={inputCls}
              />
            </Campo>
            <Campo label="Plan (opcional)">
              <input
                list="planes-sugeridos-nuevo"
                value={form.plan}
                onChange={cambiar('plan')}
                placeholder="básico / pro / premium"
                className={inputCls}
              />
              <datalist id="planes-sugeridos-nuevo">
                {catalogoPlanes.planes.map((p) => (
                  <option key={p.id} value={p.nombre} />
                ))}
              </datalist>
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Duración pagada">
              <select
                value={duracionMeses}
                onChange={cambiarDuracion}
                className={inputCls}
              >
                <option value="">Sin vencimiento (manual)</option>
                {catalogoPlanes.duraciones_meses.map((m) => (
                  <option key={m} value={m}>
                    {m} {m === 1 ? 'mes' : 'meses'}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Vence el">
              <input
                type="date"
                value={form.fecha_vencimiento}
                onChange={cambiar('fecha_vencimiento')}
                className={inputCls}
              />
            </Campo>
          </div>
          <p className="text-[11px] text-slate-400 -mt-2">
            Se calcula sola según la duración pagada; puedes ajustarla a mano si
            el cliente pagó una fecha distinta.
          </p>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Usuario administrador
            </p>
            <div className="space-y-3">
              <Campo label="Nombre completo *">
                <input
                  required
                  value={form.nombre_completo}
                  onChange={cambiar('nombre_completo')}
                  className={inputCls}
                />
              </Campo>
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Username *">
                  <input
                    required
                    value={form.username}
                    onChange={cambiar('username')}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Email *">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={cambiar('email')}
                    className={inputCls}
                  />
                </Campo>
              </div>
              <Campo label="Contraseña *">
                <input
                  required
                  type="text"
                  minLength={10}
                  value={form.password}
                  onChange={cambiar('password')}
                  placeholder="Mín. 10 caracteres, mayúscula, minúscula y número"
                  className={inputCls}
                />
              </Campo>
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 bg-[#1b3a6b] text-white font-bold text-sm rounded-xl py-3 hover:brightness-110 transition disabled:opacity-50"
          >
            {enviando && <Loader2 className="w-4 h-4 animate-spin" />}
            Crear institución y administrador
          </button>
        </form>
      </div>
    </div>
  )
}

// ===================== PANEL DE DETALLE =====================
function PanelDetalle({ tenantId, onVolver, onAlerta, onCambio }) {
  const [tenant, setTenant] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [formSuscripcion, setFormSuscripcion] = useState(null)
  const [guardandoSuscripcion, setGuardandoSuscripcion] = useState(false)
  const [modalReset, setModalReset] = useState(null) // usuario o null
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [modalNuevoUsuario, setModalNuevoUsuario] = useState(false)
  const [modalRenovar, setModalRenovar] = useState(false)

  async function recargar() {
    setCargando(true)
    try {
      const data = await obtenerTenant(tenantId)
      setTenant(data)
      setFormSuscripcion({
        estatus_suscripcion: data.estatus_suscripcion,
        plan: data.plan || '',
        fecha_vencimiento: data.fecha_vencimiento || '',
        notas_pago: data.notas_pago || '',
        puede_emitir_certificados: data.puede_emitir_certificados,
      })
    } catch (err) {
      onAlerta(err.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    recargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function guardarSuscripcion(e) {
    e.preventDefault()
    setGuardandoSuscripcion(true)
    try {
      const payload = {
        ...formSuscripcion,
        fecha_vencimiento: formSuscripcion.fecha_vencimiento || null,
        plan: formSuscripcion.plan || null,
        notas_pago: formSuscripcion.notas_pago || null,
      }
      await actualizarSuscripcion(tenantId, payload)
      onAlerta('Suscripción actualizada.', 'exito')
      recargar()
      onCambio()
    } catch (err) {
      onAlerta(err.message, 'error')
    } finally {
      setGuardandoSuscripcion(false)
    }
  }

  async function confirmarReset(e) {
    e.preventDefault()
    try {
      await resetearPasswordSuperadmin(modalReset.id, nuevaPassword)
      onAlerta(
        `Contraseña de "${modalReset.username}" actualizada. Compártesela ya.`,
        'exito'
      )
      setModalReset(null)
      setNuevaPassword('')
    } catch (err) {
      onAlerta(err.message, 'error')
    }
  }

  async function toggleActivo(usuario) {
    try {
      await cambiarEstadoUsuarioSuperadmin(usuario.id, !usuario.activo)
      onAlerta(
        `Usuario "${usuario.username}" ${!usuario.activo ? 'activado' : 'desactivado'}.`,
        'exito'
      )
      recargar()
    } catch (err) {
      onAlerta(err.message, 'error')
    }
  }

  if (cargando || !tenant || !formSuscripcion) {
    return (
      <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm font-semibold">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin text-[#1b3a6b]" />
        Cargando institución...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onVolver}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al listado
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {tenant.nombre}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              slug: {tenant.slug}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge tenant={tenant} />
            <button
              type="button"
              onClick={() => setModalRenovar(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl px-3.5 py-2 hover:brightness-110 transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Renovar
            </button>
          </div>
        </div>

        {tenant.plan || tenant.fecha_vencimiento ? (
          <p className="text-xs text-slate-500 mb-6">
            {tenant.plan ? `Plan ${tenant.plan}` : 'Sin plan asignado'}
            {tenant.fecha_vencimiento
              ? ` · ${textoVigencia(tenant)} (${tenant.fecha_vencimiento})`
              : ' · sin fecha de vencimiento registrada'}
          </p>
        ) : (
          <div className="mb-6" />
        )}

        <form
          onSubmit={guardarSuscripcion}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Campo label="Estatus de suscripción">
            <select
              value={formSuscripcion.estatus_suscripcion}
              onChange={(e) =>
                setFormSuscripcion((f) => ({
                  ...f,
                  estatus_suscripcion: e.target.value,
                }))
              }
              className={inputCls}
            >
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </Campo>

          <Campo label="Plan">
            <input
              value={formSuscripcion.plan}
              onChange={(e) =>
                setFormSuscripcion((f) => ({ ...f, plan: e.target.value }))
              }
              placeholder="básico / pro"
              className={inputCls}
            />
          </Campo>

          <Campo label="Vence el">
            <input
              type="date"
              value={formSuscripcion.fecha_vencimiento || ''}
              onChange={(e) =>
                setFormSuscripcion((f) => ({
                  ...f,
                  fecha_vencimiento: e.target.value,
                }))
              }
              className={inputCls}
            />
          </Campo>

          <div className="flex items-end">
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={formSuscripcion.puede_emitir_certificados}
                onChange={(e) =>
                  setFormSuscripcion((f) => ({
                    ...f,
                    puede_emitir_certificados: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded accent-[#1b3a6b]"
              />
              Puede emitir certificados
            </label>
          </div>

          <div className="sm:col-span-2">
            <Campo label="Notas de pago (transferencia, folio, fecha...)">
              <textarea
                value={formSuscripcion.notas_pago}
                onChange={(e) =>
                  setFormSuscripcion((f) => ({
                    ...f,
                    notas_pago: e.target.value,
                  }))
                }
                rows={2}
                className={inputCls}
                placeholder="Ej. Transferencia recibida 25/09/2026, comprobante enviado por WhatsApp"
              />
            </Campo>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={guardandoSuscripcion}
              className="inline-flex items-center gap-2 bg-[#1b3a6b] text-white font-bold text-sm rounded-xl px-5 py-2.5 hover:brightness-110 transition disabled:opacity-50"
            >
              {guardandoSuscripcion && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Guardar suscripción
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Usuarios ({tenant.usuarios.length})
          </h3>
          <button
            type="button"
            onClick={() => setModalNuevoUsuario(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b3a6b] hover:underline"
          >
            <UserPlus className="w-4 h-4" /> Agregar usuario
          </button>
        </div>

        <div className="space-y-2">
          {tenant.usuarios.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {u.nombre_completo}{' '}
                  <span className="text-slate-400 font-normal">
                    @{u.username}
                  </span>
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {u.email} · {u.rol}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {u.activo ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600">
                    <XCircle className="w-3.5 h-3.5" /> Inactivo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setModalReset(u)}
                  title="Resetear contraseña"
                  className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActivo(u)}
                  title={u.activo ? 'Desactivar' : 'Activar'}
                  className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                >
                  {u.activo ? (
                    <ShieldOff className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">
                Resetear contraseña
              </h3>
              <button
                type="button"
                onClick={() => setModalReset(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Nueva contraseña para{' '}
              <span className="font-bold text-slate-700">
                {modalReset.username}
              </span>
              . Cópiala y envíasela de inmediato; no queda guardada en ningún
              otro lado.
            </p>
            <form onSubmit={confirmarReset} className="space-y-3">
              <input
                required
                minLength={10}
                type="text"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Mín. 10 caracteres, mayúscula, minúscula y número"
                className={inputCls}
              />
              <button
                type="submit"
                className="w-full min-h-[44px] bg-[#1b3a6b] text-white font-bold text-sm rounded-xl hover:brightness-110 transition"
              >
                Guardar nueva contraseña
              </button>
            </form>
          </div>
        </div>
      )}

      {modalNuevoUsuario && (
        <ModalNuevoUsuario
          tenantId={tenantId}
          onCerrar={() => setModalNuevoUsuario(false)}
          onCreado={() => {
            setModalNuevoUsuario(false)
            recargar()
          }}
          onAlerta={onAlerta}
        />
      )}

      {modalRenovar && (
        <ModalRenovar
          tenant={tenant}
          onCerrar={() => setModalRenovar(false)}
          onRenovado={() => {
            setModalRenovar(false)
            recargar()
            onCambio()
          }}
          onAlerta={onAlerta}
        />
      )}
    </div>
  )
}

// ===================== MODAL: RENOVAR SUSCRIPCIÓN =====================
function ModalRenovar({ tenant, onCerrar, onRenovado, onAlerta }) {
  const [meses, setMeses] = useState(1)
  const [plan, setPlan] = useState(tenant.plan || '')
  const [notaPago, setNotaPago] = useState('')
  const [catalogoPlanes, setCatalogoPlanes] = useState({
    planes: [],
    duraciones_meses: [1, 3, 6, 12],
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    obtenerPlanesSuscripcion()
      .then(setCatalogoPlanes)
      .catch(() => {})
  }, [])

  // Vista previa de la nueva fecha, para que quede claro ANTES de confirmar
  // (respeta el tiempo que le quedaba, igual que hace el backend).
  const hoy = new Date()
  const base =
    tenant.fecha_vencimiento &&
    new Date(`${tenant.fecha_vencimiento}T00:00:00`) > hoy
      ? new Date(`${tenant.fecha_vencimiento}T00:00:00`)
      : hoy
  const previaFecha = new Date(base)
  previaFecha.setMonth(previaFecha.getMonth() + Number(meses || 0))
  const previaFechaTexto =
    Number(meses) > 0 ? previaFecha.toISOString().slice(0, 10) : null

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    try {
      const payload = { meses: Number(meses) }
      if (plan.trim()) payload.plan = plan.trim()
      if (notaPago.trim()) payload.nota_pago = notaPago.trim()
      const actualizado = await renovarSuscripcion(tenant.id, payload)
      onAlerta(
        `Suscripción renovada. Nueva vigencia: ${actualizado.fecha_vencimiento}.`,
        'exito'
      )
      onRenovado()
    } catch (err) {
      onAlerta(err.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">
            Renovar suscripción
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Indica cuántos meses pagó{' '}
          <span className="font-bold text-slate-700">{tenant.nombre}</span>. Se
          suman a la vigencia que le quedaba (si tenía) y se reactiva su acceso
          de inmediato.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Campo label="Meses pagados">
            <select
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
              className={inputCls}
            >
              {catalogoPlanes.duraciones_meses.map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? 'mes' : 'meses'}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Plan (opcional, actualiza el actual)">
            <input
              list="planes-sugeridos-renovar"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder={tenant.plan || 'básico / pro / premium'}
              className={inputCls}
            />
            <datalist id="planes-sugeridos-renovar">
              {catalogoPlanes.planes.map((p) => (
                <option key={p.id} value={p.nombre} />
              ))}
            </datalist>
          </Campo>
          <Campo label="Nota de pago (opcional)">
            <input
              value={notaPago}
              onChange={(e) => setNotaPago(e.target.value)}
              placeholder="Transferencia recibida, folio, etc."
              className={inputCls}
            />
          </Campo>

          {previaFechaTexto && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              Nueva vigencia: {previaFechaTexto}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:brightness-110 transition disabled:opacity-50"
          >
            {enviando && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar renovación
          </button>
        </form>
      </div>
    </div>
  )
}

function ModalNuevoUsuario({ tenantId, onCerrar, onCreado, onAlerta }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    nombre_completo: '',
    rol: 'admin',
    password: '',
  })
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    try {
      await crearUsuarioSuperadmin({ ...form, tenant_id: tenantId })
      onAlerta(`Usuario "${form.username}" creado.`, 'exito')
      onCreado()
    } catch (err) {
      onAlerta(err.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">Nuevo usuario</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={form.nombre_completo}
            onChange={cambiar('nombre_completo')}
            placeholder="Nombre completo"
            className={inputCls}
          />
          <input
            required
            value={form.username}
            onChange={cambiar('username')}
            placeholder="Username"
            className={inputCls}
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={cambiar('email')}
            placeholder="Email"
            className={inputCls}
          />
          <select
            value={form.rol}
            onChange={cambiar('rol')}
            className={inputCls}
          >
            <option value="admin">Admin</option>
            <option value="capturista">Capturista</option>
          </select>
          <input
            required
            minLength={10}
            type="text"
            value={form.password}
            onChange={cambiar('password')}
            placeholder="Contraseña inicial"
            className={inputCls}
          />
          <button
            type="submit"
            disabled={enviando}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#1b3a6b] text-white font-bold text-sm rounded-xl hover:brightness-110 transition disabled:opacity-50"
          >
            {enviando && <Loader2 className="w-4 h-4 animate-spin" />}
            Crear usuario
          </button>
        </form>
      </div>
    </div>
  )
}

// ===================== LISTADO PRINCIPAL =====================
export default function ModuloTenants({ tenants, onRecargar, onAlerta }) {
  const [modalNuevo, setModalNuevo] = useState(false)
  const [tenantSeleccionado, setTenantSeleccionado] = useState(null)

  if (tenantSeleccionado) {
    return (
      <PanelDetalle
        tenantId={tenantSeleccionado}
        onVolver={() => setTenantSeleccionado(null)}
        onAlerta={onAlerta}
        onCambio={onRecargar}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Instituciones ({tenants.length})
        </h2>
        <button
          type="button"
          onClick={() => setModalNuevo(true)}
          className="inline-flex items-center gap-2 bg-[#1b3a6b] text-white font-bold text-xs rounded-xl px-4 py-2.5 hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Nueva institución
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100">
        {tenants.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-500">
            Aún no hay instituciones registradas.
          </p>
        )}
        {tenants.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTenantSeleccionado(t.id)}
            className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#1b3a6b]/10 flex items-center justify-center text-[#1b3a6b] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {t.nombre}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {t.total_usuarios} usuario(s)
                  {t.plan ? ` · plan ${t.plan}` : ''}
                  {t.fecha_vencimiento ? ` · ${textoVigencia(t)}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge tenant={t} />
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        ))}
      </div>

      {modalNuevo && (
        <ModalNuevoTenant
          onCerrar={() => setModalNuevo(false)}
          onAlerta={onAlerta}
          onCreado={() => {
            setModalNuevo(false)
            onRecargar()
          }}
        />
      )}
    </div>
  )
}
