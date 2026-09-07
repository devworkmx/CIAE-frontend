import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Contact from './pages/Contact'
import Nosotros from './pages/Nosotros'
import Validacion from './pages/Validacion'
import Login from './pages/Login'

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
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
