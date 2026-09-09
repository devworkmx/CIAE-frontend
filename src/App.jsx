import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/validacion-cursos" element={<Validacion />} />

          {/* Si ya está logueado, redirige automáticamente a /admin */}
          <Route
            path="/login"
            element={
              <RutaPublica>
                <Login />
              </RutaPublica>
            }
          />

          {/* Ruta pública escaneada por el QR */}
          <Route path="/validar/:token" element={<ValidarToken />} />

          {/* Panel privado protegido */}
          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <Admin />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
