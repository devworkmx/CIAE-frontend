import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from '../components/RutaProtegida'
import { verificarSesion } from '../services/api'

// La sesión ahora vive en una cookie httpOnly: el componente ya no puede
// leerla directamente, así que le pregunta al backend vía verificarSesion().
vi.mock('../services/api', () => ({
  verificarSesion: vi.fn(),
}))

function PaginaProtegidaFalsa() {
  return <div>Contenido secreto del panel</div>
}

function LoginFalso() {
  return <div>Pantalla de login</div>
}

function renderConRuta(initialPath = '/admin') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginFalso />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <PaginaProtegidaFalsa />
            </RutaProtegida>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('RutaProtegida', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra "Verificando sesión..." mientras espera la respuesta del backend', () => {
    verificarSesion.mockReturnValue(new Promise(() => {})) // nunca resuelve
    renderConRuta('/admin')

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument()
  })

  it('redirige a /login si el backend dice que NO hay sesión (verificarSesion resuelve null)', async () => {
    verificarSesion.mockResolvedValue(null)
    renderConRuta('/admin')

    await waitFor(() => {
      expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    })
    expect(
      screen.queryByText('Contenido secreto del panel')
    ).not.toBeInTheDocument()
  })

  it('muestra el contenido protegido si el backend confirma una sesión válida', async () => {
    verificarSesion.mockResolvedValue({
      username: 'admin',
      nombre_completo: 'Admin',
    })
    renderConRuta('/admin')

    await waitFor(() => {
      expect(
        screen.getByText('Contenido secreto del panel')
      ).toBeInTheDocument()
    })
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
  })

  it('redirige a /login si la llamada al backend falla (verificarSesion resuelve null en error)', async () => {
    // verificarSesion ya atrapa errores de red internamente y resuelve null
    verificarSesion.mockResolvedValue(null)
    renderConRuta('/admin')

    await waitFor(() => {
      expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    })
  })
})
