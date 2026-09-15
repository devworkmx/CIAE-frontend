import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import NavbarAdmin from './components/admin/NavbarAdmin'
import Footer from './components/Footer'

import Home from './pages/Home'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Validacion from './pages/Validacion'
import Login from './pages/Login'
import ValidarToken from './pages/ValidarToken'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import RutaProtegida from './components/RutaProtegida'
import RutaPublica from './components/RutaPublica'

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
// Utiliza la barra ejecutiva desacoplada para el panel institucional
function LayoutAdmin() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarAdmin />
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
      <ScrollToTop />

      <Routes>
        {/* Rutas Públicas bajo LayoutPublico (Tienen Navbar y Footer) */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
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

          {/* Ruta comodín */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Ruta Privada bajo LayoutAdmin */}
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
