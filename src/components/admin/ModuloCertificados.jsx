import { useState, useMemo, useRef, useEffect } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'
import Paginacion from './Paginacion'
import {
  Plus,
  Download,
  Edit2,
  Search,
  RotateCcw,
  ExternalLink,
  Calendar,
  Check,
  ChevronsUpDown,
} from 'lucide-react'

function calcularFechaExpiracion(fechaBaseStr, meses) {
  if (!fechaBaseStr) return ''
  const [year, month, day] = fechaBaseStr.split('-').map(Number)
  const d = new Date(year, month - 1 + Number(meses), day)
  return d.toISOString().split('T')[0]
}

function SelectorItem({
  label,
  placeholder,
  items,
  seleccionadoId,
  onSeleccionar,
  renderItem,
  renderSeleccionado,
  filtroFn,
}) {
  const [abierto, setAbierto] = useState(false)
  const [filtro, setFiltro] = useState('')
  const dropdownRef = useRef(null)

  const actual = useMemo(
    () => items.find((it) => it.id === seleccionadoId),
    [items, seleccionadoId]
  )
  const resultados = useMemo(() => {
    const q = filtro.toLowerCase().trim()
    if (!q) return items.slice(0, 8)
    return items.filter((it) => filtroFn(it, q)).slice(0, 8)
  }, [items, filtro, filtroFn])

  useEffect(() => {
    function handleClickFuera(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setAbierto(false)
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  if (actual && !abierto) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {label} *
        </label>
        <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-sm gap-2">
          <div className="flex flex-col">{renderSeleccionado(actual)}</div>
          <button
            type="button"
            onClick={() => {
              onSeleccionar('')
              setAbierto(true)
            }}
            className="min-h-[44px] px-3 py-2 text-xs text-blue-700 hover:text-blue-900 font-semibold bg-white border border-blue-200 rounded-lg shadow-sm transition inline-flex items-center justify-center"
          >
            Cambiar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label} *
      </label>
      <div className="relative">
        <Search
          className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={filtro}
          onFocus={() => setAbierto(true)}
          onChange={(e) => {
            setFiltro(e.target.value)
            setAbierto(true)
          }}
          className="w-full pl-9 pr-12 border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
        />
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-label={`Desplegar lista de opciones para ${label}`}
          className="min-h-[44px] min-w-[44px] absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400"
        >
          <ChevronsUpDown className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {abierto && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto z-30 divide-y divide-slate-100">
          {resultados.length === 0 ? (
            <div className="p-3 text-xs text-gray-500 text-center">
              Sin resultados coincidentes
            </div>
          ) : (
            resultados.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  onSeleccionar(it.id)
                  setAbierto(false)
                  setFiltro('')
                }}
                className={`w-full min-h-[44px] text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition ${
                  it.id === seleccionadoId ? 'bg-blue-50/70 font-bold' : ''
                }`}
              >
                <div>{renderItem(it)}</div>
                {it.id === seleccionadoId && (
                  <Check
                    className="w-4 h-4 text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function ModuloCertificados({
  cursos,
  alumnos,
  certificados,
  onRecargar,
  onAlerta,
}) {
  const fechaHoy = new Date().toISOString().split('T')[0]
  const originWeb = window.location.origin
  const registrosPorPagina = 5

  const [busqueda, setBusqueda] = useState('')
  const [filtroVigencia, setFiltroVigencia] = useState('todos')
  const [paginaActual, setPaginaActual] = useState(1)
  const [certEditandoId, setCertEditandoId] = useState(null)

  const [form, setForm] = useState({
    folio_manual: '',
    curso_id: '',
    alumno_id: '',
    instructor: '',
    fecha_emision: fechaHoy,
    tiene_vigencia: false,
    fecha_vigencia: '',
    calificacion: '100',
  })

  function manejarCambioCurso(cursoIdStr) {
    const cId = parseInt(cursoIdStr)
    const cursoSel = cursos.find((c) => c.id === cId)
    if (!cursoSel) {
      setForm((prev) => ({
        ...prev,
        curso_id: cursoIdStr,
        tiene_vigencia: false,
        fecha_vigencia: '',
      }))
      return
    }
    const vig = Boolean(cursoSel.tiene_vigencia)
    const meses = cursoSel.meses_vigencia || 12
    setForm((prev) => ({
      ...prev,
      curso_id: cursoIdStr,
      tiene_vigencia: vig,
      fecha_vigencia: vig
        ? calcularFechaExpiracion(prev.fecha_emision || fechaHoy, meses)
        : '',
    }))
  }

  function manejarCambioFechaEmision(nuevaFecha) {
    setForm((prev) => {
      let vig = prev.fecha_vigencia
      const c = cursos.find((item) => item.id === parseInt(prev.curso_id))
      if (c?.tiene_vigencia) {
        vig = calcularFechaExpiracion(nuevaFecha, c.meses_vigencia || 12)
      }
      return { ...prev, fecha_emision: nuevaFecha, fecha_vigencia: vig }
    })
  }

  async function guardarCertificado(e) {
    e.preventDefault()
    if (!form.curso_id || !form.alumno_id) {
      onAlerta('Selecciona tanto el curso como el alumno titular', 'error')
      return
    }

    const body = {
      folio_manual: form.folio_manual.trim(),
      curso_id: parseInt(form.curso_id),
      alumno_id: parseInt(form.alumno_id),
      instructor: form.instructor.trim(),
      fecha_emision: form.fecha_emision || fechaHoy,
      tiene_vigencia: form.tiene_vigencia,
      fecha_vigencia:
        form.tiene_vigencia && form.fecha_vigencia ? form.fecha_vigencia : null,
      calificacion: form.calificacion || '100',
    }

    const endpoint = certEditandoId
      ? `${API_URL}/api/certificados/${certEditandoId}`
      : `${API_URL}/api/certificados`
    const method = certEditandoId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })
      if (res.ok) {
        onAlerta(
          certEditandoId
            ? 'Certificado actualizado'
            : 'Certificado emitido con éxito',
          'exito'
        )
        cancelarEdicion()
        onRecargar()
      } else {
        const err = await res.json()
        onAlerta(err.detail || 'Error al procesar el certificado', 'error')
      }
    } catch {
      onAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicion(cert) {
    setCertEditandoId(cert.id)
    setForm({
      folio_manual: cert.folio_manual || '',
      curso_id: cert.curso_id || '',
      alumno_id: cert.alumno_id || '',
      instructor: cert.instructor || '',
      fecha_emision: cert.fecha_emision || fechaHoy,
      tiene_vigencia: cert.tiene_vigencia || false,
      fecha_vigencia: cert.fecha_vigencia || '',
      calificacion: cert.calificacion || '100',
    })
  }

  function cancelarEdicion() {
    setCertEditandoId(null)
    setForm({
      folio_manual: '',
      curso_id: '',
      alumno_id: '',
      instructor: '',
      fecha_emision: fechaHoy,
      tiene_vigencia: false,
      fecha_vigencia: '',
      calificacion: '100',
    })
  }

  async function descargarQr(certId, alumnoNombre) {
    try {
      const currentOrigin = encodeURIComponent(window.location.origin)
      const res = await fetch(
        `${API_URL}/api/certificados/${certId}/qr?base_url=${currentOrigin}`,
        {
          headers: getAuthHeaders(),
        }
      )
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr_${(alumnoNombre || `cert_${certId}`).trim().replace(/\s+/g, '_')}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      onAlerta('Error al descargar el código QR', 'error')
    }
  }

  const certsFiltrados = useMemo(() => {
    return certificados.filter((c) => {
      const q = busqueda.toLowerCase().trim()
      const match =
        (c.alumno_nombre && c.alumno_nombre.toLowerCase().includes(q)) ||
        (c.curso_nombre && c.curso_nombre.toLowerCase().includes(q)) ||
        (c.folio_manual && c.folio_manual.toLowerCase().includes(q)) ||
        (c.instructor && c.instructor.toLowerCase().includes(q))

      const esPerm = !c.tiene_vigencia
      const esExp =
        c.tiene_vigencia && c.fecha_vigencia && c.fecha_vigencia < fechaHoy
      const esVig =
        c.tiene_vigencia && (!c.fecha_vigencia || c.fecha_vigencia >= fechaHoy)

      const matchFiltro =
        filtroVigencia === 'todos'
          ? true
          : filtroVigencia === 'permanente'
            ? esPerm
            : filtroVigencia === 'vigentes'
              ? esVig
              : esExp

      return match && matchFiltro
    })
  }, [certificados, busqueda, filtroVigencia, fechaHoy])

  const totalPaginas =
    Math.ceil(certsFiltrados.length / registrosPorPagina) || 1
  const certsPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * registrosPorPagina
    return certsFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [certsFiltrados, paginaActual])

  useEffect(() => setPaginaActual(1), [busqueda, filtroVigencia])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Formulario */}
      <section
        aria-labelledby="form-cert-title"
        className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="form-cert-title"
            className="text-base font-bold text-[#1b3a6b] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />{' '}
            {certEditandoId ? 'Modificar Certificado' : 'Emitir Certificado'}
          </h2>
          {certEditandoId && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
              Modo Edición
            </span>
          )}
        </div>

        <form onSubmit={guardarCertificado} className="space-y-4">
          <div>
            <label
              htmlFor="folio_manual"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Folio Manual Único *
            </label>
            <input
              id="folio_manual"
              type="text"
              required
              placeholder="Ej. CERT-2024-001"
              value={form.folio_manual}
              onChange={(e) =>
                setForm({ ...form, folio_manual: e.target.value })
              }
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <SelectorItem
            label="Programa Académico"
            placeholder="Buscar curso por nombre o clave..."
            items={cursos}
            seleccionadoId={parseInt(form.curso_id)}
            onSeleccionar={manejarCambioCurso}
            filtroFn={(c, q) =>
              c.nombre.toLowerCase().includes(q) ||
              (c.clave_curso && c.clave_curso.toLowerCase().includes(q))
            }
            renderItem={(c) => (
              <>
                <div className="text-gray-800 font-semibold">{c.nombre}</div>
                <div className="text-gray-500 font-mono text-[11px]">
                  {c.duracion_horas} hrs{' '}
                  {c.clave_curso ? `| ${c.clave_curso}` : ''}
                </div>
              </>
            )}
            renderSeleccionado={(c) => (
              <>
                <span className="font-bold text-gray-800">{c.nombre}</span>
                <span className="text-xs text-gray-600 font-mono">
                  {c.duracion_horas} hrs |{' '}
                  {c.tiene_vigencia
                    ? `Vigencia: ${c.meses_vigencia || 12} meses`
                    : 'Permanente'}
                </span>
              </>
            )}
          />

          <SelectorItem
            label="Alumno Titular"
            placeholder="Buscar alumno por nombre o CURP..."
            items={alumnos}
            seleccionadoId={parseInt(form.alumno_id)}
            onSeleccionar={(id) => setForm({ ...form, alumno_id: id })}
            filtroFn={(a, q) =>
              `${a.nombre} ${a.apellidos}`.toLowerCase().includes(q) ||
              (a.curp && a.curp.toLowerCase().includes(q))
            }
            renderItem={(a) => (
              <>
                <div className="text-gray-800 font-semibold">
                  {a.nombre} {a.apellidos}
                </div>
                <div className="text-gray-500 font-mono text-[11px]">
                  CURP: {a.curp}
                </div>
              </>
            )}
            renderSeleccionado={(a) => (
              <>
                <span className="font-bold text-gray-800">
                  {a.nombre} {a.apellidos}
                </span>
                <span className="text-xs text-gray-600 font-mono">
                  CURP: {a.curp}
                </span>
              </>
            )}
          />

          <div>
            <label
              htmlFor="instructor"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Instructor / Evaluador *
            </label>
            <input
              id="instructor"
              type="text"
              required
              placeholder="Ej. Mtro. Roberto Mendoza"
              value={form.instructor}
              onChange={(e) => setForm({ ...form, instructor: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div>
            <label
              htmlFor="fecha_emision"
              className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1"
            >
              <Calendar
                className="w-3.5 h-3.5 text-gray-400"
                aria-hidden="true"
              />{' '}
              Fecha de Emisión *
            </label>
            <input
              id="fecha_emision"
              type="date"
              required
              value={form.fecha_emision}
              onChange={(e) => manejarCambioFechaEmision(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="cert_tiene_vigencia"
              checked={form.tiene_vigencia}
              onChange={(e) =>
                setForm({
                  ...form,
                  tiene_vigencia: e.target.checked,
                  fecha_vigencia: e.target.checked ? form.fecha_vigencia : '',
                })
              }
              className="w-4 h-4 rounded text-[#1b3a6b] focus:ring-[#1b3a6b]"
            />
            <label
              htmlFor="cert_tiene_vigencia"
              className="text-xs font-medium text-gray-700 select-none cursor-pointer py-1"
            >
              ¿Establecer fecha límite de vigencia?
            </label>
          </div>

          {form.tiene_vigencia && (
            <div>
              <label
                htmlFor="fecha_vigencia"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Fecha de Expiración *
              </label>
              <input
                id="fecha_vigencia"
                type="date"
                required={form.tiene_vigencia}
                value={form.fecha_vigencia}
                onChange={(e) =>
                  setForm({ ...form, fecha_vigencia: e.target.value })
                }
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#1b3a6b]"
              />
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 min-h-[44px] bg-dorado text-[#0f1f3d] py-2.5 px-4 rounded-lg font-bold text-sm hover:brightness-95 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
            >
              {certEditandoId ? 'Guardar Cambios' : 'Generar Certificado'}
            </button>
            {certEditandoId && (
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
        aria-labelledby="list-cert-title"
        className="lg:col-span-8 space-y-4"
      >
        <h2 id="list-cert-title" className="sr-only">
          Catálogo de Certificados Emitidos
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
              placeholder="Buscar por folio, alumno, curso o instructor..."
              aria-label="Buscar certificados"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
            />
          </div>

          <div
            className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg self-stretch sm:self-auto flex-wrap"
            role="group"
            aria-label="Filtro de vigencia"
          >
            {['todos', 'permanente', 'vigentes', 'expirados'].map((filtro) => (
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
              aria-label="Limpiar filtros de certificados"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-md transition"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Documento & Titular</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-slate-100">
            {certsPaginados.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No se encontraron certificados registrados.
              </div>
            ) : (
              certsPaginados.map((cert) => {
                const esExp =
                  cert.tiene_vigencia &&
                  cert.fecha_vigencia &&
                  cert.fecha_vigencia < fechaHoy
                return (
                  <div
                    key={cert.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">
                          {cert.alumno_nombre}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            !cert.tiene_vigencia
                              ? 'bg-blue-100 text-blue-800'
                              : esExp
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {!cert.tiene_vigencia
                            ? 'PERMANENTE'
                            : esExp
                              ? 'EXPIRADO'
                              : 'VIGENTE'}
                        </span>
                      </div>
                      <p className="text-xs text-[#1b3a6b] font-semibold mt-0.5">
                        {cert.curso_nombre}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        Folio: {cert.folio_manual} | Emisión:{' '}
                        {cert.fecha_emision}
                      </p>

                      {/* Enlace con texto distintivo para evitar "Identical links have the same purpose" */}
                      <a
                        href={`${originWeb}/validar/${cert.token_publico}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ver validación pública oficial del certificado folio ${cert.folio_manual} de ${cert.alumno_nombre}`}
                        className="text-xs text-blue-700 hover:text-blue-900 hover:underline mt-1.5 inline-flex items-center gap-1.5 py-1"
                      >
                        <ExternalLink
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        <span>
                          Ver validación pública{' '}
                          <span className="sr-only">
                            del folio {cert.folio_manual} de{' '}
                            {cert.alumno_nombre}
                          </span>
                        </span>
                      </a>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(cert)}
                        aria-label={`Editar certificado folio ${cert.folio_manual} de ${cert.alumno_nombre}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-[#1b3a6b] rounded-lg hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => descargarQr(cert.id, cert.alumno_nombre)}
                        aria-label={`Descargar código QR para certificado de ${cert.alumno_nombre}`}
                        className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 bg-slate-100 rounded-lg text-xs font-bold text-[#1b3a6b] hover:bg-slate-200 transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                      >
                        <Download className="w-4 h-4" aria-hidden="true" /> QR
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
            totalRegistros={certsFiltrados.length}
            registrosPorPagina={registrosPorPagina}
            onCambiarPagina={setPaginaActual}
            etiqueta="certificados"
          />
        </div>
      </section>
    </div>
  )
}
