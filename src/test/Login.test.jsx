import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'

// Mock de react-router-dom (igual que en Navbar)
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock de la URL de la API para no depender del .env real
vi.mock('../services/api', () => ({
  API_URL: 'http://localhost:8000',
}))

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    // Mockeamos fetch globalmente para cada test
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra el formulario de inicio de sesión por defecto', () => {
    renderLogin()
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('permite escribir en los campos de usuario y contraseña', async () => {
    const user = userEvent.setup()
    renderLogin()

    const inputUsuario = screen.getByPlaceholderText('admin')
    const inputPassword = screen.getByPlaceholderText('••••••••')

    await user.type(inputUsuario, 'admin@ciae.com')
    await user.type(inputPassword, 'miPassword123')

    expect(inputUsuario).toHaveValue('admin@ciae.com')
    expect(inputPassword).toHaveValue('miPassword123')
  })

  it('alterna mostrar/ocultar contraseña al hacer clic en el ícono', async () => {
    const user = userEvent.setup()
    renderLogin()

    const inputPassword = screen.getByPlaceholderText('••••••••')
    expect(inputPassword).toHaveAttribute('type', 'password')

    // El botón del ojo no tiene texto ni aria-label, lo buscamos por su posición:
    // es el único <button type="button"> dentro del campo de contraseña.
    const toggleButton = inputPassword.parentElement.querySelector('button')
    await user.click(toggleButton)

    expect(inputPassword).toHaveAttribute('type', 'text')

    await user.click(toggleButton)
    expect(inputPassword).toHaveAttribute('type', 'password')
  })

  describe('envío del formulario de login', () => {
    it('login exitoso: guarda el token y navega a /admin', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: 'token-de-prueba-123' }),
      })

      const user = userEvent.setup()
      renderLogin()

      await user.type(screen.getByPlaceholderText('admin'), 'admin@ciae.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      await waitFor(() => {
        expect(localStorage.getItem('ciae_token')).toBe('token-de-prueba-123')
      })
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('envía el body con el formato correcto (x-www-form-urlencoded)', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: 'abc' }),
      })

      const user = userEvent.setup()
      renderLogin()

      await user.type(screen.getByPlaceholderText('admin'), 'admin@ciae.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      await waitFor(() => expect(global.fetch).toHaveBeenCalled())

      const [url, options] = global.fetch.mock.calls[0]
      expect(url).toBe('http://localhost:8000/api/auth/login')
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe(
        'application/x-www-form-urlencoded'
      )
      expect(options.body.toString()).toContain('username=admin%40ciae.com')
      expect(options.body.toString()).toContain('password=password123')
    })

    it('credenciales incorrectas: muestra mensaje de error y NO navega', async () => {
      global.fetch.mockResolvedValue({ ok: false })

      const user = userEvent.setup()
      renderLogin()

      await user.type(screen.getByPlaceholderText('admin'), 'admin@ciae.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'incorrecta')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      await waitFor(() => {
        expect(
          screen.getByText(/credenciales incorrectas/i)
        ).toBeInTheDocument()
      })
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(localStorage.getItem('ciae_token')).toBeNull()
    })

    it('error de red: muestra mensaje de "no fue posible conectar"', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))

      const user = userEvent.setup()
      renderLogin()

      await user.type(screen.getByPlaceholderText('admin'), 'admin@ciae.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      await waitFor(() => {
        expect(screen.getByText(/no fue posible conectar/i)).toBeInTheDocument()
      })
    })

    it('deshabilita el botón y muestra "Accediendo..." mientras carga', async () => {
      // Promesa que no resolvemos de inmediato, para capturar el estado "cargando"
      let resolveFetch
      global.fetch.mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = resolve
        })
      )

      const user = userEvent.setup()
      renderLogin()

      await user.type(screen.getByPlaceholderText('admin'), 'admin@ciae.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(screen.getByRole('button', { name: /accediendo/i })).toBeDisabled()

      // Limpiamos: resolvemos la promesa para no dejar el test colgado
      resolveFetch({ ok: true, json: async () => ({ access_token: 'x' }) })
      await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
    })
  })

  describe('recuperar contraseña', () => {
    it('cambia a la vista de recuperación al hacer clic en "¿Olvidaste tu contraseña?"', async () => {
      const user = userEvent.setup()
      renderLogin()

      await user.click(screen.getByText(/olvidaste tu contraseña/i))

      expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument()
    })

    it('muestra confirmación con el correo ingresado al enviar', async () => {
      const user = userEvent.setup()
      renderLogin()

      await user.click(screen.getByText(/olvidaste tu contraseña/i))
      await user.type(
        screen.getByPlaceholderText('admin@ciae.com'),
        'usuario@correo.com'
      )
      await user.click(
        screen.getByRole('button', { name: /enviar enlace de recuperación/i })
      )

      expect(screen.getByText(/revisa tu correo/i)).toBeInTheDocument()
      expect(screen.getByText('usuario@correo.com')).toBeInTheDocument()
    })

    it('regresa a la vista de login al hacer clic en "Volver a inicio de sesión"', async () => {
      const user = userEvent.setup()
      renderLogin()

      await user.click(screen.getByText(/olvidaste tu contraseña/i))
      await user.click(screen.getByText(/volver a inicio de sesión/i))

      expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument()
    })
  })
})
