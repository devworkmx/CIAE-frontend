import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { verificarSesion, cerrarSesion } from '../services/api'

// La sesión ahora se confirma preguntándole al backend (cookie httpOnly),
// no leyendo un token de localStorage.
vi.mock('../services/api', () => ({
  verificarSesion: vi.fn(),
  cerrarSesion: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderNavbar() {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    verificarSesion.mockReset()
    cerrarSesion.mockReset()
    cerrarSesion.mockResolvedValue(undefined)
  })

  it('muestra el logo/marca CIAE', () => {
    verificarSesion.mockResolvedValue(null)
    renderNavbar()
    expect(screen.getAllByText('CIAE').length).toBeGreaterThan(0)
  })

  it('muestra los links base de navegación (aparecen en desktop y móvil)', () => {
    verificarSesion.mockResolvedValue(null)
    renderNavbar()
    expect(
      screen.getAllByRole('link', { name: /validación de cursos/i })
    ).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /contacto/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /nosotros/i })).toHaveLength(2)
  })

  describe('cuando NO hay sesión activa', () => {
    beforeEach(() => {
      verificarSesion.mockResolvedValue(null)
    })

    it('muestra el link de "Iniciar sesión" (en ambos menús)', () => {
      renderNavbar()
      const links = screen.getAllByRole('link', { name: /iniciar sesión/i })
      expect(links.length).toBeGreaterThan(0)
    })

    it('NO muestra "Panel Admin" ni "Cerrar sesión"', async () => {
      renderNavbar()
      await waitFor(() => expect(verificarSesion).toHaveBeenCalled())
      expect(screen.queryByText(/panel admin/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/cerrar sesión/i)).not.toBeInTheDocument()
    })
  })

  describe('cuando SÍ hay sesión activa', () => {
    beforeEach(() => {
      verificarSesion.mockResolvedValue({
        username: 'admin',
        nombre_completo: 'Admin',
      })
    })

    it('muestra "Panel Admin" y "Cerrar sesión"', async () => {
      renderNavbar()
      await waitFor(() => {
        expect(screen.getAllByText(/panel admin/i).length).toBeGreaterThan(0)
      })
      expect(screen.getAllByText(/cerrar sesión/i).length).toBeGreaterThan(0)
    })

    it('NO muestra el link de "Iniciar sesión"', async () => {
      renderNavbar()
      await waitFor(() => {
        expect(screen.getAllByText(/panel admin/i).length).toBeGreaterThan(0)
      })
      expect(
        screen.queryByRole('link', { name: /iniciar sesión/i })
      ).not.toBeInTheDocument()
    })

    it('al hacer clic en "Cerrar sesión" llama a cerrarSesion() y navega a /login', async () => {
      const user = userEvent.setup()
      renderNavbar()

      await waitFor(() => {
        expect(screen.getAllByText(/cerrar sesión/i).length).toBeGreaterThan(0)
      })

      const logoutButtons = screen.getAllByText(/cerrar sesión/i)
      await user.click(logoutButtons[0])

      expect(cerrarSesion).toHaveBeenCalled()
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('menú móvil', () => {
    beforeEach(() => {
      verificarSesion.mockResolvedValue(null)
    })

    it('abre el menú lateral al hacer clic en el botón hamburguesa', async () => {
      const user = userEvent.setup()
      renderNavbar()

      await user.click(screen.getByLabelText(/abrir menú/i))

      expect(screen.getByLabelText(/cerrar menú/i)).toBeInTheDocument()
    })

    it('cierra el menú al hacer clic en el botón de cerrar', async () => {
      const user = userEvent.setup()
      renderNavbar()

      await user.click(screen.getByLabelText(/abrir menú/i))
      await user.click(screen.getByLabelText(/cerrar menú/i))

      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/40')
      expect(overlay).not.toBeInTheDocument()
    })
  })
})
