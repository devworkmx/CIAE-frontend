import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Contact from './pages/Contact'
import Nosotros from './pages/Nosotros'
import Validacion from './pages/Validacion'
import Login from './pages/Login'
import ValidarToken from './pages/ValidarToken'
import Admin from './pages/Admin'
import RutaProtegida from './components/RutaProtegida'
import RutaPublica from './components/RutaPublica'

import { Landmark, LogOut, ExternalLink } from 'lucide-react'

// ===================== LAYOUT PÚBLICO =====================
// Contiene la navegación completa institucional y el Footer
function LayoutPublico() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

// ===================== LAYOUT PRIVADO (ADMIN) =====================
// Sin Footer ni menús comerciales; barra ejecutiva de trabajo
function LayoutAdmin() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('ciae_token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0f1f3d] text-white border-b border-slate-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-white font-extrabold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado rounded-md"
            >
              <Landmark
                className="w-5 h-5 text-dorado shrink-0"
                aria-hidden="true"
              />
              <span>CIAE</span>
            </Link>
            <span className="hidden sm:inline text-xs font-bold bg-white/10 text-dorado px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Panel Administrativo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ver sitio web</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[44px] inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-100 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

// ===================== ENRUTADOR PRINCIPAL =====================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas bajo LayoutPublico (Tienen Navbar y Footer) */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/validacion-cursos" element={<Validacion />} />
          <Route path="/validar/:token" element={<ValidarToken />} />

          <Route
            path="/login"
            element={
              <RutaPublica>
                <Login />
              </RutaPublica>
            }
          />
        </Route>

        {/* Ruta Privada bajo LayoutAdmin (Aislada, con cabecera ejecutiva) */}
        <Route
          element={
            <RutaProtegida>
              <LayoutAdmin />
            </RutaProtegida>
          }
        >
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
