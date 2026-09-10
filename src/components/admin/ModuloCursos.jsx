import { useState, useMemo, useEffect } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'
import Paginacion from './Paginacion'
import {
  Plus,
  Edit2,
  X,
  Search,
  RotateCcw,
  Users,
  BookOpen,
  Clock,
  KeyRound,
} from 'lucide-react'

export default function ModuloCursos({
  cursos,
  certificados,
  onRecargar,
  onAlerta,
}) {
  const registrosPorPagina = 5
  const [busqueda, setBusqueda] = useState('')
  const [filtroVigencia, setFiltroVigencia] = useState('todos')
  const [paginaActual, setPaginaActual] = useState(1)

  const [editandoId, setEditandoId] = useState(null)
  const [modalAlumnosCurso, setModalAlumnosCurso] = useState(null)

  const [form, setForm] = useState({
    nombre: '',
    duracion_horas: 20,
    clave_curso: '',
    tiene_vigencia: false,
    meses_vigencia: 12,
  })

  async function guardarCurso(e) {
    e.preventDefault()
    const body = {
      nombre: form.nombre.trim(),
      duracion_horas: parseInt(form.duracion_horas) || 1,
      clave_curso: form.clave_curso?.trim() || null,
      tiene_vigencia: form.tiene_vigencia,
      meses_vigencia: form.tiene_vigencia
        ? parseInt(form.meses_vigencia) || 12
        : null,
    }

    const endpoint = editandoId
      ? `${API_URL}/api/cursos/${editandoId}`
      : `${API_URL}/api/cursos`
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
            ? 'Curso modificado correctamente'
            : 'Curso registrado con éxito',
          'exito'
        )
        cancelarEdicion()
        onRecargar()
      } else {
        const err = await res.json()
        onAlerta(err.detail || 'Error al procesar el curso', 'error')
      }
    } catch {
      onAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicion(c) {
    setEditandoId(c.id)
    setForm({
      nombre: c.nombre || '',
      duracion_horas: c.duracion_horas || 20,
      clave_curso: c.clave_curso || '',
      tiene_vigencia: c.tiene_vigencia || false,
      meses_vigencia: c.meses_vigencia || 12,
    })
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({
      nombre: '',
      duracion_horas: 20,
      clave_curso: '',
      tiene_vigencia: false,
      meses_vigencia: 12,
    })
  }

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const q = busqueda.toLowerCase().trim()
      const matchQuery =
        c.nombre.toLowerCase().includes(q) ||
        (c.clave_curso && c.clave_curso.toLowerCase().includes(q))
      const matchVig =
        filtroVigencia === 'todos'
          ? true
          : filtroVigencia === 'vigencia'
            ? c.tiene_vigencia
            : !c.tiene_vigencia
      return matchQuery && matchVig
    })
  }, [cursos, busqueda, filtroVigencia])

  const totalPaginas =
    Math.ceil(cursosFiltrados.length / registrosPorPagina) || 1
  const cursosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * registrosPorPagina
    return cursosFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [cursosFiltrados, paginaActual])

  useEffect(() => setPaginaActual(1), [busqueda, filtroVigencia])

  const certificadosDelCurso = useMemo(() => {
    if (!modalAlumnosCurso) return []
    return certificados.filter((cert) => cert.curso_id === modalAlumnosCurso.id)
  }, [modalAlumnosCurso, certificados])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Formulario */}
      <section
        aria-labelledby="form-curso-title"
        className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="form-curso-title"
            className="text-base font-bold text-[#1b3a6b] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />{' '}
            {editandoId ? 'Modificar Curso' : 'Nuevo Curso'}
          </h2>
          {editandoId && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
              Modo Edición
            </span>
          )}
        </div>

        <form onSubmit={guardarCurso} className="space-y-4">
          <div>
            <label
              htmlFor="curso_nombre"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Nombre del Programa *
            </label>
            <input
              id="curso_nombre"
              type="text"
              required
              placeholder="Ej. Formación de Instructores"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="curso_clave"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Clave (Opcional)
            </label>
            <input
              id="curso_clave"
              type="text"
              placeholder="Ej. CURS-2024-EDU"
              value={form.clave_curso}
              onChange={(e) =>
                setForm({ ...form, clave_curso: e.target.value })
              }
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="curso_horas"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Duración en Horas *
            </label>
            <input
              id="curso_horas"
              type="number"
              required
              min="1"
              value={form.duracion_horas}
              onChange={(e) =>
                setForm({ ...form, duracion_horas: e.target.value })
              }
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="curso_tiene_vigencia"
              checked={form.tiene_vigencia}
              onChange={(e) =>
                setForm({ ...form, tiene_vigencia: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#1b3a6b] focus:ring-[#1b3a6b]"
            />
            <label
              htmlFor="curso_tiene_vigencia"
              className="text-xs font-medium text-gray-700 select-none cursor-pointer py-1"
            >
              ¿Requiere renovación por vigencia?
            </label>
          </div>

          {form.tiene_vigencia && (
            <div>
              <label
                htmlFor="curso_meses"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Meses de Vigencia por Defecto
              </label>
              <input
                id="curso_meses"
                type="number"
                min="1"
                value={form.meses_vigencia}
                onChange={(e) =>
                  setForm({ ...form, meses_vigencia: e.target.value })
                }
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
              />
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 min-h-[44px] bg-[#1b3a6b] text-white py-2.5 px-4 rounded-lg font-bold text-sm hover:brightness-110 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
            >
              {editandoId ? 'Guardar Cambios' : 'Registrar Curso'}
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
        aria-labelledby="list-curso-title"
        className="lg:col-span-8 space-y-4"
      >
        <h2 id="list-curso-title" className="sr-only">
          Catálogo de Cursos Disponibles
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
              placeholder="Buscar curso por nombre o clave..."
              aria-label="Buscar cursos"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div
            className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg self-stretch sm:self-auto flex-wrap"
            role="group"
            aria-label="Filtro vigencia de cursos"
          >
            {['todos', 'permanente', 'vigencia'].map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setFiltroVigencia(filtro)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-md capitalize transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
                  filtroVigencia === filtro
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
                setFiltroVigencia('todos')
              }}
              aria-label="Limpiar filtros de cursos"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-md transition"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Programa Académico</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-slate-100">
            {cursosPaginados.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No se encontraron cursos coincidentes.
              </div>
            ) : (
              cursosPaginados.map((c) => {
                const countCertificados = certificados.filter(
                  (cert) => cert.curso_id === c.id
                ).length
                return (
                  <div
                    key={c.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">
                          {c.nombre}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.tiene_vigencia
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {c.tiene_vigencia
                            ? `VIGENCIA ${c.meses_vigencia || 12} MESES`
                            : 'PERMANENTE'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                        <Clock
                          className="w-3.5 h-3.5 text-gray-400"
                          aria-hidden="true"
                        />{' '}
                        {c.duracion_horas} Horas curriculares
                      </p>
                      {c.clave_curso && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <KeyRound
                            className="w-3 h-3 text-gray-400"
                            aria-hidden="true"
                          />{' '}
                          Clave:{' '}
                          <span className="font-mono">{c.clave_curso}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setModalAlumnosCurso(c)}
                        aria-label={`Ver alumnos certificados en el curso ${c.nombre}`}
                        className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <Users className="w-4 h-4" aria-hidden="true" />
                        <span>Alumnos ({countCertificados})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => iniciarEdicion(c)}
                        aria-label={`Editar programa del curso ${c.nombre}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-[#1b3a6b] rounded-lg hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
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
            totalRegistros={cursosFiltrados.length}
            registrosPorPagina={registrosPorPagina}
            onCambiarPagina={setPaginaActual}
            etiqueta="cursos"
          />
        </div>
      </section>

      {/* Modal: Alumnos del curso */}
      {modalAlumnosCurso && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookOpen
                  className="w-5 h-5 text-[#1b3a6b]"
                  aria-hidden="true"
                />
                <h3 className="font-bold text-[#1b3a6b] text-base">
                  Alumnos Certificados en este Curso
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAlumnosCurso(null)}
                aria-label="Cerrar modal de alumnos certificados"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {modalAlumnosCurso.nombre}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {modalAlumnosCurso.duracion_horas} Horas | Clave:{' '}
                {modalAlumnosCurso.clave_curso || 'N/A'}
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {certificadosDelCurso.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  Aún no se han emitido certificados para este programa.
                </p>
              ) : (
                certificadosDelCurso.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {cert.alumno_nombre}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        Folio: {cert.folio_manual} | Emisión:{' '}
                        {cert.fecha_emision}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold bg-white border px-2 py-0.5 rounded text-gray-600">
                      {cert.tiene_vigencia
                        ? `Vence: ${cert.fecha_vigencia}`
                        : 'Permanente'}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setModalAlumnosCurso(null)}
              className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 text-gray-800 text-sm font-medium py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
