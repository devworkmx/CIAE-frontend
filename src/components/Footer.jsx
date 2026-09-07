import { Link } from 'react-router-dom'
import { Landmark, Globe, Share2, Phone, Mail, MapPin } from 'lucide-react'
function Footer() {
  // COLUMNA "ENLACES RÁPIDOS" arreglo para acceso rapido
  const enlacesRapidos = [
    { to: '/validacion-cursos', label: 'Validación de cursos' },
    { to: '/nosotros', label: 'Sobre nosotros' },
    { to: '/Contact', label: 'Contacto' },
  ]

  // COLUMNA "INSTITUCIONAL" arreglo para acceso rapido

  const institucional = [
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/privacidad', label: 'Privacidad' },
    { to: '/terminos', label: 'Términos de Servicio' },
  ]

  return (
    <footer className="bg-azulmarino text-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Utilizando Grid divide la pantalla en 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* COLUMNA 1: LOGO + DESCRIPCIÓN */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-dorado font-bold text-xl mb-4"
            >
              <Landmark className="w-6 h-6" />
              <span>CIAE</span>
            </Link>
            {/* Texto descriptivo institucional, edítalo libremente */}
            <p className="text-sm text-gray-300 leading-relaxed">
              Centro de Innovación y Aprendizaje Estratégico. Forjando el futuro
              de la educación mediante el rigor institucional.
            </p>
          </div>

          {/* COLUMNA 2: ENLACES RÁPIDOS */}
          <nav aria-label="Enlaces rápidos">
            <h2 className="text-dorado font-semibold text-sm tracking-wide mb-4">
              ENLACES RÁPIDOS
            </h2>
            <ul className="flex flex-col gap-3 list-none">
              {enlacesRapidos.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-crema hover:text-dorado transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/*Columna 3  llama a la constante Institucional*/}
          <nav aria-label="Institucional">
            <h2 className="text-dorado font-semibold text-sm tracking-wide mb-4">
              INSTITUCIONAL
            </h2>
            <ul className="flex flex-col gap-3 list-none">
              {institucional.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-crema hover:text-dorado transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna 4 donde se puede editar los datos de coctacto */}
          <address className="not-italic">
            <h2 className="text-dorado font-semibold text-sm tracking-wide mb-4">
              CONTACTO
            </h2>
            <ul className="flex flex-col gap-3 list-none text-sm">
              {/* Dirección */}
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-dorado shrink-0" />
                <span>Edificio Académico Central</span>
              </li>

              {/* Correo electrónico */}
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-dorado shrink-0" />
                <a
                  href="mailto:contacto@ciae.edu"
                  className="hover:text-dorado transition-colors duration-200"
                >
                  contacto@ciae.edu
                </a>
              </li>
              {/* Teléfono */}
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-dorado shrink-0" />
                <a
                  href="tel:+18005552423"
                  className="hover:text-dorado transition-colors duration-200"
                >
                  +1 800 555 CIAE
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Linea divisora Inferior */}
        <hr className="border-t border-gray-600 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2024 CIAE. Institutional authority in intellectual rigor.</p>

          <div className="flex items-center gap-4">
            {/* Ícono de idioma/globo */}
            <Globe className="w-4 h-4" />
            {/* Ícono de compartir/redes */}

            <Share2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
