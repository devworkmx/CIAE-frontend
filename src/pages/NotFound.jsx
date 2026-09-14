import { Link } from 'react-router-dom'
import { Landmark, Home, ShieldAlert, Mail } from 'lucide-react'

// Página mostrada cuando la URL no coincide con ninguna ruta conocida
// (ver la ruta comodín path="*" en App.jsx). Sin esta página, React Router
// simplemente no renderiza nada para una URL desconocida y el usuario ve
// una pantalla en blanco sin ninguna explicación.
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#1b3a6b] flex items-center justify-center shadow-md">
          <Landmark className="w-8 h-8 text-dorado" aria-hidden="true" />
        </div>

        <p className="text-sm font-bold uppercase tracking-widest text-guinda mb-2">
          Error 404
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b3a6b] tracking-tight mb-3">
          Página no encontrada
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
          La dirección a la que intentaste acceder no existe o fue movida.
          Verifica la URL o regresa al inicio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-guinda text-white font-bold text-sm rounded-xl py-3 px-6 hover:brightness-110 transition shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>

          <Link
            to="/validacion-cursos"
            className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 font-bold text-sm rounded-xl py-3 px-6 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
          >
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            <span>Validar un certificado</span>
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ¿Crees que esto es un error? Contacta a soporte.
        </p>
      </div>
    </main>
  )
}
