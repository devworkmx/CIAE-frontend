
function Home() {
  return (
    <>
      {/* ================================================================
          SECCIÓN 1: HERO
          Fondo azul marino oscuro con un sello/escudo watermark de fondo.
          Contiene: badge, título, párrafo y dos botones de acción.
          Cambia el texto del título/párrafo directamente en su etiqueta.
      ================================================================ */}
      <section className="relative bg-[#0f1f3d] text-crema overflow-hidden">
        {/* SELLO DE FONDO (watermark), solo decorativo */}
        <svg
          className="absolute -right-24 -top-16 w-[420px] h-[420px] text-white/5 pointer-events-none select-none"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="80" />
          <circle cx="100" cy="100" r="65" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge superior */}
          <span className="inline-block bg-dorado text-[#0f1f3d] text-xs font-bold uppercase tracking-wide px-3 py-1 rounded mb-6">
            Excelencia Académica
          </span>

          {/* Título principal del hero */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-2xl mb-6">
            Liderando la Innovación y el Aprendizaje Estratégico.
          </h1>

          {/* Párrafo descriptivo del hero */}
          <p className="text-gray-300 max-w-xl mb-8">
            Un pilar institucional dedicado a forjar el futuro de la educación
            mediante estrategias rigurosas, validación certificada y
            metodologías de vanguardia.
          </p>

          {/* BOTONES DE ACCIÓN (CTA) */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-dorado text-[#0f1f3d] font-semibold px-6 py-3 rounded hover:brightness-95 transition">
              Conocer más
            </button>
            <button className="border border-white/40 text-crema font-semibold px-6 py-3 rounded hover:bg-white/10 transition">
              Explorar Áreas
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 2: "LA INSTITUCIÓN DEL RIGOR INTELECTUAL"
      ================================================================ */}
      <section className="bg-crema py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#1b3a6b] mb-3">
            La Institución del Rigor Intelectual
          </h2>
          <div className="w-16 h-1 bg-dorado mx-auto mb-6"></div>

          <p className="text-gray-600 leading-relaxed">
            El Centro de Innovación y Aprendizaje Estratégico (CIAE) se
            establece como la máxima autoridad en la validación y
            estructuración de procesos educativos. Nuestra visión estratégica
            busca no solo elevar los estándares actuales, sino redefinir las
            metodologías de enseñanza para asegurar que cada esfuerzo
            académico resulte en un aprendizaje profundo, aplicable y
            certificado.
          </p>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 3: "NUESTRAS ÁREAS DE ENFOQUE"
          Cada tarjeta está escrita directamente, sin arreglos ni .map().
          Para agregar una tarjeta nueva, copia un <article>...</article>
          completo y pégalo dentro del mismo grid.
      ================================================================ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado de la sección */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#1b3a6b] mb-2">
              Nuestras Áreas de Enfoque
            </h2>
            <p className="text-gray-500">
              Pilares fundamentales para el desarrollo institucional y académico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* ---------------------------------------------------------
                TARJETA 1: Innovación Educativa
                Cambia ícono, título, descripción y texto del link aquí.
            ---------------------------------------------------------- */}
            <article className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-5 h-5">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8Z" />
                </svg>
              </div>

              <h3 className="font-bold text-[#1b3a6b] mb-2">Innovación Educativa</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Desarrollo e implementación de metodologías pedagógicas de
                vanguardia que transforman la dinámica en el aula y entornos
                virtuales.
              </p>

              <a
                href="#"
                className="text-sm font-semibold text-morena hover:text-guinda transition-colors duration-200"
              >
                Explorar iniciativas →
              </a>
            </article>

            {/* ---------------------------------------------------------
                TARJETA 2: Estrategia de Aprendizaje
            ---------------------------------------------------------- */}
            <article className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-5 h-5">
                  <path d="M12 20v-6M6 20V10M18 20V4" />
                </svg>
              </div>

              <h3 className="font-bold text-[#1b3a6b] mb-2">Estrategia de Aprendizaje</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Diseño de rutas curriculares y modelos de retención de
                conocimiento basados en evidencia neurocientífica y análisis
                de datos.
              </p>

              <a
                href="#"
                className="text-sm font-semibold text-morena hover:text-guinda transition-colors duration-200"
              >
                Ver programas →
              </a>
            </article>

            {/* ---------------------------------------------------------
                TARJETA 3: Certificación Institucional
            ---------------------------------------------------------- */}
            <article className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-5 h-5">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M9 13.5 7 22l5-3 5 3-2-8.5" />
                </svg>
              </div>

              <h3 className="font-bold text-[#1b3a6b] mb-2">Certificación Institucional</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Procesos rigurosos de validación y acreditación para asegurar
                que los cursos cumplan con los más altos estándares globales.
              </p>

              
               <a href="#"
                className="text-sm font-semibold text-morena hover:text-guinda transition-colors duration-200"
              >
                Proceso de validación →
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 4: BARRA DE ESTADÍSTICAS
          Cada número está escrito directamente, sin arreglos ni .map().
          Para agregar una estadística nueva, copia un <div>...</div>
          completo y pégalo dentro del mismo grid.
      ================================================================ */}
      <section className="bg-[#0f1f3d] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            {/* Estadística 1 */}
            <div>
              <p className="text-4xl font-bold text-dorado mb-1">+500</p>
              <p className="text-xs tracking-wide text-gray-300">CURSOS VALIDADOS</p>
            </div>

            {/* Estadística 2 */}
            <div>
              <p className="text-4xl font-bold text-dorado mb-1">+10k</p>
              <p className="text-xs tracking-wide text-gray-300">ALUMNOS IMPACTADOS</p>
            </div>

            {/* Estadística 3 */}
            <div>
              <p className="text-4xl font-bold text-dorado mb-1">50</p>
              <p className="text-xs tracking-wide text-gray-300">INSTITUCIONES ALIADAS</p>
            </div>

            {/* Estadística 4 */}
            <div>
              <p className="text-4xl font-bold text-dorado mb-1">98%</p>
              <p className="text-xs tracking-wide text-gray-300">TASA DE ÉXITO</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default Home