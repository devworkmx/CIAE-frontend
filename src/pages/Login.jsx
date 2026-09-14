import { useState, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Landmark,
  ShieldCheck,
  AlertCircle,
  LifeBuoy,
} from 'lucide-react'
import { API_URL } from '../services/api'

// Correo/canal de soporte al que el usuario debe acudir si olvida su
// contraseña. El sistema NO tiene autorregistro ni recuperación
// automática: las cuentas las crea directamente el administrador del
// sistema, así que restablecer una contraseña también es una acción
// manual de ese administrador (fuera de esta aplicación web).
const CONTACTO_SOPORTE = 'soporte@ciae.mx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const idUsuario = useId()
  const idPassword = useId()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const body = new URLSearchParams()
    body.append('username', email.trim())
    body.append('password', password)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include', // necesario para que el navegador acepte y guarde la cookie httpOnly
        body,
      })

      if (!res.ok) {
        setError('Credenciales incorrectas o usuario inactivo.')
        return
      }

      // El backend ya dejó la cookie httpOnly de sesión; no hay nada que
      // guardar manualmente en el frontend.
      navigate('/admin')
    } catch {
      setError('No fue posible conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* ===================== PANEL IZQUIERDO INSTITUCIONAL ===================== */}
        <section
          aria-labelledby="banner-login-titulo"
          className="hidden md:flex relative bg-[#1b3a6b] text-slate-100 flex-col justify-between p-10 lg:p-12 overflow-hidden"
        >
          <div
            className="absolute -right-10 -top-10 w-44 h-44 bg-dorado/20 rounded-full pointer-events-none blur-xl"
            aria-hidden="true"
          />

          <Link
            to="/"
            className="relative flex items-center gap-2 text-dorado font-extrabold text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado rounded-md py-1"
            aria-label="Volver a la página principal de CIAE"
          >
            <Landmark className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>CIAE</span>
          </Link>

          <div className="relative z-10 my-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-dorado mb-5 shadow-xs">
              <ShieldCheck className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2
              id="banner-login-titulo"
              className="text-2xl lg:text-3xl font-bold leading-tight text-white mb-3"
            >
              Rigor institucional al alcance de un clic.
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed font-normal">
              Accede a la plataforma para gestionar la emisión de constancias
              académicas, supervisar vigencias y administrar el catálogo
              institucional.
            </p>
          </div>

          <p className="relative text-xs text-slate-300 font-medium">
            © 2026 CIAE. Sistema Institucional de Certificación.
          </p>
        </section>

        {/* ===================== PANEL DERECHO: FORMULARIOS ===================== */}
        <section
          aria-labelledby="form-auth-titulo"
          className="p-8 sm:p-12 flex flex-col justify-center"
        >
          <Link
            to="/"
            className="flex md:hidden items-center gap-2 text-guinda font-extrabold text-xl mb-6 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda rounded-md"
            aria-label="Volver a la página principal de CIAE"
          >
            <Landmark className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>CIAE</span>
          </Link>

          {/* VISTA: INICIO DE SESIÓN (única vista de este componente) */}
          <div>
            <header className="mb-6">
              <h1
                id="form-auth-titulo"
                className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6b] tracking-tight mb-1.5"
              >
                Inicia sesión
              </h1>
              <p className="text-sm text-slate-600">
                Ingresa tus credenciales para acceder al panel de
                administración.
              </p>
            </header>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl font-semibold flex items-center gap-2.5"
              >
                <AlertCircle
                  className="w-5 h-5 text-red-600 shrink-0"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor={idUsuario}
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Usuario o Correo *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id={idUsuario}
                    type="text"
                    name="username"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin"
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={idPassword}
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id={idPassword}
                    type={mostrarPassword ? 'text' : 'password'}
                    name="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    aria-label={
                      mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'
                    }
                    className="min-h-[44px] min-w-[44px] absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b3a6b] rounded-r-xl"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full min-h-[48px] inline-flex items-center justify-center bg-guinda text-white font-bold text-sm rounded-xl py-3.5 px-6 hover:brightness-110 transition shadow-md disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda"
              >
                {cargando ? 'Accediendo...' : 'Iniciar sesión'}
              </button>

              {/*
                  NOTA: no hay recuperación de contraseña automática ni
                  autorregistro. Las cuentas las crea directamente el
                  administrador del sistema (fuera de esta aplicación web),
                  así que restablecer un acceso también pasa por contactarlo
                  directamente, nunca por un formulario público.
                */}
              <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>
                  ¿Olvidaste tu contraseña? Contacta a soporte:{' '}
                  <a
                    href={`mailto:${CONTACTO_SOPORTE}`}
                    className="font-bold text-guinda hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guinda rounded"
                  >
                    {CONTACTO_SOPORTE}
                  </a>
                </span>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
