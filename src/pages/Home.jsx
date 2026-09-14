import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ClipboardPenLine,
  Award,
  Target,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react'

// Hook liviano basado en IntersectionObserver para animaciones nativas sin impacto en PageSpeed
function useEnPantalla(opciones = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(elemento)
      }
    }, opciones)

    observer.observe(elemento)
    return () => observer.disconnect()
  }, [opciones])

  return [ref, visible]
}

export default function Home() {
  const [refHero, visibleHero] = useEnPantalla()
  const [refRigor, visibleRigor] = useEnPantalla()
  const [refAreas, visibleAreas] = useEnPantalla()
  const [refStats, visibleStats] = useEnPantalla()

  const hacerScrollA = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ================================================================
          SECCIÓN 1: HERO
      ================================================================ */}
      <section
        ref={refHero}
        aria-labelledby="hero-title"
        className="relative bg-[#0f1f3d] text-slate-100 overflow-hidden py-24 sm:py-32"
      >
        {/* Marca de agua decorativa */}
        <Target
          className="absolute -right-24 -top-20 w-[460px] h-[460px] text-white/5 pointer-events-none select-none"
          strokeWidth={1}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`max-w-3xl transition-all duration-700 ease-out ${
              visibleHero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge superior accesible */}
            <div className="inline-flex items-center gap-2 bg-dorado text-[#0f1f3d] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Excelencia Académica Institucional</span>
            </div>

            {/* Título principal semántico */}
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6 tracking-tight"
            >
              Liderando la Innovación y el Aprendizaje Estratégico.
            </h1>

            {/* Párrafo descriptivo con contraste WCAG */}
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-10 max-w-2xl">
              Un pilar institucional dedicado a forjar el futuro de la educación
              mediante estrategias rigurosas, validación curricular oficial y
              emisión certificada con tecnología verificable.
            </p>

            {/* Acciones principales con target táctil mínimo de 48px */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => hacerScrollA('institucion')}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-dorado text-slate-950 font-bold px-6 py-3 rounded-lg hover:brightness-95 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
              >
                <span>Conocer más</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => hacerScrollA('areas-enfoque')}
                className="min-h-[48px] inline-flex items-center justify-center border-2 border-white/60 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explorar Áreas
              </button>

              <Link
                to="/validacion-cursos"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-100 font-bold px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
              >
                <ShieldCheck
                  className="w-4 h-4 text-dorado"
                  aria-hidden="true"
                />
                <span>Validar Certificado</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 2: "LA INSTITUCIÓN DEL RIGOR INTELECTUAL"
      ================================================================ */}
      <section
        id="institucion"
        ref={refRigor}
        aria-labelledby="rigor-title"
        className="bg-crema py-20 border-b border-amber-900/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-700 delay-100 ease-out ${
              visibleRigor
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              id="rigor-title"
              className="text-3xl font-extrabold text-[#1b3a6b] mb-3 tracking-tight"
            >
              La Institución del Rigor Intelectual
            </h2>
            <div
              className="w-20 h-1.5 bg-dorado mx-auto mb-8 rounded-full"
              aria-hidden="true"
            />

            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
              El{' '}
              <strong>
                Centro de Innovación y Aprendizaje Estratégico (CIAE)
              </strong>{' '}
              se establece como la autoridad en la validación y estructuración
              de procesos educativos. Nuestra visión estratégica busca elevar
              los estándares formativos, consolidando metodologías de enseñanza
              que garantizan un aprendizaje verificable, aplicable y con pleno
              respaldo curricular.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 3: "NUESTRAS ÁREAS DE ENFOQUE"
      ================================================================ */}
      <section
        id="areas-enfoque"
        ref={refAreas}
        aria-labelledby="areas-title"
        className="bg-slate-50 py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              visibleAreas
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              id="areas-title"
              className="text-3xl font-extrabold text-[#1b3a6b] mb-3 tracking-tight"
            >
              Nuestras Áreas de Enfoque
            </h2>
            <p className="text-base text-slate-700 max-w-xl mx-auto">
              Pilares fundamentales orientados a impulsar el desarrollo
              curricular y la acreditación profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TARJETA 1 */}
            <article
              className={`bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-500 ease-out flex flex-col justify-between ${
                visibleAreas
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-xl mb-6 shadow-xs">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1b3a6b] mb-3">
                  Innovación Educativa
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                  Desarrollo e implementación de metodologías pedagógicas de
                  vanguardia que transforman los entornos virtuales y la
                  capacitación continua.
                </p>
              </div>

              <Link
                to="/nosotros"
                className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-bold text-guinda hover:text-guinda/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda rounded"
                aria-label="Explorar iniciativas de innovación educativa"
              >
                <span>Explorar iniciativas</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </article>

            {/* TARJETA 2 */}
            <article
              className={`bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-500 ease-out flex flex-col justify-between ${
                visibleAreas
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-xl mb-6 shadow-xs">
                  <ClipboardPenLine className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1b3a6b] mb-3">
                  Estrategia de Aprendizaje
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                  Diseño de programas formativos y trayectos curriculares
                  estructurados bajo análisis de competencias y evaluación
                  continua de resultados.
                </p>
              </div>

              <Link
                to="/contact"
                className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-bold text-guinda hover:text-guinda/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda rounded"
                aria-label="Ver programas de estrategia de aprendizaje"
              >
                <span>Consultar programas</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </article>

            {/* TARJETA 3 */}
            <article
              className={`bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-500 ease-out flex flex-col justify-between ${
                visibleAreas
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-xl mb-6 shadow-xs">
                  <Award className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1b3a6b] mb-3">
                  Certificación Institucional
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-6">
                  Procesos técnicos de emisión de folios únicos, trazabilidad de
                  vigencias y validación oficial mediante código QR para
                  estudiantes y evaluadores.
                </p>
              </div>

              <Link
                to="/validacion-cursos"
                className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-bold text-guinda hover:text-guinda/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda rounded"
                aria-label="Ir al proceso de validación de certificados"
              >
                <span>Proceso de validación</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 4: BARRA DE IMPACTO Y ESTADÍSTICAS
      ================================================================ */}
      <section
        ref={refStats}
        aria-label="Estadísticas de impacto institucional"
        className="bg-[#0f1f3d] py-16 border-y border-dorado/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-700 ease-out ${
              visibleStats
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-dorado mb-1 tracking-tight">
                +500
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Cursos Validados
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-dorado mb-1 tracking-tight">
                +10k
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Alumnos Certificados
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-dorado mb-1 tracking-tight">
                50
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Instituciones Aliadas
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-dorado mb-1 tracking-tight">
                98%
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Tasa de Satisfacción
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
