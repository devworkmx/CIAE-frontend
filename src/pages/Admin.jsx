import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../services/api'
import { Plus, Award, Users, BookOpen, Download, Edit2, X } from 'lucide-react'

function Admin() {
  const [seccion, setSeccion] = useState('certificados')
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [certificados, setCertificados] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [errorDescarga, setErrorDescarga] = useState('')

  // Formularios de Creación
  const [cursoForm, setCursoForm] = useState({
    nombre: '',
    duracion_horas: 20,
    clave_curso: '',
    tiene_vigencia: false,
    meses_vigencia: 12,
  })

  const [alumnoForm, setAlumnoForm] = useState({
    nombre: '',
    apellidos: '',
    curp: '',
    email: '',
    telefono: '',
  })

  const [certForm, setCertForm] = useState({
    folio_manual: '',
    curso_id: '',
    alumno_id: '',
    instructor: '',
    tiene_vigencia: false,
    fecha_vigencia: '',
    calificacion: '100',
  })

  // Modal de Edición
  const [modalEdicion, setModalEdicion] = useState(null) // 'curso' | 'alumno' | 'certificado' | null
  const [itemEditando, setItemEditando] = useState({})

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
      setErrorDescarga('')
      const currentOrigin = encodeURIComponent(window.location.origin)
      const res = await fetch(
        `${API_URL}/api/certificados/${certId}/qr?base_url=${currentOrigin}`,
        { headers: getAuthHeaders() }
      )
      if (!res.ok) {
        setErrorDescarga('Error al descargar el código QR.')
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
      setErrorDescarga('Error al procesar la descarga.')
    }
  }

  // --- CREAR REGISTROS ---
  async function crearCurso(e) {
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/cursos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cursoForm),
    })
    if (res.ok) {
      setMensaje('Curso registrado con éxito')
      setCursoForm({
        nombre: '',
        duracion_horas: 20,
        clave_curso: '',
        tiene_vigencia: false,
        meses_vigencia: 12,
      })
      cargarTodo()
    }
  }

  async function crearAlumno(e) {
    e.preventDefault()
    const body = {
      ...alumnoForm,
      email: alumnoForm.email.trim() === '' ? null : alumnoForm.email.trim(),
      telefono:
        alumnoForm.telefono.trim() === '' ? null : alumnoForm.telefono.trim(),
    }
    const res = await fetch(`${API_URL}/api/alumnos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setMensaje('Alumno registrado con éxito')
      setAlumnoForm({
        nombre: '',
        apellidos: '',
        curp: '',
        email: '',
        telefono: '',
      })
      cargarTodo()
    } else {
      const err = await res.json()
      alert(err.detail || 'Error al registrar alumno')
    }
  }

  async function emitirCertificado(e) {
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
      calificacion: certForm.calificacion,
    }
    const res = await fetch(`${API_URL}/api/certificados`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setMensaje('Certificado emitido con éxito')
      setCertForm({
        folio_manual: '',
        curso_id: '',
        alumno_id: '',
        instructor: '',
        tiene_vigencia: false,
        fecha_vigencia: '',
        calificacion: '100',
      })
      cargarTodo()
    } else {
      const err = await res.json()
      alert(err.detail || 'Error al emitir certificado')
    }
  }

  // --- GUARDAR EDICIÓN (PATCH) ---
  async function guardarEdicion(e) {
    e.preventDefault()
    let endpoint = ''
    if (modalEdicion === 'curso')
      endpoint = `${API_URL}/api/cursos/${itemEditando.id}`
    if (modalEdicion === 'alumno')
      endpoint = `${API_URL}/api/alumnos/${itemEditando.id}`
    if (modalEdicion === 'certificado')
      endpoint = `${API_URL}/api/certificados/${itemEditando.id}`

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemEditando),
    })

    if (res.ok) {
      setMensaje('Registro corregido con éxito')
      setModalEdicion(null)
      cargarTodo()
    } else {
      const err = await res.json()
      alert(err.detail || 'Error al actualizar registro')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1b3a6b]">
              Panel de Control Institucional
            </h1>
            <p className="text-sm text-gray-500">
              Gestión de emisión académica, vigencias y control de folios
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('ciae_token')
              window.location.href = '/login'
            }}
            className="text-sm text-red-600 font-semibold hover:underline"
          >
            Cerrar Sesión
          </button>
        </div>

        {mensaje && (
          <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            {mensaje}
          </div>
        )}
        {errorDescarga && (
          <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {errorDescarga}
          </div>
        )}

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

        {/* VISTA: CERTIFICADOS */}
        {seccion === 'certificados' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Emitir Certificado
              </h2>
              <form onSubmit={emitirCertificado} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Folio Manual Único
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CIAE-2026-001"
                    value={certForm.folio_manual}
                    onChange={(e) =>
                      setCertForm({ ...certForm, folio_manual: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Instructor / Emisor
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre del instructor"
                    value={certForm.instructor}
                    onChange={(e) =>
                      setCertForm({ ...certForm, instructor: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Curso
                  </label>
                  <select
                    required
                    value={certForm.curso_id}
                    onChange={(e) =>
                      setCertForm({ ...certForm, curso_id: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm"
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
                    Alumno
                  </label>
                  <select
                    required
                    value={certForm.alumno_id}
                    onChange={(e) =>
                      setCertForm({ ...certForm, alumno_id: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="">Selecciona un alumno</option>
                    {alumnos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre} {a.apellidos} ({a.curp})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="tiene_vigencia"
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
                    htmlFor="tiene_vigencia"
                    className="text-xs font-medium text-gray-700"
                  >
                    ¿Curso con vigencia?
                  </label>
                </div>
                {certForm.tiene_vigencia && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Fecha de Expiración
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
                      className="w-full border rounded p-2 text-sm"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-dorado text-[#0f1f3d] py-2 rounded font-bold text-sm hover:brightness-95 transition"
                >
                  Generar Certificado
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4">
                Certificados Emitidos
              </h2>
              <div className="space-y-3">
                {certificados.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {cert.alumno_nombre}
                      </p>
                      <p className="text-xs text-[#1b3a6b] font-semibold">
                        Folio: {cert.folio_manual} | Instructor:{' '}
                        {cert.instructor}
                      </p>
                      <p className="text-xs text-gray-500">
                        {cert.tiene_vigencia
                          ? `Vence: ${cert.fecha_vigencia}`
                          : 'Vigencia: Permanente'}
                      </p>
                      <a
                        href={`${originWeb}/validar/${cert.token_publico}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Abrir validación pública
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setItemEditando(cert)
                          setModalEdicion('certificado')
                        }}
                        className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                        title="Corregir datos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          descargarQrAutenticado(cert.id, cert.alumno_nombre)
                        }
                        className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded text-xs font-bold text-[#1b3a6b] hover:bg-slate-200 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar QR
                      </button>
                    </div>
                  </div>
                ))}
                {certificados.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No hay certificados registrados.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA: ALUMNOS */}
        {seccion === 'alumnos' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Alta de Alumno
              </h2>
              <form onSubmit={crearAlumno} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre(s)"
                  required
                  value={alumnoForm.nombre}
                  onChange={(e) =>
                    setAlumnoForm({ ...alumnoForm, nombre: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Apellidos"
                  required
                  value={alumnoForm.apellidos}
                  onChange={(e) =>
                    setAlumnoForm({ ...alumnoForm, apellidos: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="CURP (18 caracteres)"
                  required
                  value={alumnoForm.curp}
                  onChange={(e) =>
                    setAlumnoForm({ ...alumnoForm, curp: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm uppercase"
                />
                <input
                  type="email"
                  placeholder="Correo institucional (opcional)"
                  value={alumnoForm.email}
                  onChange={(e) =>
                    setAlumnoForm({ ...alumnoForm, email: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={alumnoForm.telefono}
                  onChange={(e) =>
                    setAlumnoForm({ ...alumnoForm, telefono: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1b3a6b] text-white py-2 rounded font-bold text-sm hover:brightness-110 transition"
                >
                  Registrar Alumno
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4">
                Padrón de Alumnos
              </h2>
              <div className="divide-y text-sm">
                {alumnos.map((a) => (
                  <div
                    key={a.id}
                    className="py-2.5 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {a.nombre} {a.apellidos}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        CURP: {a.curp} {a.telefono && `| Tel: ${a.telefono}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setItemEditando(a)
                        setModalEdicion('alumno')
                      }}
                      className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                      title="Editar datos del alumno"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISTA: CURSOS */}
        {seccion === 'cursos' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nuevo Curso
              </h2>
              <form onSubmit={crearCurso} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre del programa"
                  required
                  value={cursoForm.nombre}
                  onChange={(e) =>
                    setCursoForm({ ...cursoForm, nombre: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Clave (ej. CIAE-2026)"
                  value={cursoForm.clave_curso}
                  onChange={(e) =>
                    setCursoForm({ ...cursoForm, clave_curso: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Duración en horas"
                  required
                  value={cursoForm.duracion_horas}
                  onChange={(e) =>
                    setCursoForm({
                      ...cursoForm,
                      duracion_horas: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1b3a6b] text-white py-2 rounded font-bold text-sm hover:brightness-110 transition"
                >
                  Registrar Curso
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-[#1b3a6b] mb-4">
                Catálogo de Cursos
              </h2>
              <div className="divide-y text-sm">
                {cursos.map((c) => (
                  <div
                    key={c.id}
                    className="py-2.5 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{c.nombre}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {c.duracion_horas} hrs{' '}
                        {c.clave_curso && `| Clave: ${c.clave_curso}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setItemEditando(c)
                        setModalEdicion('curso')
                      }}
                      className="p-1.5 text-gray-600 hover:text-[#1b3a6b] rounded hover:bg-slate-100 transition"
                      title="Editar curso"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL UNIVERSAL DE EDICIÓN */}
        {modalEdicion && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setModalEdicion(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-[#1b3a6b] mb-4">
                Corregir Registro
              </h3>

              <form onSubmit={guardarEdicion} className="space-y-3">
                {modalEdicion === 'alumno' && (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={itemEditando.nombre || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Apellidos"
                      value={itemEditando.apellidos || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          apellidos: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="CURP"
                      value={itemEditando.curp || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          curp: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full border rounded p-2 text-sm uppercase"
                    />
                    <input
                      type="email"
                      placeholder="Correo"
                      value={itemEditando.email || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          email: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={itemEditando.telefono || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          telefono: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                  </>
                )}

                {modalEdicion === 'curso' && (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del curso"
                      value={itemEditando.nombre || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Horas"
                      value={itemEditando.duracion_horas || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          duracion_horas: parseInt(e.target.value),
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Clave"
                      value={itemEditando.clave_curso || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          clave_curso: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                  </>
                )}

                {modalEdicion === 'certificado' && (
                  <>
                    <label className="block text-xs font-semibold text-gray-600">
                      Folio Manual
                    </label>
                    <input
                      type="text"
                      value={itemEditando.folio_manual || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          folio_manual: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <label className="block text-xs font-semibold text-gray-600">
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={itemEditando.instructor || ''}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          instructor: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 text-sm"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="edit_vigencia"
                        checked={itemEditando.tiene_vigencia || false}
                        onChange={(e) =>
                          setItemEditando({
                            ...itemEditando,
                            tiene_vigencia: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor="edit_vigencia" className="text-xs">
                        ¿Tiene vigencia?
                      </label>
                    </div>
                    {itemEditando.tiene_vigencia && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600">
                          Fecha de Expiración
                        </label>
                        <input
                          type="date"
                          value={itemEditando.fecha_vigencia || ''}
                          onChange={(e) =>
                            setItemEditando({
                              ...itemEditando,
                              fecha_vigencia: e.target.value,
                            })
                          }
                          className="w-full border rounded p-2 text-sm"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalEdicion(null)}
                    className="w-1/2 border rounded py-2 text-sm font-semibold text-gray-600 hover:bg-slate-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#1b3a6b] text-white rounded py-2 text-sm font-semibold hover:brightness-110 transition"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
