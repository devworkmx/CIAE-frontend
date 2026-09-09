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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Comprobamos si el usuario tiene sesión activa
  const token = localStorage.getItem('ciae_token')

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
    <nav className="bg-crema shadow-sm w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-guinda font-bold text-xl"
          >
            <Landmark className="w-6 h-6" />
            <span>CIAE</span>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {baseLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-dorado transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {token ? (
              <div className="flex items-center gap-4 ml-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-semibold text-guinda hover:text-dorado transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-dorado text-gray-900 font-semibold text-sm rounded-lg px-4 py-2 hover:brightness-95 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Inicio de sesión</span>
              </Link>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-guinda"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Overlay oscuro móvil */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Menú Lateral Móvil */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-crema z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out md:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">CIAE</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 px-4 py-4 list-none">
          {baseLinks.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-dorado rounded-lg px-4 py-3 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              </li>
            )
          })}

          {token ? (
            <>
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-semibold text-guinda bg-gray-50 rounded-lg px-4 py-3 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel Admin</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 bg-dorado text-gray-900 font-semibold text-sm rounded-lg px-4 py-3 hover:brightness-95 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Inicio de sesión</span>
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </nav>
  )
}

export default Navbar
