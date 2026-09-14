import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { verificarSesion, cerrarSesion } from '../services/api'
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
  Building2,
  Globe,
} from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Determina si el usuario está navegando dentro del panel de administración
  const estaEnAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    let cancelado = false

    async function cargarSesion() {
      try {
        const user = await verificarSesion()
        if (!cancelado) {
          setUsuario(user || null)
        }
      } catch {
        if (!cancelado) setUsuario(null)
      }
    }

    cargarSesion()

    return () => {
      cancelado = true
    }
  }, [location.pathname]) // Revalida en cada navegación

  const handleLogout = async () => {
    await cerrarSesion()
    setUsuario(null)
    setMenuOpen(false)
    navigate('/login')
  }

  const baseLinks = [
    {
      to: '/validacion-cursos',
      label: 'Validación de cursos',
      icon: BadgeCheck,
    },
    { to: '/contacto', label: 'Contacto', icon: Mail },
    { to: '/nosotros', label: 'Nosotros', icon: Users },
  ]

  // Iniciales para el avatar
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
    <header className="bg-crema border-b border-slate-200/80 shadow-xs w-full relative z-40">
      <nav
        aria-label="Navegación principal"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logotipo institucional */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-guinda font-extrabold text-xl tracking-tight py-2 px-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
              aria-label="CIAE - Inicio"
            >
              <Landmark className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span>CIAE</span>
            </Link>

            {estaEnAdmin && (
              <span className="hidden sm:inline-flex items-center bg-[#1b3a6b]/10 text-[#1b3a6b] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                Panel Administrativo
              </span>
            )}
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-5">
            {/* Solo mostrar enlaces informativos públicos si NO estamos dentro de /admin */}
            {!estaEnAdmin && (
              <ul className="flex items-center gap-1 list-none m-0 p-0 mr-1">
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
            )}

            {/* Contenedor de usuario / sesión */}
            <div
              className={`flex items-center gap-3 ${!estaEnAdmin ? 'border-l border-slate-300 pl-4' : ''}`}
            >
              {usuario ? (
                <>
                  {/* Ficha Institucional y de Usuario (Visible en todo momento) */}
                  <div className="flex items-center gap-2.5 bg-white/90 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-[#1b3a6b] text-dorado font-black text-xs flex items-center justify-center shrink-0">
                      {iniciales}
                    </div>
                    <div className="flex flex-col text-left max-w-[180px]">
                      <span className="text-xs font-bold text-slate-900 truncate leading-tight flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#1b3a6b] shrink-0" />
                        {usuario.tenant?.nombre || 'Mi Institución'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate leading-tight">
                        {usuario.nombre_completo}
                      </span>
                    </div>
                  </div>

                  {/* Botón dinámico: si está en admin va a la web, si está en la web va al panel */}
                  {estaEnAdmin ? (
                    <Link
                      to="/"
                      className="min-h-[40px] inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <Globe
                        className="w-3.5 h-3.5 text-slate-500"
                        aria-hidden="true"
                      />
                      <span>Ver Sitio Web</span>
                    </Link>
                  ) : (
                    <Link
                      to="/admin"
                      className="min-h-[40px] inline-flex items-center gap-2 bg-[#1b3a6b] text-white hover:bg-[#142c52] px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                    >
                      <LayoutDashboard
                        className="w-3.5 h-3.5 text-dorado"
                        aria-hidden="true"
                      />
                      <span>Panel</span>
                    </Link>
                  )}

                  {/* Botón Salir */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión de administrador"
                    className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100/90 px-3 py-2 rounded-lg transition-colors border border-red-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    <LogOut
                      className="w-3.5 h-3.5 text-red-600"
                      aria-hidden="true"
                    />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="min-h-[44px] inline-flex items-center gap-2 bg-dorado text-slate-950 font-bold text-sm rounded-lg px-4 py-2 hover:brightness-95 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Iniciar sesión</span>
                </Link>
              )}
            </div>
          </div>

          {/* Botón hamburguesa móvil */}
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

      {/* Overlay móvil */}
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
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-crema z-50 shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
          {/* Tarjeta de Sesión Activa en Menú Móvil */}
          {usuario && (
            <div className="mb-5 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b3a6b] text-dorado font-black text-sm flex items-center justify-center shrink-0">
                  {iniciales}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#1b3a6b] shrink-0" />
                    <span>{usuario.tenant?.nombre || 'Mi Institución'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {usuario.nombre_completo}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {usuario ? (
                <div className="flex flex-col gap-2.5">
                  {estaEnAdmin ? (
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="min-h-[48px] flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-4 py-3"
                    >
                      <Globe className="w-4 h-4 text-slate-600" />
                      <span>Ver Sitio Web</span>
                    </Link>
                  ) : (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="min-h-[48px] flex items-center justify-center gap-2.5 text-sm font-bold text-white bg-[#1b3a6b] hover:bg-[#142c52] rounded-xl px-4 py-3 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
                    >
                      <LayoutDashboard
                        className="w-5 h-5 text-dorado"
                        aria-hidden="true"
                      />
                      <span>Panel de Control</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="min-h-[48px] w-full flex items-center justify-center gap-2 text-sm font-bold text-red-800 bg-red-100/80 hover:bg-red-200/90 rounded-xl px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    <LogOut
                      className="w-4 h-4 text-red-700"
                      aria-hidden="true"
                    />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[48px] flex items-center justify-center gap-2 bg-dorado text-slate-950 font-bold text-sm rounded-xl px-4 py-3 hover:brightness-95 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
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
