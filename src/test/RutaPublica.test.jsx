import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaPublica from '../components/RutaPublica'
import { verificarSesion } from '../services/api'

vi.mock('../services/api', () => ({
  verificarSesion: vi.fn(),
}))

function LoginFalso() {
  return <div>Pantalla de login</div>
}

function PanelAdminFalso() {
  return <div>Panel de administración</div>
}

function renderConRuta(initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin" element={<PanelAdminFalso />} />
        <Route
          path="/login"
          element={
            <RutaPublica>
              <LoginFalso />
            </RutaPublica>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('RutaPublica', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el contenido público de inmediato mientras verifica (no bloquea con pantalla en blanco)', () => {
    verificarSesion.mockReturnValue(new Promise(() => {})) // nunca resuelve
    renderConRuta('/login')

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('se queda en el contenido público si el backend confirma que NO hay sesión', async () => {
    verificarSesion.mockResolvedValue(null)
    renderConRuta('/login')

    await waitFor(() => {
      expect(verificarSesion).toHaveBeenCalled()
    })
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    expect(
      screen.queryByText('Panel de administración')
    ).not.toBeInTheDocument()
  })

  it('redirige a /admin si el backend confirma una sesión activa', async () => {
    verificarSesion.mockResolvedValue({
      username: 'admin',
      nombre_completo: 'Admin',
    })
    renderConRuta('/login')

    await waitFor(() => {
      expect(screen.getByText('Panel de administración')).toBeInTheDocument()
    })
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
  })
})
