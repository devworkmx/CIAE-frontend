import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../services/api'
import ModuloCertificados from '../components/admin/ModuloCertificados'
import ModuloAlumnos from '../components/admin/ModuloAlumnos'
import ModuloCursos from '../components/admin/ModuloCursos'
import {
  Award,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react'

export default function Admin() {
  const [seccion, setSeccion] = useState('certificados')
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [certificados, setCertificados] = useState([])

  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    mensaje: '',
    tipo: 'exito',
  })

  function lanzarAlerta(mensaje, tipo = 'exito') {
    setNotificacion({ mostrar: true, mensaje, tipo })
    setTimeout(
      () => setNotificacion((prev) => ({ ...prev, mostrar: false })),
      4500
    )
  }

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
    } catch {
      lanzarAlerta('Error al cargar datos desde el servidor', 'error')
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8 relative">
      {/* Toast Notificación Accesible */}
      {notificacion.mostrar && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 animate-bounce"
        >
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
              type="button"
              onClick={() =>
                setNotificacion((prev) => ({ ...prev, mostrar: false }))
              }
              aria-label="Cerrar notificación"
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-[#1b3a6b]">
            Panel de Control Institucional
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de emisión académica, vigencias y control de folios
          </p>
        </header>

        {/* Navegación por pestañas */}
        <nav aria-label="Secciones del panel" className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSeccion('certificados')}
            aria-pressed={seccion === 'certificados'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition focus:ring-2 focus:ring-[#1b3a6b] ${
              seccion === 'certificados'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <Award className="w-4 h-4" /> Certificados
          </button>
          <button
            type="button"
            onClick={() => setSeccion('alumnos')}
            aria-pressed={seccion === 'alumnos'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition focus:ring-2 focus:ring-[#1b3a6b] ${
              seccion === 'alumnos'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <Users className="w-4 h-4" /> Alumnos
          </button>
          <button
            type="button"
            onClick={() => setSeccion('cursos')}
            aria-pressed={seccion === 'cursos'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition focus:ring-2 focus:ring-[#1b3a6b] ${
              seccion === 'cursos'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-white text-gray-600 border'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Cursos
          </button>
        </nav>

        {seccion === 'certificados' && (
          <ModuloCertificados
            cursos={cursos}
            alumnos={alumnos}
            certificados={certificados}
            onRecargar={cargarTodo}
            onAlerta={lanzarAlerta}
          />
        )}

        {seccion === 'alumnos' && (
          <ModuloAlumnos
            alumnos={alumnos}
            cursos={cursos}
            certificados={certificados}
            onRecargar={cargarTodo}
            onAlerta={lanzarAlerta}
          />
        )}

        {seccion === 'cursos' && (
          <ModuloCursos
            cursos={cursos}
            certificados={certificados}
            onRecargar={cargarTodo}
            onAlerta={lanzarAlerta}
          />
        )}
      </div>
    </main>
  )
}
