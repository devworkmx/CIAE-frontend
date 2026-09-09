import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import { API_URL } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [vista, setVista] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [emailRecuperar, setEmailRecuperar] = useState('')
  const [correoEnviado, setCorreoEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })

      if (!res.ok) {
        setError('Credenciales incorrectas o usuario inactivo.')
        return
      }

      const data = await res.json()
      localStorage.setItem('ciae_token', data.access_token)
      navigate('/admin')
    } catch (err) {
      setError('No fue posible conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  function handleRecuperar(e) {
    e.preventDefault()
    setCorreoEnviado(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex relative bg-[#1b3a6b] text-crema flex-col justify-between p-10 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-dorado/30 rounded-full" />
          <Link
            to="/"
            className="relative flex items-center gap-2 text-dorado font-bold text-xl"
          >
            <Landmark className="w-6 h-6" />
            <span>CIAE</span>
          </Link>
          <div className="relative">
            <ShieldCheck className="w-8 h-8 text-dorado mb-3" />
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Rigor institucional al alcance de un clic.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Accede a tu cuenta para gestionar procesos de validación,
              consultar reportes y administrar la información institucional.
            </p>
          </div>
          <p className="relative text-xs text-gray-400">
            © 2026 CIAE. Institutional authority in intellectual rigor.
          </p>
        </div>

        <div className="p-10">
          <Link
            to="/"
            className="flex md:hidden items-center gap-2 text-guinda font-bold text-xl mb-6"
          >
            <Landmark className="w-6 h-6" />
            <span>CIAE</span>
          </Link>

          {vista === 'login' && (
            <>
              <h1 className="text-2xl font-bold text-guinda mb-2">
                Inicia sesión
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Ingresa tus credenciales para acceder a la administración.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <label className="block text-sm font-semibold text-[#1b3a6b] mb-2">
                  Usuario o Correo
                </label>
                <div className="relative mb-5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                  />
                </div>

                <label className="block text-sm font-semibold text-[#1b3a6b] mb-2">
                  Contraseña
                </label>
                <div className="relative mb-3">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
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
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="text-right mb-6">
                  <button
                    type="button"
                    onClick={() => setVista('recuperar')}
                    className="text-sm text-morena hover:text-guinda font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-guinda text-white font-semibold py-3 rounded-lg hover:brightness-110 transition disabled:opacity-50"
                >
                  {cargando ? 'Accediendo...' : 'Iniciar sesión'}
                </button>
              </form>
            </>
          )}

          {vista === 'recuperar' && (
            <>
              <button
                onClick={() => {
                  setVista('login')
                  setCorreoEnviado(false)
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1b3a6b] mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a inicio de sesión
              </button>

              {!correoEnviado ? (
                <>
                  <h1 className="text-2xl font-bold text-guinda mb-2">
                    Recuperar contraseña
                  </h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Ingresa tu correo y te enviaremos un enlace.
                  </p>
                  <form onSubmit={handleRecuperar}>
                    <div className="relative mb-6">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={emailRecuperar}
                        onChange={(e) => setEmailRecuperar(e.target.value)}
                        placeholder="admin@ciae.com"
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
                <div className="py-4">
                  <h2 className="text-lg font-bold text-guinda mb-2">
                    Revisa tu correo
                  </h2>
                  <p className="text-sm text-gray-500">
                    Instrucciones enviadas a{' '}
                    <span className="font-semibold">{emailRecuperar}</span>.
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
