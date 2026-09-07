import { useState } from 'react'
import { Link } from 'react-router-dom'
// Íconos: correo, candado, ojo (mostrar/ocultar contraseña), flecha de regreso
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Landmark,
  ShieldCheck,
} from 'lucide-react'

function Login() {
  // ------------------------------------------------------------------
  // ESTADO: qué vista se muestra dentro del panel derecho
  // "login" = formulario normal | "recuperar" = formulario de recuperación
  // ------------------------------------------------------------------
  const [vista, setVista] = useState('login')

  // Campos del formulario de login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Campo del formulario de recuperación (solo necesita el correo)
  const [emailRecuperar, setEmailRecuperar] = useState('')

  // Mensaje de confirmación tras enviar el correo de recuperación
  const [correoEnviado, setCorreoEnviado] = useState(false)

  // ------------------------------------------------------------------
  // FUNCIÓN: envío del formulario de login
  // Aquí conectarías tu lógica real de autenticación (ej. Supabase Auth)
  // ------------------------------------------------------------------
  function handleLogin(e) {
    e.preventDefault()
    console.log('Iniciando sesión con:', { email, password })
    // TODO: reemplazar por tu llamada real de autenticación
  }

  // ------------------------------------------------------------------
  // FUNCIÓN: envío del formulario de recuperación de contraseña
  // ------------------------------------------------------------------
  function handleRecuperar(e) {
    e.preventDefault()
    console.log('Enviando enlace de recuperación a:', emailRecuperar)
    // TODO: reemplazar por tu llamada real (ej. supabase.auth.resetPasswordForEmail)
    setCorreoEnviado(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/*   TARJETA PRINCIPAL */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/*  COLUMNA IZQUIERDA: DECORATIVA*/}
        <div className="hidden md:flex relative bg-[#1b3a6b] text-crema flex-col justify-between p-10 overflow-hidden">
          {/* Círculo decorativo dorado en la esquina superior derecha */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-dorado/30 rounded-full" />

          {/* Logo arriba */}
          <Link
            to="/"
            className="relative flex items-center gap-2 text-dorado font-bold text-xl"
          >
            <Landmark className="w-6 h-6" />
            <span>CIAE</span>
          </Link>

          {/* Frase institucional al centro */}
          <div className="relative">
            <ShieldCheck className="w-8 h-8 text-dorado mb-3" />
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Rigor institucional al alcance de un clic.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Accede a tu cuenta para gestionar procesos de validación,
              consultar reportes y administrar la información institucional de
              CIAE.
            </p>
          </div>

          {/* Pie del panel izquierdo */}
          <p className="relative text-xs text-gray-400">
            © 2024 CIAE. Institutional authority in intellectual rigor.
          </p>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="p-10">
          {/* Logo visible solo en móvil (ya que la columna izquierda se oculta) */}
          <Link
            to="/"
            className="flex md:hidden items-center gap-2 text-guinda font-bold text-xl mb-6"
          >
            <Landmark className="w-6 h-6" />
            <span>CIAE</span>
          </Link>

          {/* VISTA 1: LOGIN NORMAL*/}
          {vista === 'login' && (
            <>
              <h1 className="text-2xl font-bold text-guinda mb-2">
                Inicia sesión
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Ingresa tus credenciales para acceder a tu cuenta institucional.
              </p>

              <form onSubmit={handleLogin}>
                {/* ------------------------------------------------------------
                    CAMPO: CORREO ELECTRÓNICO
                ------------------------------------------------------------- */}
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1b3a6b] mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative mb-5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ciae.edu"
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                  />
                </div>

                {/* ------------------------------------------------------------
                    CAMPO: CONTRASEÑA
                    Incluye botón de ojo para mostrar/ocultar el texto
                ------------------------------------------------------------- */}
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1b3a6b] mb-2"
                >
                  Contraseña
                </label>
                <div className="relative mb-3">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      mostrarPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* ------------------------------------------------------------
                    LINK: "¿Olvidaste tu contraseña?"
                    Cambia la vista a "recuperar" sin salir de la página
                ------------------------------------------------------------- */}
                <div className="text-right mb-6">
                  <button
                    type="button"
                    onClick={() => setVista('recuperar')}
                    className="text-sm text-morena hover:text-guinda font-medium transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón de envío, color guinda para combinar con el título */}
                <button
                  type="submit"
                  className="w-full bg-guinda text-white font-semibold py-3 rounded-lg hover:brightness-110 transition"
                >
                  Iniciar sesión
                </button>
              </form>
            </>
          )}

          {/* ================================================================
              VISTA 2: RECUPERAR CONTRASEÑA
              Se muestra cuando vista === 'recuperar'
              No requiere registro, solo pide el correo para enviar el enlace.
          ================================================================= */}
          {vista === 'recuperar' && (
            <>
              {/* Botón para regresar al login */}
              <button
                onClick={() => {
                  setVista('login')
                  setCorreoEnviado(false) // resetea el mensaje si regresa y vuelve a entrar
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1b3a6b] mb-6 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a inicio de sesión
              </button>

              {/* ------------------------------------------------------------
                  Si aún no se ha enviado el correo, muestra el formulario.
                  Si ya se envió, muestra un mensaje de confirmación.
              ------------------------------------------------------------- */}
              {!correoEnviado ? (
                <>
                  <h1 className="text-2xl font-bold text-guinda mb-2">
                    Recuperar contraseña
                  </h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Ingresa tu correo institucional y te enviaremos un enlace
                    para restablecer tu contraseña.
                  </p>

                  <form onSubmit={handleRecuperar}>
                    <label
                      htmlFor="emailRecuperar"
                      className="block text-sm font-semibold text-[#1b3a6b] mb-2"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative mb-6">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="emailRecuperar"
                        type="email"
                        value={emailRecuperar}
                        onChange={(e) => setEmailRecuperar(e.target.value)}
                        placeholder="tucorreo@ciae.edu"
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-guinda text-white font-semibold py-3 rounded-lg hover:brightness-110 transition"
                    >
                      Enviar enlace de recuperación
                    </button>
                  </form>
                </>
              ) : (
                // Mensaje de confirmación tras "enviar" el correo
                <div className="py-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#1b3a6b] text-dorado rounded-full mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-guinda mb-2">
                    Revisa tu correo
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enviamos un enlace de recuperación a{' '}
                    <span className="font-semibold text-gray-700">
                      {emailRecuperar}
                    </span>
                    . Sigue las instrucciones para restablecer tu contraseña.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
