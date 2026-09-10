import { useState, useMemo, useEffect } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'
import Paginacion from './Paginacion'
import {
  Plus,
  Edit2,
  X,
  Search,
  RotateCcw,
  UserCheck,
  UserX,
  GraduationCap,
  BookOpen,
  Mail,
  Fingerprint,
} from 'lucide-react'

export default function ModuloAlumnos({
  alumnos,
  cursos,
  certificados,
  onRecargar,
  onAlerta,
}) {
  const registrosPorPagina = 5
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [paginaActual, setPaginaActual] = useState(1)

  const [editandoId, setEditandoId] = useState(null)
  const [modalCursosAlumno, setModalCursosAlumno] = useState(null)

  const [confirmacionBaja, setConfirmacionBaja] = useState({
    abierto: false,
    alumno: null,
    nuevoEstado: false,
    password: '',
    error: '',
    cargando: false,
  })

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    curp: '',
    email: '',
    telefono: '',
  })

  async function guardarAlumno(e) {
    e.preventDefault()
    const body = {
      ...form,
      curp: form.curp.trim().toUpperCase(),
      email: form.email?.trim() === '' ? null : form.email?.trim(),
      telefono: form.telefono?.trim() === '' ? null : form.telefono?.trim(),
    }

    const endpoint = editandoId
      ? `${API_URL}/api/alumnos/${editandoId}`
      : `${API_URL}/api/alumnos`
    const method = editandoId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })
      if (res.ok) {
        onAlerta(
          editandoId
            ? 'Alumno actualizado con éxito'
            : 'Alumno registrado con éxito',
          'exito'
        )
        cancelarEdicion()
        onRecargar()
      } else {
        const err = await res.json()
        onAlerta(err.detail || 'Error al procesar el alumno', 'error')
      }
    } catch {
      onAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicion(a) {
    setEditandoId(a.id)
    setForm({
      nombre: a.nombre || '',
      apellidos: a.apellidos || '',
      curp: a.curp || '',
      email: a.email || '',
      telefono: a.telefono || '',
    })
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({ nombre: '', apellidos: '', curp: '', email: '', telefono: '' })
  }

  async function ejecutarCambioEstado(e) {
    e.preventDefault()
    const { alumno, nuevoEstado, password } = confirmacionBaja
    if (!password.trim()) {
      setConfirmacionBaja((prev) => ({
        ...prev,
        error: 'Ingresa tu contraseña de administrador.',
      }))
      return
    }

    setConfirmacionBaja((prev) => ({ ...prev, cargando: true, error: '' }))

    try {
      const res = await fetch(`${API_URL}/api/alumnos/${alumno.id}/estado`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ activo: nuevoEstado, admin_password: password }),
      })
      if (res.ok) {
        onAlerta(
          `Alumno ${nuevoEstado ? 'reactivado' : 'dado de baja'} correctamente.`,
          'exito'
        )
        setConfirmacionBaja({
          abierto: false,
          alumno: null,
          nuevoEstado: false,
          password: '',
          error: '',
          cargando: false,
        })
        onRecargar()
      } else {
        const err = await res.json()
        setConfirmacionBaja((prev) => ({
          ...prev,
          cargando: false,
          error: err.detail || 'Error al actualizar.',
        }))
      }
    } catch {
      setConfirmacionBaja((prev) => ({
        ...prev,
        cargando: false,
        error: 'Error de conexión.',
      }))
    }
  }

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) => {
      const q = busqueda.toLowerCase().trim()
      const matchQuery =
        `${a.nombre || ''} ${a.apellidos || ''}`.toLowerCase().includes(q) ||
        (a.curp && a.curp.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))

      const activo = a.activo !== false
      const matchEstado =
        filtroEstado === 'todos'
          ? true
          : filtroEstado === 'activos'
            ? activo
            : !activo

      return matchQuery && matchEstado
    })
  }, [alumnos, busqueda, filtroEstado])

  const totalPaginas =
    Math.ceil(alumnosFiltrados.length / registrosPorPagina) || 1
  const alumnosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * registrosPorPagina
    return alumnosFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [alumnosFiltrados, paginaActual])

  useEffect(() => setPaginaActual(1), [busqueda, filtroEstado])

  const cursosDelAlumno = useMemo(() => {
    if (!modalCursosAlumno) return []
    return certificados.filter((c) => c.alumno_id === modalCursosAlumno.id)
  }, [modalCursosAlumno, certificados])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Formulario */}
      <section
        aria-labelledby="form-alumno-title"
        className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="form-alumno-title"
            className="text-base font-bold text-[#1b3a6b] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />{' '}
            {editandoId ? 'Modificar Alumno' : 'Alta de Alumno'}
          </h2>
          {editandoId && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
              Modo Edición
            </span>
          )}
        </div>

        <form onSubmit={guardarAlumno} className="space-y-4">
          <div>
            <label
              htmlFor="alumno_nombre"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Nombre(s) *
            </label>
            <input
              id="alumno_nombre"
              type="text"
              required
              placeholder="Ej. Juan Carlos"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="alumno_apellidos"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Apellidos *
            </label>
            <input
              id="alumno_apellidos"
              type="text"
              required
              placeholder="Ej. Pérez González"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="alumno_curp"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              CURP (18 caracteres) *
            </label>
            <input
              id="alumno_curp"
              type="text"
              required
              maxLength={18}
              placeholder="PEGC900101HDFRNR09"
              value={form.curp}
              onChange={(e) =>
                setForm({ ...form, curp: e.target.value.toUpperCase() })
              }
              className="w-full border rounded-lg p-2.5 text-sm uppercase font-mono outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="alumno_email"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="alumno_email"
              type="email"
              placeholder="ejemplo.alumno@institucion.mx"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="alumno_tel"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              id="alumno_tel"
              type="tel"
              placeholder="+52 55 1234 5678"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 min-h-[44px] bg-[#1b3a6b] text-white py-2.5 px-4 rounded-lg font-bold text-sm hover:brightness-110 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
            >
              {editandoId ? 'Guardar Cambios' : 'Registrar Alumno'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="min-h-[44px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Listado */}
      <section
        aria-labelledby="list-alumno-title"
        className="lg:col-span-8 space-y-4"
      >
        <h2 id="list-alumno-title" className="sr-only">
          Padrón Institucional de Alumnos
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, CURP o correo..."
              aria-label="Buscar alumnos"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div
            className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg self-stretch sm:self-auto flex-wrap"
            role="group"
            aria-label="Filtro de estatus de alumnos"
          >
            {['todos', 'activos', 'desactivados'].map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setFiltroEstado(filtro)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-md capitalize transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                  filtroEstado === filtro
                    ? 'bg-[#1b3a6b] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {filtro}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setBusqueda('')
                setFiltroEstado('todos')
              }}
              aria-label="Limpiar filtros de alumnos"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-md transition"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Alumno & Contacto</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-slate-100">
            {alumnosPaginados.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No se encontraron alumnos con los criterios seleccionados.
              </div>
            ) : (
              alumnosPaginados.map((a) => {
                const countCursos = certificados.filter(
                  (c) => c.alumno_id === a.id
                ).length
                const activo = a.activo !== false

                return (
                  <div
                    key={a.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                      !activo
                        ? 'bg-slate-50/70 opacity-75'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">
                          {a.nombre} {a.apellidos}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            activo
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {activo ? 'ACTIVO' : 'DADO DE BAJA'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                        <Fingerprint
                          className="w-3.5 h-3.5 text-gray-400"
                          aria-hidden="true"
                        />{' '}
                        CURP: {a.curp}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        {a.email && (
                          <span className="flex items-center gap-1">
                            <Mail
                              className="w-3 h-3 text-gray-400"
                              aria-hidden="true"
                            />{' '}
                            {a.email}
                          </span>
                        )}
                        {a.telefono && <span>| Tel: {a.telefono}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setModalCursosAlumno(a)}
                        aria-label={`Ver certificados y cursos inscritos de ${a.nombre} ${a.apellidos}`}
                        className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        <span>Cursos ({countCursos})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => iniciarEdicion(a)}
                        aria-label={`Editar expediente de ${a.nombre} ${a.apellidos}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-[#1b3a6b] rounded-lg hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmacionBaja({
                            abierto: true,
                            alumno: a,
                            nuevoEstado: !activo,
                            password: '',
                            error: '',
                            cargando: false,
                          })
                        }
                        aria-label={
                          activo
                            ? `Dar de baja institucional a ${a.nombre} ${a.apellidos}`
                            : `Reactivar en el padrón a ${a.nombre} ${a.apellidos}`
                        }
                        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                          activo
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {activo ? (
                          <UserX className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <UserCheck className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalRegistros={alumnosFiltrados.length}
            registrosPorPagina={registrosPorPagina}
            onCambiarPagina={setPaginaActual}
            etiqueta="alumnos"
          />
        </div>
      </section>

      {/* Modal: Cursos del Alumno */}
      {modalCursosAlumno && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap
                  className="w-5 h-5 text-[#1b3a6b]"
                  aria-hidden="true"
                />
                <h3 className="font-bold text-[#1b3a6b] text-base">
                  Cursos y Certificados
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCursosAlumno(null)}
                aria-label="Cerrar ventana de cursos"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {modalCursosAlumno.nombre} {modalCursosAlumno.apellidos}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                CURP: {modalCursosAlumno.curp}
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {cursosDelAlumno.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  Sin certificados emitidos todavía.
                </p>
              ) : (
                cursosDelAlumno.map((cert) => {
                  const cursoAsoc = cursos.find((c) => c.id === cert.curso_id)
                  return (
                    <div
                      key={cert.id}
                      className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {cursoAsoc ? cursoAsoc.nombre : 'Curso'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          Folio: {cert.folio_manual}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold bg-white border px-2 py-0.5 rounded text-gray-600">
                        {cert.tiene_vigencia
                          ? `Vence: ${cert.fecha_vigencia}`
                          : 'Permanente'}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
            <button
              type="button"
              onClick={() => setModalCursosAlumno(null)}
              className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 text-gray-800 text-sm font-medium py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Confirmación con Contraseña */}
      {confirmacionBaja.abierto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-800 text-base">
                {confirmacionBaja.nuevoEstado
                  ? 'Reactivar Alumno'
                  : 'Confirmar Baja Institucional'}
              </h3>
              <button
                type="button"
                onClick={() =>
                  setConfirmacionBaja({
                    abierto: false,
                    alumno: null,
                    nuevoEstado: false,
                    password: '',
                    error: '',
                    cargando: false,
                  })
                }
                aria-label="Cerrar confirmación"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              ¿Autorizas{' '}
              {confirmacionBaja.nuevoEstado ? 'reactivar' : 'dar de baja'} al
              alumno{' '}
              <strong>
                {confirmacionBaja.alumno?.nombre}{' '}
                {confirmacionBaja.alumno?.apellidos}
              </strong>
              ?
            </p>
            <form onSubmit={ejecutarCambioEstado} className="space-y-4">
              <div>
                <label
                  htmlFor="admin_pass"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  Contraseña de Administrador
                </label>
                <input
                  id="admin_pass"
                  type="password"
                  autoFocus
                  required
                  placeholder="Introduce tu contraseña"
                  value={confirmacionBaja.password}
                  onChange={(e) =>
                    setConfirmacionBaja({
                      ...confirmacionBaja,
                      password: e.target.value,
                      error: '',
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
                />
              </div>
              {confirmacionBaja.error && (
                <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {confirmacionBaja.error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmacionBaja({
                      abierto: false,
                      alumno: null,
                      nuevoEstado: false,
                      password: '',
                      error: '',
                      cargando: false,
                    })
                  }
                  className="w-1/2 min-h-[44px] border border-gray-300 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={confirmacionBaja.cargando}
                  className={`w-1/2 min-h-[44px] text-white rounded-lg py-2.5 text-sm font-semibold transition ${
                    confirmacionBaja.nuevoEstado
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmacionBaja.cargando ? 'Verificando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
