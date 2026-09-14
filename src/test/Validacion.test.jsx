import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Validacion from '../pages/Validacion'

vi.mock('../services/api', () => ({
  API_URL: 'http://localhost:8000',
}))

// jsdom no implementa getUserMedia por default, hay que definirlo
beforeEach(() => {
  global.fetch = vi.fn()
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    },
    writable: true,
    configurable: true,
  })
})

describe('Validacion', () => {
  it('muestra la pestaña de búsqueda manual activa por defecto', () => {
    render(<Validacion />)
    const tabManual = screen.getByRole('tab', { name: /búsqueda manual/i })
    const tabQr = screen.getByRole('tab', { name: /escanear qr/i })

    expect(tabManual).toHaveAttribute('aria-selected', 'true')
    expect(tabQr).toHaveAttribute('aria-selected', 'false')
    expect(
      screen.getByLabelText(/número de folio asignado/i)
    ).toBeInTheDocument()
  })

  it('cambia el placeholder e input al seleccionar método CURP', async () => {
    const user = userEvent.setup()
    render(<Validacion />)

    await user.click(
      screen.getByRole('button', { name: /por curp del alumno/i })
    )

    expect(screen.getByLabelText(/curp del alumno/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/ABCD960101HDFXYZ01/i)
    ).toBeInTheDocument()
  })

  it('convierte el valor de búsqueda a mayúsculas cuando el método es CURP', async () => {
    const user = userEvent.setup()
    render(<Validacion />)

    await user.click(
      screen.getByRole('button', { name: /por curp del alumno/i })
    )
    const input = screen.getByLabelText(/curp del alumno/i)
    await user.type(input, 'abcd960101hdfxyz01')

    expect(input).toHaveValue('ABCD960101HDFXYZ01')
  })

  it('no busca si el campo está vacío', async () => {
    const user = userEvent.setup()
    render(<Validacion />)

    // El input es "required", pero probamos que no se dispare fetch con solo espacios
    const input = screen.getByLabelText(/número de folio/i)
    await user.type(input, '   ')
    // Forzamos el submit del form directamente para saltar la validación HTML "required"
    const form = input.closest('form')
    form.requestSubmit
      ? form.requestSubmit()
      : form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        )

    expect(global.fetch).not.toHaveBeenCalled()
  })

  describe('resultado de búsqueda exitosa', () => {
    it('muestra los datos del alumno y sus certificados', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          alumno: {
            nombre: 'Juana Pérez',
            curp: 'ABCD960101HDFXYZ01',
            activo: true,
          },
          certificados: [
            {
              id: 1,
              folio: 'CIAE-2026-001',
              curso_nombre: 'React Avanzado',
              instructor: 'Carlos Ruiz',
              duracion_horas: 40,
              fecha_emision: '2026-01-15',
              tiene_vigencia: true,
              fecha_vigencia: '2099-01-01', // futura, para simular "vigente"
              valido: true,
            },
          ],
        }),
      })

      const user = userEvent.setup()
      render(<Validacion />)

      await user.type(
        screen.getByLabelText(/número de folio/i),
        'CIAE-2026-001'
      )
      await user.click(
        screen.getByRole('button', { name: /consultar autenticidad/i })
      )

      await waitFor(() => {
        expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      })

      expect(screen.getByText(/curp: abcd960101hdfxyz01/i)).toBeInTheDocument()
      expect(screen.getByText(/padrón activo/i)).toBeInTheDocument()
      expect(screen.getByText('React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument()
      expect(screen.getByText(/40 horas/i)).toBeInTheDocument()
      expect(
        screen.getByText(/documento oficial acreditado/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/vigente hasta el:/i)).toBeInTheDocument()
    })

    it('muestra alerta de baja institucional cuando el alumno está inactivo', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          alumno: { nombre: 'Pedro Martínez', activo: false },
          certificados: [
            {
              id: 2,
              folio: 'CIAE-2026-002',
              curso_nombre: 'Python',
              instructor: 'Ana López',
              duracion_horas: 20,
              fecha_emision: '2026-01-01',
              tiene_vigencia: false,
              valido: true,
            },
          ],
        }),
      })

      const user = userEvent.setup()
      render(<Validacion />)

      await user.type(
        screen.getByLabelText(/número de folio/i),
        'CIAE-2026-002'
      )
      await user.click(
        screen.getByRole('button', { name: /consultar autenticidad/i })
      )

      await waitFor(() => {
        expect(screen.getByText(/baja institucional/i)).toBeInTheDocument()
      })

      expect(
        screen.getByText(/registros académicos inhabilitados/i)
      ).toBeInTheDocument()
      // Aun con tiene_vigencia:false, si el alumno está de baja el certificado se marca inválido
      expect(
        screen.getByText(/documento sin validez vigente/i)
      ).toBeInTheDocument()
    })

    it('marca un certificado como Expirado cuando la fecha de vigencia ya pasó', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          alumno: { nombre: 'Luis Gómez', activo: true },
          certificados: [
            {
              id: 3,
              folio: 'CIAE-2026-003',
              curso_nombre: 'Node.js',
              instructor: 'Sofía Díaz',
              duracion_horas: 30,
              fecha_emision: '2020-01-01',
              tiene_vigencia: true,
              fecha_vigencia: '2020-06-01', // fecha pasada
              valido: true,
            },
          ],
        }),
      })

      const user = userEvent.setup()
      render(<Validacion />)

      await user.type(
        screen.getByLabelText(/número de folio/i),
        'CIAE-2026-003'
      )
      await user.click(
        screen.getByRole('button', { name: /consultar autenticidad/i })
      )

      await waitFor(() => {
        expect(screen.getByText('Expirado')).toBeInTheDocument()
      })
      expect(screen.getByText(/caducó el:/i)).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay certificados asociados', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          alumno: { nombre: 'Marta Ruiz', activo: true },
          certificados: [],
        }),
      })

      const user = userEvent.setup()
      render(<Validacion />)

      await user.type(
        screen.getByLabelText(/número de folio/i),
        'SIN-CERTIFICADOS'
      )
      await user.click(
        screen.getByRole('button', { name: /consultar autenticidad/i })
      )

      await waitFor(() => {
        expect(
          screen.getByText(/no se encontraron cursos o certificados/i)
        ).toBeInTheDocument()
      })
      expect(screen.getByText('0 constancias')).toBeInTheDocument()
    })

    it('muestra el link a la constancia digital solo si el certificado tiene token_publico', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          alumno: { nombre: 'Ana Torres', activo: true },
          certificados: [
            {
              id: 4,
              folio: 'CIAE-2026-004',
              curso_nombre: 'Diseño UX',
              instructor: 'Jorge Ibáñez',
              duracion_horas: 25,
              fecha_emision: '2026-01-01',
              tiene_vigencia: false,
              valido: true,
              token_publico: 'tok-xyz',
            },
          ],
        }),
      })

      const user = userEvent.setup()
      render(<Validacion />)

      await user.type(
        screen.getByLabelText(/número de folio/i),
        'CIAE-2026-004'
      )
      await user.click(
        screen.getByRole('button', { name: /consultar autenticidad/i })
      )

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /constancia oficial digital/i })
        ).toHaveAttribute('href', '/validar/tok-xyz')
      })
    })
  })

  it('muestra mensaje de error si la búsqueda falla', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        detail: 'No se encontró información para los datos ingresados.',
      }),
    })

    const user = userEvent.setup()
    render(<Validacion />)

    await user.type(
      screen.getByLabelText(/número de folio/i),
      'FOLIO-INEXISTENTE'
    )
    await user.click(
      screen.getByRole('button', { name: /consultar autenticidad/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'No se encontró información para los datos ingresados.'
        )
      ).toBeInTheDocument()
    })
  })

  describe('pestaña de escaneo QR', () => {
    it('activa la cámara al cambiar a la pestaña QR', async () => {
      const user = userEvent.setup()
      render(<Validacion />)

      await user.click(screen.getByRole('tab', { name: /escanear qr/i }))

      await waitFor(() => {
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
          video: { facingMode: 'environment' },
        })
      })
      expect(
        screen.getByText(/apunta la cámara del dispositivo/i)
      ).toBeInTheDocument()
    })

    it('muestra un mensaje de error si no se puede acceder a la cámara', async () => {
      navigator.mediaDevices.getUserMedia = vi
        .fn()
        .mockRejectedValue(new Error('Permission denied'))

      const user = userEvent.setup()
      render(<Validacion />)

      await user.click(screen.getByRole('tab', { name: /escanear qr/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /no se pudo acceder a la cámara/i
        )
      })
    })
  })
})
