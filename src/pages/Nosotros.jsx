import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SquareCheckBig,
  Lightbulb,
  Eye,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react'

// Hook nativo ultra liviano para animaciones de entrada en scroll
function useEnPantalla(opciones = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(el)
      }
    }, opciones)

    observer.observe(el)
    return () => observer.disconnect()
  }, [opciones])

  return [ref, visible]
}

export default function Nosotros() {
  const [refHero, visibleHero] = useEnPantalla()
  const [refMision, visibleMision] = useEnPantalla()
  const [refValores, visibleValores] = useEnPantalla()
  const [refCta, visibleCta] = useEnPantalla()

  return (
    <main className="min-h-screen bg-white">
      {/* ================================================================
          SECCIÓN 1: HERO INSTITUCIONAL
      ================================================================ */}
      <section
        ref={refHero}
        aria-labelledby="nosotros-hero-title"
        className="relative bg-[#0f1f3d] text-slate-100 overflow-hidden py-20 sm:py-28"
      >
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-700 ease-out ${
              visibleHero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 bg-dorado text-[#0f1f3d] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Identidad y Filosofía</span>
            </div>

            <h1
              id="nosotros-hero-title"
              className="text-3xl sm:text-5xl font-extrabold leading-tight text-white mb-6 tracking-tight max-w-3xl mx-auto"
            >
              Comprometidos con la Excelencia Educativa
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
              El{' '}
              <strong>
                Centro de Innovación y Aprendizaje Estratégico (CIAE)
              </strong>{' '}
              nace con el propósito fundamental de transformar los ecosistemas
              formativos mediante el rigor institucional, la validación
              documental y el aseguramiento de la calidad académica.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 2: MISIÓN Y VISIÓN
      ================================================================ */}
      <section
        ref={refMision}
        aria-labelledby="mision-vision-title"
        className="bg-crema py-20 border-b border-amber-900/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="mision-vision-title" className="sr-only">
            Misión y Visión Institucional
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Tarjeta Misión */}
            <article
              className={`bg-white rounded-2xl shadow-sm p-8 border-l-4 border-guinda transition-all duration-700 ease-out flex flex-col justify-between ${
                visibleMision
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-guinda/10 text-guinda rounded-xl mb-5">
                  <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#1b3a6b] mb-3 tracking-tight">
                  Nuestra Misión
                </h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  Fortalecer la calidad y legitimidad educativa mediante la
                  validación sistemática y rigurosa de cursos, planes
                  curriculares y programas de formación, garantizando que cada
                  constancia refleje competencias profesionales comprobables y
                  cumpla los más altos estándares normativos.
                </p>
              </div>
            </article>

            {/* Tarjeta Visión */}
            <article
              className={`bg-white rounded-2xl shadow-sm p-8 border-l-4 border-dorado transition-all duration-700 ease-out flex flex-col justify-between ${
                visibleMision
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center bg-amber-50 text-amber-700 rounded-xl mb-5">
                  <Compass className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#1b3a6b] mb-3 tracking-tight">
                  Nuestra Visión
                </h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  Consolidarnos como la entidad institucional y técnica de
                  referencia en innovación pedagógica y certificación digital,
                  reconocida regional y nacionalmente por transformar
                  metodologías tradicionales en trayectos de aprendizaje
                  profundos, aplicables y con plena validez curricular.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 3: NUESTROS VALORES INSTITUCIONALES
      ================================================================ */}
      <section
        ref={refValores}
        aria-labelledby="valores-title"
        className="bg-slate-50 py-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              visibleValores
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              id="valores-title"
              className="text-3xl font-extrabold text-[#1b3a6b] mb-3 tracking-tight"
            >
              Nuestros Valores
            </h2>
            <div
              className="w-16 h-1.5 bg-dorado mx-auto rounded-full"
              aria-hidden="true"
            />
            <p className="text-base text-slate-600 max-w-xl mx-auto mt-4">
              Principios éticos y metodológicos que rigen cada certificación
              emitida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Valor 1: Rigor */}
            <div
              className={`bg-white rounded-2xl shadow-xs p-6 sm:p-7 text-center border border-slate-200/90 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1 ${
                visibleValores
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-2xl mx-auto mb-5 shadow-xs">
                <SquareCheckBig className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1b3a6b] mb-2">Rigor</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Aplicamos filtros y criterios exigentes en cada proceso de
                acreditación académica y documental.
              </p>
            </div>

            {/* Valor 2: Innovación */}
            <div
              className={`bg-white rounded-2xl shadow-xs p-6 sm:p-7 text-center border border-slate-200/90 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1 ${
                visibleValores
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-2xl mx-auto mb-5 shadow-xs">
                <Lightbulb className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1b3a6b] mb-2">
                Innovación
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Implementamos tecnologías de validación y pedagogías ágiles
                adaptadas a entornos híbridos.
              </p>
            </div>

            {/* Valor 3: Transparencia */}
            <div
              className={`bg-white rounded-2xl shadow-xs p-6 sm:p-7 text-center border border-slate-200/90 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1 ${
                visibleValores
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-2xl mx-auto mb-5 shadow-xs">
                <Eye className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1b3a6b] mb-2">
                Transparencia
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Verificación pública abierta con folios y códigos QR para
                consulta inmediata por empleadores.
              </p>
            </div>

            {/* Valor 4: Compromiso */}
            <div
              className={`bg-white rounded-2xl shadow-xs p-6 sm:p-7 text-center border border-slate-200/90 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1 ${
                visibleValores
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-2xl mx-auto mb-5 shadow-xs">
                <Heart className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1b3a6b] mb-2">
                Compromiso
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Respaldamos a cada institución aliada y velamos por el
                crecimiento profesional de sus egresados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECCIÓN 4: LLAMADO A LA ACCIÓN (CTA)
      ================================================================ */}
      <section
        ref={refCta}
        aria-labelledby="cta-nosotros-title"
        className="bg-[#0f1f3d] py-20 text-slate-100 border-t border-dorado/20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-700 ease-out ${
              visibleCta
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              id="cta-nosotros-title"
              className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight"
            >
              ¿Quieres formar parte de nuestra red institucional?
            </h2>
            <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-xl mx-auto leading-relaxed">
              Descubre cómo validar los programas de tu organización bajo los
              estándares de acreditación y trazabilidad de CIAE.
            </p>

            <Link
              to="/contact"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-dorado text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:brightness-95 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              <span>Contactar a Vinculación</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
