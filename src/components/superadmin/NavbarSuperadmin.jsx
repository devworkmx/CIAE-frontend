import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cerrarSesion, verificarSesion } from '../../services/api'
import { Landmark, ChevronDown, LogOut, ShieldAlert } from 'lucide-react'

export default function NavbarSuperadmin() {
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

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/superadmin"
            className="flex items-center gap-2 text-white font-black text-lg tracking-tight"
          >
            <div className="w-8 h-8 rounded-xl bg-dorado flex items-center justify-center text-slate-900 shadow-xs">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-tight">CIAE</span>
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-dorado">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panel de plataforma</span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-expanded={menuAbierto}
            className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition-all"
          >
            <span className="hidden md:inline text-xs font-bold text-white truncate max-w-[140px]">
              {usuario?.nombre_completo || 'Superadmin'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                menuAbierto ? 'rotate-180' : ''
              }`}
            />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-black text-slate-900 truncate">
                  {usuario?.nombre_completo}
                </p>
                <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                  {usuario?.email}
                </p>
              </div>
              <div className="p-1">
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
    </header>
  )
}
