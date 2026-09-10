import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Landmark,
  Menu,
  X,
  BadgeCheck,
  Mail,
  Users,
  LogIn,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('ciae_token') : null

  const handleLogout = () => {
    localStorage.removeItem('ciae_token')
    setMenuOpen(false)
    navigate('/login')
  }

  const baseLinks = [
    {
      to: '/validacion-cursos',
      label: 'Validación de cursos',
      icon: BadgeCheck,
    },
    { to: '/contact', label: 'Contacto', icon: Mail },
    { to: '/nosotros', label: 'Nosotros', icon: Users },
  ]

  return (
    <header className="bg-crema border-b border-slate-200/80 shadow-sm w-full relative z-40">
      <nav
        aria-label="Navegación principal"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logotipo institucional */}
          <Link
            to="/"
            className="flex items-center gap-2 text-guinda font-extrabold text-xl tracking-tight py-2 px-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
            aria-label="CIAE - Inicio"
          >
            <Landmark className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>CIAE</span>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {baseLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block min-h-[44px] px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:text-guinda transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {token ? (
              <div className="flex items-center gap-3 ml-2 border-l border-slate-300 pl-4">
                <Link
                  to="/admin"
                  className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-guinda hover:text-guinda/80 px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  <span>Panel Admin</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-[44px] inline-flex items-center gap-2 bg-red-100/80 text-red-800 hover:bg-red-200/90 px-3.5 py-2 rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="min-h-[44px] inline-flex items-center gap-2 bg-dorado text-slate-950 font-bold text-sm rounded-lg px-4 py-2 hover:brightness-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Iniciar sesión</span>
              </Link>
            )}
          </div>

          {/* Botón hamburguesa móvil con tamaño táctil accesible (44x44 px) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="menu-lateral-movil"
            aria-label="Abrir menú de navegación"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-guinda rounded-lg hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Overlay móvil accesible */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Menú Lateral Móvil */}
      <aside
        id="menu-lateral-movil"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-menu-movil"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-crema z-50 shadow-2xl border-l border-slate-200 flex flex-col
          transform transition-transform duration-300 ease-in-out md:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <span
            id="titulo-menu-movil"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            Menú de Navegación
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú de navegación"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-200/70 hover:bg-slate-300 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <X className="w-5 h-5 text-slate-900" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {baseLinks.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="min-h-[48px] flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-guinda hover:bg-black/5 rounded-xl px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
                  >
                    <Icon
                      className="w-5 h-5 text-slate-600"
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}

            <li className="pt-4 border-t border-slate-200 mt-2">
              {token ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="min-h-[48px] flex items-center gap-3 text-sm font-bold text-guinda bg-slate-100/90 rounded-xl px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
                  >
                    <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                    <span>Panel de Control</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="min-h-[48px] w-full flex items-center gap-3 text-sm font-bold text-red-800 bg-red-100/70 hover:bg-red-200/80 rounded-xl px-4 py-3 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
                  >
                    <LogOut
                      className="w-5 h-5 text-red-700"
                      aria-hidden="true"
                    />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[48px] flex items-center justify-center gap-2 bg-dorado text-slate-950 font-bold text-sm rounded-xl px-4 py-3 hover:brightness-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  <span>Iniciar sesión</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </header>
  )
}
