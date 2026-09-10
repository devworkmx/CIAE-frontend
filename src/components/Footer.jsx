import { Link } from 'react-router-dom'
import { Landmark, Globe, Share2, Phone, Mail, MapPin } from 'lucide-react'

function Footer() {
  const anioActual = new Date().getFullYear()

  // Enlaces rápidos para navegación directa
  const enlacesRapidos = [
    { to: '/validacion-cursos', label: 'Validación de cursos' },
    { to: '/nosotros', label: 'Sobre nosotros' },
    { to: '/Contact', label: 'Contacto y soporte' },
  ]

  // Enlaces de políticas y normatividad institucional
  const institucional = [
    { to: '/privacidad', label: 'Aviso de Privacidad' },
    { to: '/terminos', label: 'Términos de Servicio' },
  ]

  return (
    <footer
      className="bg-azulmarino text-slate-100 border-t border-slate-800"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Grid estructurado de 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          {/* COLUMNA 1: IDENTIDAD INSTITUCIONAL */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-dorado font-bold text-xl tracking-wide rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
              aria-label="CIAE - Volver al inicio"
            >
              <Landmark className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span>CIAE</span>
            </Link>
            <p className="text-sm text-slate-200 leading-relaxed">
              Centro de Innovación y Aprendizaje Estratégico. Forjando el futuro
              de la educación mediante el rigor y la validez institucional.
            </p>
          </div>

          {/* COLUMNA 2: ENLACES RÁPIDOS */}
          <nav aria-label="Enlaces rápidos" className="space-y-4">
            <h2 className="text-dorado font-bold text-xs tracking-wider uppercase">
              Enlaces Rápidos
            </h2>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {enlacesRapidos.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-1 text-sm text-slate-200 hover:text-dorado transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMNA 3: INSTITUCIONAL */}
          <nav aria-label="Legal e institucional" className="space-y-4">
            <h2 className="text-dorado font-bold text-xs tracking-wider uppercase">
              Institucional
            </h2>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {institucional.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-1 text-sm text-slate-200 hover:text-dorado transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMNA 4: DATOS DE CONTACTO */}
          <div className="space-y-4">
            <h2 className="text-dorado font-bold text-xs tracking-wider uppercase">
              Contacto Oficial
            </h2>
            <address className="not-italic space-y-3 text-sm text-slate-200">
              {/* Ubicación física */}
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-dorado shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>Edificio Académico Central</span>
              </div>

              {/* Correo oficial */}
              <div className="flex items-center gap-2.5">
                <Mail
                  className="w-4 h-4 text-dorado shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:contacto@ciae.edu"
                  className="py-1 hover:text-dorado transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                >
                  contacto@ciae.edu
                </a>
              </div>

              {/* Teléfono */}
              <div className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 text-dorado shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+18005552423"
                  className="py-1 hover:text-dorado transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                >
                  +1 800 555 CIAE
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Separador sutil */}
        <hr className="border-t border-slate-700/80 my-10" />

        {/* BARRA INFERIOR DE DERECHOS Y ACCIONES */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>© {anioActual} CIAE. Todos los derechos reservados.</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Seleccionar idioma regional"
              className="p-2 rounded-lg text-slate-300 hover:text-dorado hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Compartir este sitio web"
              className="p-2 rounded-lg text-slate-300 hover:text-dorado hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
