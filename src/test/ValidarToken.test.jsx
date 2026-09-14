import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ValidarToken from '../pages/ValidarToken'

vi.mock('../services/api', () => ({
  API_URL: 'http://localhost:8000',
}))

function renderConToken(token = 'ABC123') {
  return render(
    <MemoryRouter initialEntries={[`/validar/${token}`]}>
      <Routes>
        <Route path="/validar/:token" element={<ValidarToken />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ValidarToken', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('muestra el estado de carga inicial', () => {
    global.fetch.mockReturnValue(new Promise(() => {}))
    renderConToken()
    expect(
      screen.getByText(/consultando registro institucional/i)
    ).toBeInTheDocument()
  })

  it('certificado válido y vigente: muestra los datos completos', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valido: true,
        vigente: true,
        alumno_activo: true,
        folio: 'CIAE-2026-001',
        alumno_nombre: 'Juana Pérez',
        curso_nombre: 'React Avanzado',
        instructor: 'Carlos Ruiz',
        duracion_horas: 40,
        fecha_emision: '2026-01-15',
        tiene_vigencia: true,
        fecha_vigencia: '2027-01-15',
      }),
    })

    renderConToken('CIAE-2026-001')

    await waitFor(() => {
      expect(
        screen.getByText(/certificado oficial válido/i)
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
    expect(screen.getByText('React Avanzado')).toBeInTheDocument()
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument()
    expect(screen.getByText(/40 horas/i)).toBeInTheDocument()
    expect(screen.getByText(/15\/01\/2026/)).toBeInTheDocument()
    expect(
      screen.getByText(/vigente hasta el 15\/01\/2027/i)
    ).toBeInTheDocument()
  })

  it('certificado vencido: muestra el mensaje de vencimiento', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valido: true,
        vigente: false,
        alumno_activo: true,
        motivo_invalidez: 'CERTIFICADO_VENCIDO',
        folio: 'CIAE-2026-002',
        alumno_nombre: 'Luis Gómez',
        curso_nombre: 'Node.js',
        instructor: 'Ana López',
        duracion_horas: 30,
        fecha_emision: '2024-01-01',
        tiene_vigencia: true,
        fecha_vigencia: '2025-01-01',
      }),
    })

    renderConToken('CIAE-2026-002')

    await waitFor(() => {
      expect(screen.getByText(/certificado vencido/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/expiró el 01\/01\/2025/i)).toBeInTheDocument()
  })

  it('alumno dado de baja: muestra "Certificado Inhabilitado" y la alerta correspondiente', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valido: true,
        vigente: true,
        alumno_activo: false,
        motivo_invalidez: 'ALUMNO_DADO_DE_BAJA',
        folio: 'CIAE-2026-003',
        alumno_nombre: 'Pedro Martínez',
        curso_nombre: 'Python',
        instructor: 'Sofía Díaz',
        duracion_horas: 20,
        fecha_emision: '2026-02-01',
        tiene_vigencia: false,
      }),
    })

    renderConToken('CIAE-2026-003')

    await waitFor(() => {
      expect(screen.getByText(/certificado inhabilitado/i)).toBeInTheDocument()
    })

    expect(
      screen.getByText(/documento oficialmente suspendido/i)
    ).toBeInTheDocument()
    expect(screen.getByText('INACTIVO')).toBeInTheDocument()
    expect(
      screen.getByText(/no vigente \(baja institucional\)/i)
    ).toBeInTheDocument()
  })

  it('token no encontrado: muestra "Certificado No Válido" y el link de búsqueda manual', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Certificado no encontrado' }),
    })

    renderConToken('TOKEN-INEXISTENTE')

    await waitFor(() => {
      expect(screen.getByText(/certificado no válido/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Certificado no encontrado')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /búsqueda manual/i })
    ).toHaveAttribute('href', '/validacion-cursos')
  })

  it('error de red: muestra el mensaje de error capturado', async () => {
    global.fetch.mockRejectedValue(new Error('Failed to fetch'))

    renderConToken('CUALQUIER-TOKEN')

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })
  })

  it('certificado sin vigencia (permanente): muestra "Sin caducidad"', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valido: true,
        vigente: true,
        alumno_activo: true,
        folio: 'CIAE-2026-004',
        alumno_nombre: 'Marta Ruiz',
        curso_nombre: 'Diplomado Permanente',
        instructor: 'Jorge Ibáñez',
        duracion_horas: 100,
        fecha_emision: '2026-03-01',
        tiene_vigencia: false,
      }),
    })

    renderConToken('CIAE-2026-004')

    await waitFor(() => {
      expect(
        screen.getByText(/permanente \/ sin caducidad/i)
      ).toBeInTheDocument()
    })
  })

  it('hace la petición al endpoint correcto usando el token de la URL', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ valido: true, vigente: true, alumno_activo: true }),
    })

    renderConToken('MI-TOKEN-UNICO')

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/public/validar/MI-TOKEN-UNICO'
    )
  })
})
