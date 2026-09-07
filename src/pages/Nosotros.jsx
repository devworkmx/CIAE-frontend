import { SquareCheckBig, Lightbulb, Eye, Heart } from 'lucide-react'

import { Link } from 'react-router-dom'

function Nosotros() {
  return (
    <>
      {/* Seccion 1 Hero primera pagina */}

      <section className="bg-[#0f1f3d] text-crema">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge superior, mismo estilo que el usado en el Home */}
          <span className="inline-block bg-dorado text-[#0f1f3d] text-xs font-bold uppercase tracking-wide px-3 py-1 rounded mb-6">
            Sobre Nosotros
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Comprometidos con la Excelencia Educativa
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            El Centro de Innovación y Aprendizaje Estratégico (CIAE) nace con el
            propósito de transformar la educación mediante el rigor
            institucional, la validación de procesos y el compromiso con la
            excelencia académica.
          </p>
        </div>
      </section>

      {/* Seccion 2: MISION Y VISION */}
      <section className="bg-crema py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-guinda">
              <h2 className="text-xl font-bold text-[#1b3a6b] mb-3">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Fortalecer la calidad educativa a través de la validación
                rigurosa de cursos y programas, garantizando que cada proceso de
                aprendizaje cumpla con los más altos estándares institucionales.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-dorado">
              <h2 className="text-xl font-bold text-[#1b3a6b] mb-3">
                Nuestra Visión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Ser la institución de referencia en innovación educativa a nivel
                regional, reconocida por transformar metodologías de enseñanza
                en aprendizajes profundos, aplicables y certificados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: NUESTROS VALORES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#1b3a6b] mb-2">
              Nuestros Valores
            </h2>

            <div className="w-16 h-1 bg-dorado mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-full mx-auto mb-4">
                <SquareCheckBig className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1b3a6b] mb-2">Rigor</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Aplicamos estándares exigentes en cada proceso de validación
                académica.
              </p>
            </div>

            {/* Valor 2: Innovación */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-full mx-auto mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1b3a6b] mb-2">Innovación</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Buscamos constantemente nuevas metodologías para mejorar el
                aprendizaje.
              </p>
            </div>

            {/* Valor 3: Transparencia */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-full mx-auto mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1b3a6b] mb-2">Transparencia</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Cada proceso de certificación es claro, verificable y
                documentado.
              </p>
            </div>

            {/* Valor 4: Compromiso */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-full mx-auto mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1b3a6b] mb-2">Compromiso</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Nos dedicamos por completo al desarrollo educativo de nuestras
                instituciones aliadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: CTA FINAL (llamado a la acción)*/}
      <section className="bg-[#0f1f3d] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-crema mb-4">
            ¿Quieres formar parte de nuestra red institucional?
          </h2>
          <p className="text-gray-300 mb-8">
            Conoce cómo validar tus cursos y programas bajo los estándares de
            calidad de CIAE.
          </p>

          {/* Botón de acción, mismo estilo que el "Conocer más" del Home */}
          <Link
            to="/contact"
            className="bg-dorado text-[#0f1f3d] font-semibold px-6 py-3 rounded hover:brightness-95 transition inline-block"
          >
            Contáctanos
          </Link>
        </div>
      </section>
      <div className="h-5 bg-white"></div>
    </>
  )
}

export default Nosotros
