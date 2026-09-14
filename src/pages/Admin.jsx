import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../services/api'
import ModuloCertificados from '../components/admin/ModuloCertificados'
import ModuloAlumnos from '../components/admin/ModuloAlumnos'
import ModuloCursos from '../components/admin/ModuloCursos'
import {
  Award,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  RefreshCw,
  GraduationCap,
} from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('certificados')

  const [usuarioActual, setUsuarioActual] = useState(null)
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [certificados, setCertificados] = useState([])
  const [cargando, setCargando] = useState(true)

  const [alerta, setAlerta] = useState({
    visible: false,
    mensaje: '',
    tipo: 'exito',
  })

  const mostrarAlerta = useCallback((mensaje, tipo = 'exito') => {
    setAlerta({ visible: true, mensaje, tipo })
    setTimeout(() => {
      setAlerta({ visible: false, mensaje: '', tipo: 'exito' })
    }, 4500)
  }, [])

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const [resMe, resCursos, resAlumnos, resCerts] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, { credentials: 'include' }),
        fetch(`${API_URL}/api/cursos`, { credentials: 'include' }),
        fetch(`${API_URL}/api/alumnos`, { credentials: 'include' }),
        fetch(`${API_URL}/api/certificados`, { credentials: 'include' }),
      ])

      if (
        resMe.status === 401 ||
        resCursos.status === 401 ||
        resAlumnos.status === 401 ||
        resCerts.status === 401
      ) {
        navigate('/login')
        return
      }

      if (!resMe.ok || !resCursos.ok || !resAlumnos.ok || !resCerts.ok) {
        throw new Error('Error al sincronizar con el catálogo institucional.')
      }

      const [dataMe, dataCursos, dataAlumnos, dataCerts] = await Promise.all([
        resMe.json(),
        resCursos.json(),
        resAlumnos.json(),
        resCerts.json(),
      ])

      setUsuarioActual(dataMe)
      setCursos(dataCursos)
      setAlumnos(dataAlumnos)
      setCertificados(dataCerts)
    } catch {
      mostrarAlerta(
        'Error de conexión al cargar la información del servidor.',
        'error'
      )
    } finally {
      setCargando(false)
    }
  }, [navigate, mostrarAlerta])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Bienvenida Limpio (Sin redundancia de nombre de institución) */}
        <header className="mb-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              {/* Título de Bienvenida */}
              {cargando && !usuarioActual ? (
                <div className="h-9 w-64 bg-slate-200 rounded-xl animate-pulse" />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Hola, {usuarioActual?.nombre_completo}
                </h1>
              )}

              {/* Subtítulo limpio y funcional */}
              {cargando && !usuarioActual ? (
                <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse mt-1" />
              ) : (
                <p className="text-xs sm:text-sm text-slate-500">
                  Supervisión de folios, catálogo curricular y padrón de
                  acreditaciones.
                </p>
              )}
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <Award className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : certificados.length}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Certificados
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <Users className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : alumnos.length}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Alumnos
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <GraduationCap className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : cursos.length}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Cursos
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Notificación flotante accesible */}
        {alerta.visible && (
          <aside
            role="status"
            aria-live="polite"
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold transition-all ${
              alerta.tipo === 'exito'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {alerta.tipo === 'exito' ? (
              <CheckCircle2
                className="w-5 h-5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <XCircle
                className="w-5 h-5 text-red-600 shrink-0"
                aria-hidden="true"
              />
            )}
            <p>{alerta.mensaje}</p>
          </aside>
        )}

        {/* Navegación por pestañas */}
        <nav
          aria-label="Secciones del panel"
          className="grid grid-cols-3 sm:flex sm:items-center gap-2 mb-6 bg-slate-200/60 sm:bg-transparent p-1.5 sm:p-0 rounded-2xl"
        >
          <button
            type="button"
            onClick={() => setSeccion('certificados')}
            aria-pressed={seccion === 'certificados'}
            className={`min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'certificados'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              Certificados ({certificados.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSeccion('alumnos')}
            aria-pressed={seccion === 'alumnos'}
            className={`min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'alumnos'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Alumnos ({alumnos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSeccion('cursos')}
            aria-pressed={seccion === 'cursos'}
            className={`min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'cursos'
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Cursos ({cursos.length})</span>
          </button>
        </nav>

        {/* Contenido dinámico */}
        {cargando && certificados.length === 0 && alumnos.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm font-semibold">
            <RefreshCw
              className="w-7 h-7 mx-auto mb-3 animate-spin text-[#1b3a6b]"
              aria-hidden="true"
            />
            <span>Sincronizando información institucional...</span>
          </div>
        ) : (
          <div>
            {seccion === 'certificados' && (
              <ModuloCertificados
                cursos={cursos}
                alumnos={alumnos}
                certificados={certificados}
                onRecargar={cargarDatos}
                onAlerta={mostrarAlerta}
              />
            )}

            {seccion === 'alumnos' && (
              <ModuloAlumnos
                alumnos={alumnos}
                cursos={cursos}
                certificados={certificados}
                onRecargar={cargarDatos}
                onAlerta={mostrarAlerta}
              />
            )}

            {seccion === 'cursos' && (
              <ModuloCursos
                cursos={cursos}
                certificados={certificados}
                onRecargar={cargarDatos}
                onAlerta={mostrarAlerta}
              />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
