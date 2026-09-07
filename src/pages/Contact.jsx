import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

function Contact() {
  // Número de WhatsApp al que quieres que te escriban.
  const numeroWhatsapp = '529934324302' // <-- cambia esto por tu número real

  // Mensaje que aparecerá ya escrito cuando abran el chat.
  const mensajeInicial = 'Hola, quiero más información.'

  // Armamos el link de WhatsApp con el número y el mensaje.
  const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(
    mensajeInicial
  )}`

  // Esta función se ejecuta cuando el usuario envía el formulario.
  function manejarEnvio(evento) {
    evento.preventDefault() // Evita que la página se recargue.
    alert('¡Gracias por tu mensaje! Te responderemos pronto.')
    evento.target.reset() // Limpia el formulario.
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      {/* Tarjeta grande dividida en 2 columnas (grid) */}
      <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
        {/* ---------- COLUMNA IZQUIERDA: información de contacto ---------- */}
        <div className="bg-azulmarino text-crema p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Franja decorativa dorada, solo un detalle visual en la esquina */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-dorado/20 rounded-full"></div>

          <div className="relative">
            <h1 className="text-3xl font-bold mb-4">Hablemos</h1>
            <p className="text-crema/80 leading-relaxed mb-10 max-w-xs">
              ¿Tienes dudas sobre nuestros cursos o procesos de validación?
              Escríbenos y con gusto te atendemos.
            </p>

            {/* Lista de datos de contacto con íconos */}
            <ul className="space-y-5">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-dorado" />
                <span>+52 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-dorado" />
                <span>contacto@ciae.mx</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-dorado" />
                <span>Ciudad de México, MX</span>
              </li>
            </ul>
          </div>

          {/* Botón de WhatsApp, al fondo del panel izquierdo */}
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-10 flex items-center justify-center gap-2
                       bg-dorado text-azulmarino font-semibold rounded-lg py-3
                       hover:bg-crema transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Escríbenos por WhatsApp
          </a>
        </div>

        {/* ---------- COLUMNA DERECHA: formulario ---------- */}
        <div className="bg-white p-10">
          <h2 className="text-2xl font-bold text-morena mb-1">
            Envíanos un mensaje
          </h2>
          <p className="text-slate-500 mb-8">
            Te responderemos en menos de 24 horas.
          </p>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
            {/* Campo: Nombre */}
            <div>
              <label className="block text-azulmarino font-medium mb-1 text-sm">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Tu nombre"
                className="w-full border border-slate-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-morena
                           focus:border-morena transition-colors"
              />
            </div>

            {/* Campo: Correo */}
            <div>
              <label className="block text-azulmarino font-medium mb-1 text-sm">
                Correo
              </label>
              <input
                type="email"
                name="correo"
                required
                placeholder="tucorreo@ejemplo.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-morena
                           focus:border-morena transition-colors"
              />
            </div>

            {/* Campo: Mensaje */}
            <div>
              <label className="block text-azulmarino font-medium mb-1 text-sm">
                Mensaje
              </label>
              <textarea
                name="mensaje"
                required
                rows="4"
                placeholder="Escribe tu mensaje aquí..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-morena
                           focus:border-morena transition-colors resize-none"
              />
            </div>

            {/* Botón para enviar el formulario */}
            <button
              type="submit"
              className="bg-morena text-crema font-semibold rounded-lg py-3
                         hover:bg-guinda transition-colors mt-2"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
