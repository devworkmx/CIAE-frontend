import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cerrarSesion, verificarSesion } from '../../services/api'
import {
  Landmark,
  Building2,
  ChevronDown,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react'

export default function NavbarAdmin() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    let cancelado = false
    verificarSesion().then((user) => {
      if (!cancelado) setUsuario(user || null)
    })
    return () => {
      cancelado = true
    }
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickAfuera(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickAfuera)
    return () => document.removeEventListener('mousedown', handleClickAfuera)
  }, [])

  const handleLogout = async () => {
    await cerrarSesion()
    navigate('/login')
  }

  const iniciales = usuario?.nombre_completo
    ? usuario.nombre_completo
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Identidad / Workspace */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-slate-900 font-black text-lg tracking-tight focus-visible:ring-2 focus-visible:ring-azulmarino rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1b3a6b] flex items-center justify-center text-dorado shadow-xs">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-tight">CIAE</span>
          </Link>

          <span className="text-slate-300">/</span>

          {/* Badge de Organización / Tenant */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/60 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-[#1b3a6b]" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {usuario?.tenant?.nombre || 'Cargando institución...'}
            </span>
          </div>
        </div>

        {/* Acciones y Perfil */}
        <div className="flex items-center gap-3">
          {/* Enlace rápido a la herramienta pública de validación */}
          <Link
            to="/validacion-cursos"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Validador público</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Menú de Perfil desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-expanded={menuAbierto}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 transition-all focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#1b3a6b] text-dorado font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {iniciales}
              </div>
              <div className="hidden md:flex flex-col text-left max-w-[130px]">
                <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {usuario?.nombre_completo || 'Administrador'}
                </span>
                <span className="text-[10px] text-slate-500 capitalize leading-tight">
                  {usuario?.rol || 'admin'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  menuAbierto ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown flotante */}
            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Info completa */}
                <div className="p-3 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {usuario?.nombre_completo}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                    {usuario?.email}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Institución</span>
                    <span className="text-[#1b3a6b]">
                      {usuario?.tenant?.nombre}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="p-1">
                  <Link
                    to="/validacion-cursos"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMenuAbierto(false)}
                    className="sm:hidden flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-500" />
                      Validador público
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
