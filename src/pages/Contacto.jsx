import { useState, useId } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export default function Contact() {
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const idNombre = useId()
  const idCorreo = useId()
  const idMensaje = useId()

  const numeroWhatsapp = '529934324302'
  const mensajeInicial =
    'Hola, deseo solicitar información sobre los cursos y procesos de validación de CIAE.'
  const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeInicial)}`

  function manejarEnvio(evento) {
    evento.preventDefault()
    setCargando(true)

    setTimeout(() => {
      setCargando(false)
      setEnviado(true)
      evento.target.reset()
      setTimeout(() => setEnviado(false), 5000)
    }, 600)
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-12">
        {/* ===================== COLUMNA IZQUIERDA: INFORMACIÓN ===================== */}
        <section
          aria-labelledby="info-contacto-titulo"
          className="lg:col-span-5 bg-[#0f1f3d] text-slate-100 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Detalle visual decorativo */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 bg-dorado/15 rounded-full pointer-events-none select-none blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-dorado text-[#0f1f3d] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Atención Institucional</span>
            </div>

            <h1
              id="info-contacto-titulo"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4"
            >
              Hablemos
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-10">
              ¿Tienes dudas sobre nuestros programas formativos o requieres
              soporte sobre folios y validación oficial? Contáctanos de forma
              directa.
            </p>

            <ul className="space-y-6 text-sm font-medium text-slate-200 list-none p-0 m-0">
              <li>
                <a
                  href="tel:+529934324302"
                  className="min-h-[44px] flex items-center gap-3.5 hover:text-dorado transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado rounded-lg p-1"
                  aria-label="Llamar al teléfono institucional +52 993 432 4302"
                >
                  <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-dorado shrink-0">
                    <Phone className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span>+52 993 432 4302</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:contacto@ciae.mx"
                  className="min-h-[44px] flex items-center gap-3.5 hover:text-dorado transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado rounded-lg p-1"
                  aria-label="Enviar correo electrónico a contacto@ciae.mx"
                >
                  <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-dorado shrink-0">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="break-all">contacto@ciae.mx</span>
                </a>
              </li>

              <li className="min-h-[44px] flex items-center gap-3.5 p-1">
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-dorado shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </span>
                <span>Tenosique, Tabasco, México</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-10">
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full flex items-center justify-center gap-2.5 bg-dorado text-slate-950 font-bold text-sm rounded-xl py-3 px-6 hover:brightness-95 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Iniciar conversación en WhatsApp para atención inmediata"
            >
              <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Escríbenos por WhatsApp</span>
            </a>
          </div>
        </section>

        {/* ===================== COLUMNA DERECHA: FORMULARIO ===================== */}
        <section
          aria-labelledby="form-contacto-titulo"
          className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center"
        >
          <div className="mb-8">
            <h2
              id="form-contacto-titulo"
              className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6b] tracking-tight mb-2"
            >
              Envíanos un mensaje
            </h2>
            <p className="text-sm text-slate-600">
              Completa los datos del formulario y nuestro equipo se comunicará
              contigo a la brevedad.
            </p>
          </div>

          {enviado && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-3"
            >
              <CheckCircle2
                className="w-5 h-5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <span>
                ¡Mensaje recibido con éxito! Te responderemos en breve.
              </span>
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-5">
            <div>
              <label
                htmlFor={idNombre}
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Nombre Completo *
              </label>
              <input
                id={idNombre}
                type="text"
                name="nombre"
                required
                autoComplete="name"
                placeholder="Ej. María Elena Pérez"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor={idCorreo}
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Correo Electrónico *
              </label>
              <input
                id={idCorreo}
                type="email"
                name="correo"
                required
                autoComplete="email"
                placeholder="ejemplo@institucion.mx"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor={idMensaje}
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Mensaje o Consulta *
              </label>
              <textarea
                id={idMensaje}
                name="mensaje"
                required
                rows={4}
                placeholder="Escribe los detalles de tu consulta sobre cursos o validación..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#1b3a6b] text-white font-bold text-sm rounded-xl py-3.5 px-6 hover:bg-[#142c52] transition-colors shadow-md disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{cargando ? 'Enviando mensaje...' : 'Enviar mensaje'}</span>
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
