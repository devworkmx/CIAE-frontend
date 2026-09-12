import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL, getAuthHeaders } from '../services/api'
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
} from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('certificados') // 'certificados' | 'alumnos' | 'cursos'

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
    const token = localStorage.getItem('ciae_token')
    if (!token) {
      navigate('/login')
      return
    }

    setCargando(true)
    try {
      const [resCursos, resAlumnos, resCerts] = await Promise.all([
        fetch(`${API_URL}/api/cursos`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/alumnos`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/certificados`, { headers: getAuthHeaders() }),
      ])

      if (
        resCursos.status === 401 ||
        resAlumnos.status === 401 ||
        resCerts.status === 401
      ) {
        localStorage.removeItem('ciae_token')
        navigate('/login')
        return
      }

      if (!resCursos.ok || !resAlumnos.ok || !resCerts.ok) {
        throw new Error('Error al sincronizar con el catálogo institucional.')
      }

      const [dataCursos, dataAlumnos, dataCerts] = await Promise.all([
        resCursos.json(),
        resAlumnos.json(),
        resCerts.json(),
      ])

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
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado del Panel */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6b] tracking-tight">
              Panel de Control Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Gestión de emisión académica, vigencias y control de folios
              oficiales.
            </p>
          </div>

          {/* <button
            type="button"
            onClick={cargarDatos}
            disabled={cargando}
            aria-label="Actualizar datos del panel"
            className="min-h-[44px] self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#1b3a6b] bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Sincronizar</span>
          </button> */}
        </header>

        {/* Notificación flotante accesible */}
        {alerta.visible && (
          <aside
            role="status"
            aria-live="polite"
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold transition-all ${
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

        {/* ================================================================
            NAVEGACIÓN POR PESTAÑAS (100% RESPONSIVA - NO DESBORDA EN MÓVIL)
        ================================================================ */}
        <nav
          aria-label="Secciones del panel"
          className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-3 mb-6 bg-slate-200/60 sm:bg-transparent p-1 sm:p-0 rounded-xl"
        >
          <button
            type="button"
            onClick={() => setSeccion('certificados')}
            aria-pressed={seccion === 'certificados'}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'certificados'
                ? 'bg-[#1b3a6b] text-white shadow-xs'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Certificados</span>
          </button>

          <button
            type="button"
            onClick={() => setSeccion('alumnos')}
            aria-pressed={seccion === 'alumnos'}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'alumnos'
                ? 'bg-[#1b3a6b] text-white shadow-xs'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Alumnos</span>
          </button>

          <button
            type="button"
            onClick={() => setSeccion('cursos')}
            aria-pressed={seccion === 'cursos'}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              seccion === 'cursos'
                ? 'bg-[#1b3a6b] text-white shadow-xs'
                : 'bg-transparent sm:bg-white text-slate-700 hover:text-slate-950 sm:border sm:border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Cursos</span>
          </button>
        </nav>

        {/* ================================================================
            CONTENIDO DINÁMICO SEGÚN PESTAÑA SELECCIONADA
        ================================================================ */}
        {cargando && certificados.length === 0 && alumnos.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm font-medium">
            <RefreshCw
              className="w-6 h-6 mx-auto mb-2 animate-spin text-[#1b3a6b]"
              aria-hidden="true"
            />
            <span>Cargando padrón institucional...</span>
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
