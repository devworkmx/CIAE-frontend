import { useEffect, useState, useMemo } from 'react'
import { API_URL, getAuthHeaders } from '../services/api'
import {
  Plus,
  Award,
  Users,
  BookOpen,
  Download,
  Edit2,
  X,
  Search,
  RotateCcw,
  UserCheck,
  UserX,
  GraduationCap,
  Mail,
  Fingerprint,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  ExternalLink,
} from 'lucide-react'

function Admin() {
  const [seccion, setSeccion] = useState('certificados')
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [certificados, setCertificados] = useState([])

  // Notificaciones Toast
  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    mensaje: '',
    tipo: 'exito', // 'exito' | 'error'
  })

  function lanzarAlerta(mensaje, tipo = 'exito') {
    setNotificacion({ mostrar: true, mensaje, tipo })
    setTimeout(() => {
      setNotificacion((prev) => ({ ...prev, mostrar: false }))
    }, 4500)
  }

  const registrosPorPagina = 5

  // --- FILTROS Y PAGINACIÓN: CERTIFICADOS ---
  const [busquedaCert, setBusquedaCert] = useState('')
  const [filtroVigenciaCert, setFiltroVigenciaCert] = useState('todos') // 'todos' | 'permanente' | 'vigentes' | 'expirados'
  const [paginaActualCert, setPaginaActualCert] = useState(1)
  const [certEditandoId, setCertEditandoId] = useState(null)

  // --- FILTROS Y PAGINACIÓN: ALUMNOS ---
  const [busquedaAlumno, setBusquedaAlumno] = useState('')
  const [filtroEstadoAlumno, setFiltroEstadoAlumno] = useState('todos') // 'todos' | 'activos' | 'desactivados'
  const [paginaActualAlumno, setPaginaActualAlumno] = useState(1)
  const [alumnoModalCursos, setAlumnoModalCursos] = useState(null)
  const [alumnoEditandoId, setAlumnoEditandoId] = useState(null)

  // Modal confirmación de baja de Alumno con contraseña
  const [confirmacionBaja, setConfirmacionBaja] = useState({
    abierto: false,
    alumno: null,
    nuevoEstado: false,
    password: '',
    error: '',
    cargando: false,
  })

  // --- FILTROS Y PAGINACIÓN: CURSOS ---
  const [busquedaCurso, setBusquedaCurso] = useState('')
  const [filtroVigenciaCurso, setFiltroVigenciaCurso] = useState('todos') // 'todos' | 'permanente' | 'vigencia'
  const [paginaActualCurso, setPaginaActualCurso] = useState(1)
  const [cursoModalAlumnos, setCursoModalAlumnos] = useState(null)
  const [cursoEditandoId, setCursoEditandoId] = useState(null)

  // --- FORMULARIOS ---
  const [certForm, setCertForm] = useState({
    folio_manual: '',
    curso_id: '',
    alumno_id: '',
    instructor: '',
    tiene_vigencia: false,
    fecha_vigencia: '',
    calificacion: '100',
  })

  const [alumnoForm, setAlumnoForm] = useState({
    nombre: '',
    apellidos: '',
    curp: '',
    email: '',
    telefono: '',
  })

  const [cursoForm, setCursoForm] = useState({
    nombre: '',
    duracion_horas: 20,
    clave_curso: '',
    tiene_vigencia: false,
    meses_vigencia: 12,
  })

  const originWeb = window.location.origin

  async function cargarTodo() {
    try {
      const [resCursos, resAlumnos, resCerts] = await Promise.all([
        fetch(`${API_URL}/api/cursos`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/alumnos`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/certificados`, { headers: getAuthHeaders() }),
      ])
      if (resCursos.ok) setCursos(await resCursos.json())
      if (resAlumnos.ok) setAlumnos(await resAlumnos.json())
      if (resCerts.ok) setCertificados(await resCerts.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  async function descargarQrAutenticado(certId, alumnoNombre) {
    try {
      const currentOrigin = encodeURIComponent(window.location.origin)
      const res = await fetch(
        `${API_URL}/api/certificados/${certId}/qr?base_url=${currentOrigin}`,
        { headers: getAuthHeaders() }
      )
      if (!res.ok) {
        lanzarAlerta('Error al descargar el código QR.', 'error')
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const nombreLimpio = alumnoNombre
        ? alumnoNombre.trim().replace(/\s+/g, '_')
        : `cert_${certId}`
      a.download = `qr_${nombreLimpio}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      lanzarAlerta('Error al procesar la descarga del QR.', 'error')
    }
  }

  // ===================== CRUD CERTIFICADOS =====================
  async function guardarCertificado(e) {
    e.preventDefault()
    const body = {
      folio_manual: certForm.folio_manual.trim(),
      curso_id: parseInt(certForm.curso_id),
      alumno_id: parseInt(certForm.alumno_id),
      instructor: certForm.instructor.trim(),
      tiene_vigencia: certForm.tiene_vigencia,
      fecha_vigencia:
        certForm.tiene_vigencia && certForm.fecha_vigencia
          ? certForm.fecha_vigencia
          : null,
      calificacion: certForm.calificacion || '100',
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
        lanzarAlerta(
          certEditandoId
            ? 'Certificado actualizado correctamente'
            : 'Certificado emitido con éxito',
          'exito'
        )
        cancelarEdicionCertificado()
        cargarTodo()
      } else {
        const err = await res.json()
        lanzarAlerta(err.detail || 'Error al procesar el certificado', 'error')
      }
    } catch (err) {
      lanzarAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicionCertificado(cert) {
    setCertEditandoId(cert.id)
    setCertForm({
      folio_manual: cert.folio_manual || '',
      curso_id: cert.curso_id || '',
      alumno_id: cert.alumno_id || '',
      instructor: cert.instructor || '',
      tiene_vigencia: cert.tiene_vigencia || false,
      fecha_vigencia: cert.fecha_vigencia || '',
      calificacion: cert.calificacion || '100',
    })
  }

  function cancelarEdicionCertificado() {
    setCertEditandoId(null)
    setCertForm({
      folio_manual: '',
      curso_id: '',
      alumno_id: '',
      instructor: '',
      tiene_vigencia: false,
      fecha_vigencia: '',
      calificacion: '100',
    })
  }

  const certificadosFiltrados = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return certificados.filter((c) => {
      const query = busquedaCert.toLowerCase().trim()
      const alumno = c.alumno_nombre ? c.alumno_nombre.toLowerCase() : ''
      const curso = c.curso_nombre ? c.curso_nombre.toLowerCase() : ''
      const folio = c.folio_manual ? c.folio_manual.toLowerCase() : ''
      const instructor = c.instructor ? c.instructor.toLowerCase() : ''

      const coincideBusqueda =
        alumno.includes(query) ||
        curso.includes(query) ||
        folio.includes(query) ||
        instructor.includes(query)

      const esPermanente = !c.tiene_vigencia
      const esExpirado =
        c.tiene_vigencia && c.fecha_vigencia && c.fecha_vigencia < hoy
      const esVigente =
        c.tiene_vigencia && (!c.fecha_vigencia || c.fecha_vigencia >= hoy)

      const coincideFiltro =
        filtroVigenciaCert === 'todos'
          ? true
          : filtroVigenciaCert === 'permanente'
            ? esPermanente
            : filtroVigenciaCert === 'vigentes'
              ? esVigente
              : esExpirado

      return coincideBusqueda && coincideFiltro
    })
  }, [certificados, busquedaCert, filtroVigenciaCert])

  const totalPaginasCert =
    Math.ceil(certificadosFiltrados.length / registrosPorPagina) || 1
  const certificadosPaginados = useMemo(() => {
    const inicio = (paginaActualCert - 1) * registrosPorPagina
    return certificadosFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [certificadosFiltrados, paginaActualCert])

  useEffect(() => {
    setPaginaActualCert(1)
  }, [busquedaCert, filtroVigenciaCert])

  // ===================== CRUD ALUMNOS =====================
  async function guardarAlumno(e) {
    e.preventDefault()
    const body = {
      ...alumnoForm,
      curp: alumnoForm.curp.trim().toUpperCase(),
      email: alumnoForm.email?.trim() === '' ? null : alumnoForm.email?.trim(),
      telefono:
        alumnoForm.telefono?.trim() === '' ? null : alumnoForm.telefono?.trim(),
    }

    const endpoint = alumnoEditandoId
      ? `${API_URL}/api/alumnos/${alumnoEditandoId}`
      : `${API_URL}/api/alumnos`
    const method = alumnoEditandoId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (res.ok) {
        lanzarAlerta(
          alumnoEditandoId
            ? 'Alumno actualizado con éxito'
            : 'Alumno registrado con éxito',
          'exito'
        )
        cancelarEdicionAlumno()
        cargarTodo()
      } else {
        const err = await res.json()
        lanzarAlerta(err.detail || 'Error al procesar el alumno', 'error')
      }
    } catch (err) {
      lanzarAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicionAlumno(a) {
    setAlumnoEditandoId(a.id)
    setAlumnoForm({
      nombre: a.nombre || '',
      apellidos: a.apellidos || '',
      curp: a.curp || '',
      email: a.email || '',
      telefono: a.telefono || '',
    })
  }

  function cancelarEdicionAlumno() {
    setAlumnoEditandoId(null)
    setAlumnoForm({
      nombre: '',
      apellidos: '',
      curp: '',
      email: '',
      telefono: '',
    })
  }

  function abrirModalCambioEstado(alumno) {
    const nuevoEstado = alumno.activo === false ? true : false
    setConfirmacionBaja({
      abierto: true,
      alumno,
      nuevoEstado,
      password: '',
      error: '',
      cargando: false,
    })
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
        body: JSON.stringify({
          activo: nuevoEstado,
          admin_password: password,
        }),
      })

      if (res.ok) {
        lanzarAlerta(
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
        cargarTodo()
      } else {
        const err = await res.json()
        setConfirmacionBaja((prev) => ({
          ...prev,
          cargando: false,
          error: err.detail || 'No se pudo actualizar el estado.',
        }))
      }
    } catch (err) {
      setConfirmacionBaja((prev) => ({
        ...prev,
        cargando: false,
        error: 'Error al conectar con el servidor.',
      }))
    }
  }

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) => {
      const query = busquedaAlumno.toLowerCase().trim()
      const nombreCompleto =
        `${a.nombre || ''} ${a.apellidos || ''}`.toLowerCase()
      const coincideBusqueda =
        nombreCompleto.includes(query) ||
        (a.curp && a.curp.toLowerCase().includes(query)) ||
        (a.email && a.email.toLowerCase().includes(query))

      const estaActivo = a.activo !== false
      const coincideEstado =
        filtroEstadoAlumno === 'todos'
          ? true
          : filtroEstadoAlumno === 'activos'
            ? estaActivo
            : !estaActivo

      return coincideBusqueda && coincideEstado
    })
  }, [alumnos, busquedaAlumno, filtroEstadoAlumno])

  const totalPaginasAlumno =
    Math.ceil(alumnosFiltrados.length / registrosPorPagina) || 1
  const alumnosPaginados = useMemo(() => {
    const inicio = (paginaActualAlumno - 1) * registrosPorPagina
    return alumnosFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [alumnosFiltrados, paginaActualAlumno])

  useEffect(() => {
    setPaginaActualAlumno(1)
  }, [busquedaAlumno, filtroEstadoAlumno])

  const cursosDelAlumno = useMemo(() => {
    if (!alumnoModalCursos) return []
    return certificados.filter((c) => c.alumno_id === alumnoModalCursos.id)
  }, [alumnoModalCursos, certificados])

  // ===================== CRUD CURSOS =====================
  async function guardarCurso(e) {
    e.preventDefault()
    const body = {
      nombre: cursoForm.nombre.trim(),
      duracion_horas: parseInt(cursoForm.duracion_horas) || 1,
      clave_curso: cursoForm.clave_curso?.trim() || null,
      tiene_vigencia: cursoForm.tiene_vigencia,
      meses_vigencia: cursoForm.tiene_vigencia
        ? parseInt(cursoForm.meses_vigencia) || 12
        : null,
    }

    const endpoint = cursoEditandoId
      ? `${API_URL}/api/cursos/${cursoEditandoId}`
      : `${API_URL}/api/cursos`
    const method = cursoEditandoId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (res.ok) {
        lanzarAlerta(
          cursoEditandoId
            ? 'Curso actualizado con éxito'
            : 'Curso registrado con éxito',
          'exito'
        )
        cancelarEdicionCurso()
        cargarTodo()
      } else {
        const err = await res.json()
        lanzarAlerta(err.detail || 'Error al procesar el curso', 'error')
      }
    } catch (err) {
      lanzarAlerta('Error de conexión con el servidor', 'error')
    }
  }

  function iniciarEdicionCurso(c) {
    setCursoEditandoId(c.id)
    setCursoForm({
      nombre: c.nombre || '',
      duracion_horas: c.duracion_horas || 20,
      clave_curso: c.clave_curso || '',
      tiene_vigencia: c.tiene_vigencia || false,
      meses_vigencia: c.meses_vigencia || 12,
    })
  }

  function cancelarEdicionCurso() {
    setCursoEditandoId(null)
    setCursoForm({
      nombre: '',
      duracion_horas: 20,
      clave_curso: '',
      tiene_vigencia: false,
      meses_vigencia: 12,
    })
  }

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const query = busquedaCurso.toLowerCase().trim()
      const coincideBusqueda =
        (c.nombre && c.nombre.toLowerCase().includes(query)) ||
        (c.clave_curso && c.clave_curso.toLowerCase().includes(query))

      const coincideVigencia =
        filtroVigenciaCurso === 'todos'
          ? true
          : filtroVigenciaCurso === 'vigencia'
            ? c.tiene_vigencia
            : !c.tiene_vigencia

      return coincideBusqueda && coincideVigencia
    })
  }, [cursos, busquedaCurso, filtroVigenciaCurso])

  const totalPaginasCurso =
    Math.ceil(cursosFiltrados.length / registrosPorPagina) || 1
  const cursosPaginados = useMemo(() => {
    const inicio = (paginaActualCurso - 1) * registrosPorPagina
    return cursosFiltrados.slice(inicio, inicio + registrosPorPagina)
  }, [cursosFiltrados, paginaActualCurso])

  useEffect(() => {
    setPaginaActualCurso(1)
  }, [busquedaCurso, filtroVigenciaCurso])

  const certificadosDelCurso = useMemo(() => {
    if (!cursoModalAlumnos) return []
    return certificados.filter((cert) => cert.curso_id === cursoModalAlumnos.id)
  }, [cursoModalAlumnos, certificados])

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8 relative">
      {/* Toast Notificación */}
      {notificacion.mostrar && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
              notificacion.tipo === 'exito'
                ? 'bg-white border-emerald-200 text-emerald-800'
                : 'bg-white border-red-200 text-red-800'
            }`}
          >
            {notificacion.tipo === 'exito' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notificacion.mensaje}</span>
            <button
              onClick={() =>
                setNotificacion((prev) => ({ ...prev, mostrar: false }))
              }
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-[#1b3a6b]">
            Panel de Control Institucional
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de emisión académica, vigencias y control de folios
          </p>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSeccion('certificados')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
              seccion === 'certificados'
                ? 'bg-[#1b3a6b] text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <Award className="w-4 h-4" /> Certificados
          </button>
          <button
            onClick={() => setSeccion('alumnos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
              seccion === 'alumnos'
                ? 'bg-[#1b3a6b] text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <Users className="w-4 h-4" /> Alumnos
          </button>
          <button
            onClick={() => setSeccion('cursos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
              seccion === 'cursos'
                ? 'bg-[#1b3a6b] text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Cursos
          </button>
        </div>

        {/* ======================= VISTA: CERTIFICADOS (REFACTORIZADA) ======================= */}
        {seccion === 'certificados' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Formulario Izquierdo: Emitir / Modificar */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#1b3a6b] flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {certEditandoId
                    ? 'Modificar Certificado'
                    : 'Emitir Certificado'}
                </h2>
                {certEditandoId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    Modo Edición
                  </span>
                )}
              </div>

              <form onSubmit={guardarCertificado} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Folio Manual Único *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CIAE-2026-001"
                    value={certForm.folio_manual}
                    onChange={(e) =>
                      setCertForm({ ...certForm, folio_manual: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Programa Académico (Curso) *
                  </label>
                  <select
                    required
                    value={certForm.curso_id}
                    onChange={(e) =>
                      setCertForm({ ...certForm, curso_id: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  >
                    <option value="">Selecciona un curso</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Alumno Titular *
                  </label>
                  <select
                    required
                    value={certForm.alumno_id}
                    onChange={(e) =>
                      setCertForm({ ...certForm, alumno_id: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  >
                    <option value="">Selecciona un alumno</option>
                    {alumnos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre} {a.apellidos} ({a.curp})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Instructor / Emisor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre del instructor"
                    value={certForm.instructor}
                    onChange={(e) =>
                      setCertForm({ ...certForm, instructor: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="cert_tiene_vigencia"
                    checked={certForm.tiene_vigencia}
                    onChange={(e) =>
                      setCertForm({
                        ...certForm,
                        tiene_vigencia: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="cert_tiene_vigencia"
                    className="text-xs font-medium text-gray-700"
                  >
                    ¿Establecer fecha límite de vigencia?
                  </label>
                </div>

                {certForm.tiene_vigencia && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Fecha de Expiración *
                    </label>
                    <input
                      type="date"
                      required={certForm.tiene_vigencia}
                      value={certForm.fecha_vigencia}
                      onChange={(e) =>
                        setCertForm({
                          ...certForm,
                          fecha_vigencia: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                    />
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-dorado text-[#0f1f3d] py-2.5 rounded font-bold text-sm hover:brightness-95 transition"
                  >
                    {certEditandoId ? 'Guardar Cambios' : 'Generar Certificado'}
                  </button>
                  {certEditandoId && (
                    <button
                      type="button"
                      onClick={cancelarEdicionCertificado}
                      className="px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Listado Derecho: Filtros y Paginación */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaCert}
                    onChange={(e) => setBusquedaCert(e.target.value)}
                    placeholder="Buscar por folio, alumno, curso o instructor..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg self-stretch sm:self-auto">
                  <button
                    onClick={() => setFiltroVigenciaCert('todos')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCert === 'todos'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroVigenciaCert('permanente')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCert === 'permanente'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Permanentes
                  </button>
                  <button
                    onClick={() => setFiltroVigenciaCert('vigentes')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCert === 'vigentes'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Vigentes
                  </button>
                  <button
                    onClick={() => setFiltroVigenciaCert('expirados')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCert === 'expirados'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Expirados
                  </button>
                  <button
                    onClick={() => {
                      setBusquedaCert('')
                      setFiltroVigenciaCert('todos')
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 ml-1"
                    title="Limpiar filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span>Documento & Titular</span>
                  <span>Acciones</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {certificadosPaginados.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                      No se encontraron certificados con los criterios
                      seleccionados.
                    </div>
                  ) : (
                    certificadosPaginados.map((cert) => {
                      const hoy = new Date().toISOString().split('T')[0]
                      const esExpirado =
                        cert.tiene_vigencia &&
                        cert.fecha_vigencia &&
                        cert.fecha_vigencia < hoy

                      return (
                        <div
                          key={cert.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800 text-sm">
                                {cert.alumno_nombre}
                              </p>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  !cert.tiene_vigencia
                                    ? 'bg-blue-100 text-blue-800'
                                    : esExpirado
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {!cert.tiene_vigencia
                                  ? 'PERMANENTE'
                                  : esExpirado
                                    ? 'EXPIRADO'
                                    : 'VIGENTE'}
                              </span>
                            </div>

                            <p className="text-xs text-[#1b3a6b] font-semibold mt-0.5">
                              {cert.curso_nombre}
                            </p>

                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                              Folio: {cert.folio_manual} | Instructor:{' '}
                              {cert.instructor}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              {cert.tiene_vigencia
                                ? `Vence: ${cert.fecha_vigencia}`
                                : 'Sin fecha de expiración'}
                            </p>

                            <a
                              href={`${originWeb}/validar/${cert.token_publico}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Abrir
                              validación pública
                            </a>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => iniciarEdicionCertificado(cert)}
                              className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                              title="Editar certificado completo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                descargarQrAutenticado(
                                  cert.id,
                                  cert.alumno_nombre
                                )
                              }
                              className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded text-xs font-bold text-[#1b3a6b] hover:bg-slate-200 transition"
                            >
                              <Download className="w-3.5 h-3.5" /> QR
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Barra de Paginación de Certificados */}
                {certificadosFiltrados.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <div>
                      Mostrando{' '}
                      <span className="font-semibold text-gray-800">
                        {(paginaActualCert - 1) * registrosPorPagina + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-semibold text-gray-800">
                        {Math.min(
                          paginaActualCert * registrosPorPagina,
                          certificadosFiltrados.length
                        )}
                      </span>{' '}
                      de{' '}
                      <span className="font-semibold text-gray-800">
                        {certificadosFiltrados.length}
                      </span>{' '}
                      certificados
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setPaginaActualCert((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={paginaActualCert === 1}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from(
                        { length: totalPaginasCert },
                        (_, i) => i + 1
                      ).map((num) => (
                        <button
                          key={num}
                          onClick={() => setPaginaActualCert(num)}
                          className={`w-7 h-7 rounded-lg font-semibold text-xs transition ${
                            paginaActualCert === num
                              ? 'bg-[#1b3a6b] text-white shadow-sm'
                              : 'bg-white border text-gray-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setPaginaActualCert((prev) =>
                            Math.min(prev + 1, totalPaginasCert)
                          )
                        }
                        disabled={paginaActualCert === totalPaginasCert}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= VISTA: ALUMNOS ======================= */}
        {seccion === 'alumnos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#1b3a6b] flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {alumnoEditandoId ? 'Modificar Alumno' : 'Alta de Alumno'}
                </h2>
                {alumnoEditandoId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    Modo Edición
                  </span>
                )}
              </div>

              <form onSubmit={guardarAlumno} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nombre(s) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. José de Jesús"
                    value={alumnoForm.nombre}
                    onChange={(e) =>
                      setAlumnoForm({ ...alumnoForm, nombre: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rodríguez Ángel"
                    value={alumnoForm.apellidos}
                    onChange={(e) =>
                      setAlumnoForm({
                        ...alumnoForm,
                        apellidos: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    CURP (18 caracteres) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    placeholder="ROAJ950101HDFRNG01"
                    value={alumnoForm.curp}
                    onChange={(e) =>
                      setAlumnoForm({
                        ...alumnoForm,
                        curp: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border rounded p-2 text-sm uppercase font-mono outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="alumno@correo.com"
                    value={alumnoForm.email}
                    onChange={(e) =>
                      setAlumnoForm({ ...alumnoForm, email: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="+52 ..."
                    value={alumnoForm.telefono}
                    onChange={(e) =>
                      setAlumnoForm({ ...alumnoForm, telefono: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1b3a6b] text-white py-2.5 rounded font-bold text-sm hover:brightness-110 transition"
                  >
                    {alumnoEditandoId ? 'Guardar Cambios' : 'Registrar Alumno'}
                  </button>
                  {alumnoEditandoId && (
                    <button
                      type="button"
                      onClick={cancelarEdicionAlumno}
                      className="px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaAlumno}
                    onChange={(e) => setBusquedaAlumno(e.target.value)}
                    placeholder="Buscar por nombre, CURP o correo..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg self-stretch sm:self-auto">
                  <button
                    onClick={() => setFiltroEstadoAlumno('todos')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroEstadoAlumno === 'todos'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroEstadoAlumno('activos')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroEstadoAlumno === 'activos'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => setFiltroEstadoAlumno('desactivados')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroEstadoAlumno === 'desactivados'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Inactivos
                  </button>
                  <button
                    onClick={() => {
                      setBusquedaAlumno('')
                      setFiltroEstadoAlumno('todos')
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 ml-1"
                    title="Limpiar filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
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
                    <div className="p-8 text-center text-sm text-gray-400">
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
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                            !activo
                              ? 'bg-slate-50/70 opacity-75'
                              : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800 text-sm">
                                {a.nombre} {a.apellidos}
                              </p>
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
                              <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
                              CURP: {a.curp}
                            </p>

                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              {a.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  {a.email}
                                </span>
                              )}
                              {a.telefono && <span>| Tel: {a.telefono}</span>}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => setAlumnoModalCursos(a)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 transition"
                              title="Ver cursos vinculados"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Cursos ({countCursos})</span>
                            </button>

                            <button
                              onClick={() => iniciarEdicionAlumno(a)}
                              className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                              title="Editar alumno"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => abrirModalCambioEstado(a)}
                              className={`p-1.5 rounded transition ${
                                activo
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={activo ? 'Dar de baja' : 'Reactivar'}
                            >
                              {activo ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {alumnosFiltrados.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <div>
                      Mostrando{' '}
                      <span className="font-semibold text-gray-800">
                        {(paginaActualAlumno - 1) * registrosPorPagina + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-semibold text-gray-800">
                        {Math.min(
                          paginaActualAlumno * registrosPorPagina,
                          alumnosFiltrados.length
                        )}
                      </span>{' '}
                      de{' '}
                      <span className="font-semibold text-gray-800">
                        {alumnosFiltrados.length}
                      </span>{' '}
                      alumnos
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setPaginaActualAlumno((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={paginaActualAlumno === 1}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from(
                        { length: totalPaginasAlumno },
                        (_, i) => i + 1
                      ).map((num) => (
                        <button
                          key={num}
                          onClick={() => setPaginaActualAlumno(num)}
                          className={`w-7 h-7 rounded-lg font-semibold text-xs transition ${
                            paginaActualAlumno === num
                              ? 'bg-[#1b3a6b] text-white shadow-sm'
                              : 'bg-white border text-gray-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setPaginaActualAlumno((prev) =>
                            Math.min(prev + 1, totalPaginasAlumno)
                          )
                        }
                        disabled={paginaActualAlumno === totalPaginasAlumno}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= VISTA: CURSOS ======================= */}
        {seccion === 'cursos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#1b3a6b] flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {cursoEditandoId ? 'Modificar Curso' : 'Nuevo Curso'}
                </h2>
                {cursoEditandoId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    Modo Edición
                  </span>
                )}
              </div>

              <form onSubmit={guardarCurso} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nombre del Programa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Seguridad en Redes y CCTV"
                    value={cursoForm.nombre}
                    onChange={(e) =>
                      setCursoForm({ ...cursoForm, nombre: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Clave del Curso (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CIAE-2026-REDES"
                    value={cursoForm.clave_curso}
                    onChange={(e) =>
                      setCursoForm({
                        ...cursoForm,
                        clave_curso: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Duración en Horas *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="20"
                    value={cursoForm.duracion_horas}
                    onChange={(e) =>
                      setCursoForm({
                        ...cursoForm,
                        duracion_horas: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="curso_vigencia"
                    checked={cursoForm.tiene_vigencia}
                    onChange={(e) =>
                      setCursoForm({
                        ...cursoForm,
                        tiene_vigencia: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="curso_vigencia"
                    className="text-xs font-medium text-gray-700"
                  >
                    ¿Requiere renovación por vigencia?
                  </label>
                </div>

                {cursoForm.tiene_vigencia && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Meses de Vigencia por Defecto
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="12"
                      value={cursoForm.meses_vigencia}
                      onChange={(e) =>
                        setCursoForm({
                          ...cursoForm,
                          meses_vigencia: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm outline-none focus:border-[#1b3a6b]"
                    />
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1b3a6b] text-white py-2.5 rounded font-bold text-sm hover:brightness-110 transition"
                  >
                    {cursoEditandoId ? 'Guardar Cambios' : 'Registrar Curso'}
                  </button>
                  {cursoEditandoId && (
                    <button
                      type="button"
                      onClick={cancelarEdicionCurso}
                      className="px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaCurso}
                    onChange={(e) => setBusquedaCurso(e.target.value)}
                    placeholder="Buscar curso por nombre o clave..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg self-stretch sm:self-auto">
                  <button
                    onClick={() => setFiltroVigenciaCurso('todos')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCurso === 'todos'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroVigenciaCurso('permanente')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCurso === 'permanente'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Permanentes
                  </button>
                  <button
                    onClick={() => setFiltroVigenciaCurso('vigencia')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      filtroVigenciaCurso === 'vigencia'
                        ? 'bg-[#1b3a6b] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Con Vigencia
                  </button>
                  <button
                    onClick={() => {
                      setBusquedaCurso('')
                      setFiltroVigenciaCurso('todos')
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 ml-1"
                    title="Limpiar filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
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
                    <div className="p-8 text-center text-sm text-gray-400">
                      No se encontraron cursos con los criterios seleccionados.
                    </div>
                  ) : (
                    cursosPaginados.map((c) => {
                      const countCertificados = certificados.filter(
                        (cert) => cert.curso_id === c.id
                      ).length

                      return (
                        <div
                          key={c.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800 text-sm">
                                {c.nombre}
                              </p>
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
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {c.duracion_horas} Horas curriculares
                            </p>

                            {c.clave_curso && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <KeyRound className="w-3 h-3 text-gray-400" />
                                Clave:{' '}
                                <span className="font-mono">
                                  {c.clave_curso}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => setCursoModalAlumnos(c)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 transition"
                              title="Ver alumnos certificados"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Alumnos ({countCertificados})</span>
                            </button>

                            <button
                              onClick={() => iniciarEdicionCurso(c)}
                              className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                              title="Editar curso"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {cursosFiltrados.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <div>
                      Mostrando{' '}
                      <span className="font-semibold text-gray-800">
                        {(paginaActualCurso - 1) * registrosPorPagina + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-semibold text-gray-800">
                        {Math.min(
                          paginaActualCurso * registrosPorPagina,
                          cursosFiltrados.length
                        )}
                      </span>{' '}
                      de{' '}
                      <span className="font-semibold text-gray-800">
                        {cursosFiltrados.length}
                      </span>{' '}
                      cursos
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setPaginaActualCurso((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={paginaActualCurso === 1}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from(
                        { length: totalPaginasCurso },
                        (_, i) => i + 1
                      ).map((num) => (
                        <button
                          key={num}
                          onClick={() => setPaginaActualCurso(num)}
                          className={`w-7 h-7 rounded-lg font-semibold text-xs transition ${
                            paginaActualCurso === num
                              ? 'bg-[#1b3a6b] text-white shadow-sm'
                              : 'bg-white border text-gray-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setPaginaActualCurso((prev) =>
                            Math.min(prev + 1, totalPaginasCurso)
                          )
                        }
                        disabled={paginaActualCurso === totalPaginasCurso}
                        className="p-1.5 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= MODAL: ALUMNOS DEL CURSO ======================= */}
        {cursoModalAlumnos && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1b3a6b]" />
                  <h3 className="font-bold text-[#1b3a6b] text-base">
                    Alumnos Certificados en este Curso
                  </h3>
                </div>
                <button
                  onClick={() => setCursoModalAlumnos(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  {cursoModalAlumnos.nombre}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {cursoModalAlumnos.duracion_horas} Horas | Clave:{' '}
                  {cursoModalAlumnos.clave_curso || 'N/A'}
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {certificadosDelCurso.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">
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
                onClick={() => setCursoModalAlumnos(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ======================= MODAL: CONFIRMACIÓN CON CONTRASEÑA (ALUMNOS) ======================= */}
        {confirmacionBaja.abierto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  {confirmacionBaja.nuevoEstado ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <UserX className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 text-base">
                    {confirmacionBaja.nuevoEstado
                      ? 'Reactivar Alumno'
                      : 'Confirmar Baja Institucional'}
                  </h3>
                </div>
                <button
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
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  ¿Autorizas{' '}
                  <span className="font-semibold">
                    {confirmacionBaja.nuevoEstado ? 'reactivar' : 'dar de baja'}
                  </span>{' '}
                  al siguiente alumno?
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-bold text-gray-800">
                    {confirmacionBaja.alumno?.nombre}{' '}
                    {confirmacionBaja.alumno?.apellidos}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    CURP: {confirmacionBaja.alumno?.curp}
                  </p>
                </div>
                {!confirmacionBaja.nuevoEstado && (
                  <p className="text-xs text-amber-600 font-medium">
                    * El alumno no podrá emitir nuevas constancias y su código
                    QR reflejará el estatus inactivo.
                  </p>
                )}
              </div>

              <form onSubmit={ejecutarCambioEstado} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contraseña de Administrador
                  </label>
                  <input
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
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-[#1b3a6b]"
                  />
                </div>

                {confirmacionBaja.error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {confirmacionBaja.error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={confirmacionBaja.cargando}
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
                    className="w-1/2 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={confirmacionBaja.cargando}
                    className={`w-1/2 text-white rounded-lg py-2 text-sm font-semibold transition ${
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

        {/* ======================= MODAL: CURSOS ASIGNADOS AL ALUMNO ======================= */}
        {alumnoModalCursos && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#1b3a6b]" />
                  <h3 className="font-bold text-[#1b3a6b] text-base">
                    Cursos y Certificados
                  </h3>
                </div>
                <button
                  onClick={() => setAlumnoModalCursos(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  {alumnoModalCursos.nombre} {alumnoModalCursos.apellidos}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  CURP: {alumnoModalCursos.curp}
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {cursosDelAlumno.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">
                    Este alumno aún no cuenta con certificados o cursos
                    emitidos.
                  </p>
                ) : (
                  cursosDelAlumno.map((cert) => {
                    const cursoAsociado = cursos.find(
                      (c) => c.id === cert.curso_id
                    )
                    return (
                      <div
                        key={cert.id}
                        className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {cursoAsociado
                              ? cursoAsociado.nombre
                              : 'Curso registrado'}
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
                onClick={() => setAlumnoModalCursos(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
