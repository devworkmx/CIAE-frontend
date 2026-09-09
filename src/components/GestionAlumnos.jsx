import { useState, useMemo } from 'react'
import {
  UserPlus,
  Search,
  RotateCcw,
  Pencil,
  UserX,
  UserCheck,
  BookOpen,
  X,
  GraduationCap,
  Mail,
  Fingerprint,
} from 'lucide-react'

export default function GestionAlumnos() {
  // Estado base de alumnos (reemplazar o sincronizar con tu llamada a la API)
  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      nombre: 'José de Jesús Rodríguez Ángel',
      correo: 'j.rodriguez@facultad.mx',
      curp: 'ROAJ950101HDFRNG01',
      telefono: '55 4892 0192',
      activo: true,
      cursos: [
        {
          folio: 'CIAE-SF-2026-00001',
          nombre: 'Seguridad en Redes y CCTV',
          fecha: '2026-03-15',
          vigencia: 'Permanente',
        },
        {
          folio: 'CIAE-SF-2026-00004',
          nombre: 'Administración de Servidores Linux',
          fecha: '2026-04-10',
          vigencia: '2 años',
        },
      ],
    },
    {
      id: 2,
      nombre: 'María Fernanda Salazar Rangel',
      correo: 'm.salazar@instituto.edu.mx',
      curp: 'SARM920814MDFRLN05',
      telefono: '55 1234 5678',
      activo: true,
      cursos: [
        {
          folio: 'CIAE-SF-2026-00012',
          nombre: 'Auditoría de Sistemas',
          fecha: '2026-05-02',
          vigencia: '1 año',
        },
      ],
    },
    {
      id: 3,
      nombre: 'Alejandro Morales Navarro',
      correo: 'a.morales@tecnologia.org',
      curp: 'MONA891122HDFVRL08',
      telefono: '55 9876 5432',
      activo: false,
      cursos: [],
    },
  ])

  // Filtros de búsqueda y tabs de estado
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos') // 'todos' | 'activos' | 'desactivados'

  // Formulario: si alumnoEditando es null -> modo Crear; si tiene datos -> modo Edición
  const [alumnoEditando, setAlumnoEditando] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    curp: '',
    telefono: '',
  })

  // Modal para ver cursos asignados
  const [alumnoSeleccionadoCursos, setAlumnoSeleccionadoCursos] = useState(null)

  // Filtrado reactivo en memoria (busca por Nombre, CURP o Correo)
  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((alumno) => {
      const termino = busqueda.toLowerCase().trim()
      const coincideBusqueda =
        alumno.nombre.toLowerCase().includes(termino) ||
        alumno.curp.toLowerCase().includes(termino) ||
        alumno.correo.toLowerCase().includes(termino)

      const coincideEstado =
        filtroEstado === 'todos'
          ? true
          : filtroEstado === 'activos'
            ? alumno.activo
            : !alumno.activo

      return coincideBusqueda && coincideEstado
    })
  }, [alumnos, busqueda, filtroEstado])

  // Manejo de inputs del formulario
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Guardar (Crear o Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (alumnoEditando) {
      // Actualizar alumno existente
      setAlumnos((prev) =>
        prev.map((item) =>
          item.id === alumnoEditando.id ? { ...item, ...form } : item
        )
      )
      setAlumnoEditando(null)
    } else {
      // Crear nuevo alumno
      const nuevo = {
        id: Date.now(),
        ...form,
        activo: true,
        cursos: [],
      }
      setAlumnos((prev) => [nuevo, ...prev])
    }

    setForm({ nombre: '', correo: '', curp: '', telefono: '' })
  }

  // Activar edición de un alumno
  const iniciarEdicion = (alumno) => {
    setAlumnoEditando(alumno)
    setForm({
      nombre: alumno.nombre,
      correo: alumno.correo,
      curp: alumno.curp,
      telefono: alumno.telefono || '',
    })
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setAlumnoEditando(null)
    setForm({ nombre: '', correo: '', curp: '', telefono: '' })
  }

  // Toggle alta / baja
  const toggleEstadoAlumno = (id) => {
    setAlumnos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, activo: !a.activo } : a))
    )
  }

  // Obtener iniciales para el avatar
  const getIniciales = (nombre) => {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Gestión Institucional / Alumnado
          </span>
          <h1 className="text-2xl font-bold text-gray-900">
            Control y Registro de Estudiantes
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
            Total Alumnos: {alumnos.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================== COLUMNA IZQ: FORMULARIO CRUD ===================== */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-dorado" />
              {alumnoEditando ? 'Modificar Alumno' : 'Registrar Alumno'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-50 text-yellow-800 rounded">
              {alumnoEditando ? 'Edición' : 'Alta Rápida'}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            {alumnoEditando
              ? 'Edite la ficha académica y actualice los datos de contacto del estudiante.'
              : 'Complete la ficha académica del estudiante para habilitar acreditación y emisión de folios QR.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre Completo del Alumno *
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleInputChange}
                placeholder="Ej. José de Jesús Rodríguez"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-dorado focus:border-dorado outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                required
                value={form.correo}
                onChange={handleInputChange}
                placeholder="alumno@institucion.edu.mx"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-dorado focus:border-dorado outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  CURP *
                </label>
                <input
                  type="text"
                  name="curp"
                  required
                  maxLength={18}
                  value={form.curp}
                  onChange={(e) =>
                    setForm({ ...form, curp: e.target.value.toUpperCase() })
                  }
                  placeholder="CURP (18 caract.)"
                  className="w-full text-sm font-mono border border-gray-300 rounded-lg px-3 py-2 uppercase focus:ring-1 focus:ring-dorado focus:border-dorado outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Teléfono / Móvil
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleInputChange}
                  placeholder="+52 ..."
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-dorado focus:border-dorado outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 bg-dorado hover:brightness-95 text-gray-900 font-semibold text-sm py-2.5 px-4 rounded-lg transition"
              >
                {alumnoEditando ? 'Actualizar Datos' : 'Guardar Alumno'}
              </button>

              {alumnoEditando && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-3 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ===================== COLUMNA DER: LISTADO + FILTROS ===================== */}
        <div className="lg:col-span-8 space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, CURP o correo..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-dorado"
              />
            </div>

            {/* Selector de Estado */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg self-stretch sm:self-auto">
              <button
                onClick={() => setFiltroEstado('todos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  filtroEstado === 'todos'
                    ? 'bg-guinda text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroEstado('activos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  filtroEstado === 'activos'
                    ? 'bg-guinda text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFiltroEstado('desactivados')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  filtroEstado === 'desactivados'
                    ? 'bg-guinda text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inactivos
              </button>
              <button
                onClick={() => {
                  setBusqueda('')
                  setFiltroEstado('todos')
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 ml-1"
                title="Limpiar filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tarjeta de Directorio de Alumnos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <span>Estudiante & Contacto</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y divide-gray-100">
              {alumnosFiltrados.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">
                  No se encontraron alumnos registrados que coincidan con la
                  búsqueda.
                </div>
              ) : (
                alumnosFiltrados.map((alumno) => (
                  <div
                    key={alumno.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      !alumno.activo
                        ? 'bg-gray-50/70 opacity-75'
                        : 'hover:bg-amber-50/20'
                    }`}
                  >
                    {/* Datos del estudiante */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dorado/20 text-gray-900 font-bold flex items-center justify-center text-sm shrink-0">
                        {getIniciales(alumno.nombre)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-900">
                            {alumno.nombre}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              alumno.activo
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {alumno.activo ? 'ACTIVO' : 'DADO DE BAJA'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono">{alumno.curp}</span>
                        </p>

                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{alumno.correo}</span>
                        </p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* Botón Ver Cursos */}
                      <button
                        onClick={() => setAlumnoSeleccionadoCursos(alumno)}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 transition"
                        title="Ver cursos asignados"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Cursos ({alumno.cursos.length})</span>
                      </button>

                      {/* Botón Editar */}
                      <button
                        onClick={() => iniciarEdicion(alumno)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        title="Editar alumno"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Botón Baja / Reactivar */}
                      <button
                        onClick={() => toggleEstadoAlumno(alumno.id)}
                        className={`p-1.5 rounded-lg transition ${
                          alumno.activo
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={
                          alumno.activo ? 'Dar de baja' : 'Reactivar alumno'
                        }
                      >
                        {alumno.activo ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MODAL: CURSOS ASIGNADOS ===================== */}
      {alumnoSeleccionadoCursos && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-dorado" />
                <h3 className="font-bold text-gray-900 text-base">
                  Cursos del Alumno
                </h3>
              </div>
              <button
                onClick={() => setAlumnoSeleccionadoCursos(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {alumnoSeleccionadoCursos.nombre}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                CURP: {alumnoSeleccionadoCursos.curp}
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {alumnoSeleccionadoCursos.cursos.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-4 text-center">
                  Este alumno aún no tiene cursos ni certificados vinculados.
                </p>
              ) : (
                alumnoSeleccionadoCursos.cursos.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {c.nombre}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        Folio: {c.folio}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                      {c.vigencia}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setAlumnoSeleccionadoCursos(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
