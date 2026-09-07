import { useState } from 'react'
import { Link } from 'react-router-dom'
// Se importan los iconos necesarios para las opciones de los menus desplegados utilizando la libreria lucide-react, se pueden agregar o quitar iconos según se necesite
import {
  Landmark,
  Menu,
  X,
  BadgeCheck,
  Info,
  Mail,
  Users,
  LogIn,
} from 'lucide-react'

function Navbar() {
  // Controla si el menú móvil (panel deslizable) está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    {
      to: '/validacion-cursos',
      label: 'Validación de cursos',
      icon: BadgeCheck,
    },
    { to: '/contact', label: 'Contacto', icon: Mail },
    { to: '/nosotros', label: 'Nosotros', icon: Users },
    { to: '/login', label: 'Inicio de sesión', icon: LogIn },
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

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-dorado transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-guinda"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-crema z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out md:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ----------------------------------------------------------------
            ENCABEZADO DEL PANEL
        ----------------------------------------------------------------- */}
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
          {navLinks.map((link, index) => {
            const Icon = link.icon
            const isLast = index === navLinks.length - 1 // "Inicio de sesión"

            return (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)} // cierra el panel al elegir una opción
                  className={
                    isLast
                      ? // Estilo destacado tipo botón (dorado sólido) para "Inicio de sesión"
                        'flex items-center gap-3 bg-dorado text-gray-900 font-semibold text-sm rounded-lg px-4 py-3 hover:brightness-95 transition'
                      : // Estilo normal para el resto de los links
                        'flex items-center gap-3 text-sm text-gray-700 hover:text-dorado rounded-lg px-4 py-3 transition-colors duration-200'
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>
    </nav>
  )
}

export default Navbar
