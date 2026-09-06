import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Menu, X } from 'lucide-react'
function Footer() {
  // ------------------------------------------------------------------
  // COLUMNA "ENLACES RÁPIDOS"
  // Se puede agregar o quitar un link solo editando el arreglo
  // ------------------------------------------------------------------
  const enlacesRapidos = [
    { to: '/validacion-cursos', label: 'Validación de cursos' },
    { to: '/nosotros', label: 'Sobre nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ]

  // ------------------------------------------------------------------
  // COLUMNA ejemplo
  // Edita este arreglo si necesitas agregar/quitar/renombrar un link
  // ------------------------------------------------------------------
  const institucional = [
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/privacidad', label: 'Privacidad' },
    { to: '/terminos', label: 'Términos de Servicio' },
  ]

  return (
    // ------------------------------------------------------------------
    // <footer> = etiqueta semántica de HTML5 para el pie de página
    // bg-[#1b3a6b] -> color de fondo (azul marino de tu paleta)
    // Si ya corregiste la variable en el @theme, puedes cambiar esto
    // por "bg-azul-marino" para que quede definido desde el CSS global
    // text-crema -> color de texto base para que resalte sobre el fondo oscuro
    // ------------------------------------------------------------------
    <footer className="bg-[#1b3a6b] text-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ------------------------------------------------------------
            GRID PRINCIPAL: 4 columnas en escritorio, 1 en móvil
            Aquí se controla cuántas columnas hay y su distribución
        ------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* ------------------------------------------------------------
              COLUMNA 1: LOGO + DESCRIPCIÓN
              Cambia el ícono SVG, el nombre "CIAE" o el texto descriptivo aquí
          ------------------------------------------------------------ */}
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

          {/* ------------------------------------------------------------
              COLUMNA 2: ENLACES RÁPIDOS
              El título "ENLACES RÁPIDOS" está en dorado, como en la imagen
          ------------------------------------------------------------ */}
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

          {/* ------------------------------------------------------------
              COLUMNA 3: INSTITUCIONAL
              Misma estructura que "Enlaces rápidos", cambia el arreglo
              "institucional" arriba si necesitas editar los links
          ------------------------------------------------------------ */}
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

          {/* ------------------------------------------------------------
              COLUMNA 4: CONTACTO
              Aquí cambias la dirección, correo y teléfono directamente
              en el texto de cada <li>. Cada ícono es un SVG independiente.
          ------------------------------------------------------------ */}
          <address className="not-italic">
            <h2 className="text-dorado font-semibold text-sm tracking-wide mb-4">
              CONTACTO
            </h2>
            <ul className="flex flex-col gap-3 list-none text-sm">
              {/* Dirección */}
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-dorado shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Edificio Académico Central</span>
              </li>
              {/* Correo electrónico */}
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-dorado shrink-0"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <a
                  href="mailto:contacto@ciae.edu"
                  className="hover:text-dorado transition-colors duration-200"
                >
                  contacto@ciae.edu
                </a>
              </li>
              {/* Teléfono */}
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-dorado shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
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

        {/* ------------------------------------------------------------
            LÍNEA DIVISORA
            Separa el contenido principal de la barra inferior
        ------------------------------------------------------------ */}
        <hr className="border-t border-gray-600 my-8" />

        {/* ------------------------------------------------------------
            BARRA INFERIOR: copyright + íconos sociales/idioma
            Cambia el año, el texto legal, o los links de los íconos aquí
        ------------------------------------------------------------ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2024 CIAE. Institutional authority in intellectual rigor.</p>

          <div className="flex items-center gap-4">
            {/* Ícono de idioma/globo */}
            <a
              href="#"
              aria-label="Cambiar idioma"
              className="hover:text-dorado transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
              </svg>
            </a>
            {/* Ícono de compartir/redes */}
            <a
              href="#"
              aria-label="Compartir"
              className="hover:text-dorado transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
