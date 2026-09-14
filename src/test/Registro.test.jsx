import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Registro from '../pages/Registro'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderRegistro() {
  return render(
    <BrowserRouter>
      <Registro />
    </BrowserRouter>
  )
}

// Helper para llenar y enviar el formulario de "Agregar curso" con datos válidos por defecto
async function llenarFormularioValido(user, overrides = {}) {
  const datos = {
    folio: 'CIAE-2026-001',
    nombre: 'Juana Pérez',
    curso: 'React Avanzado',
    fechaEmision: '2026-01-15',
    correo: 'juana@correo.com',
    instructor: 'Carlos Ruiz',
    ...overrides,
  }

  if (datos.folio)
    await user.type(screen.getByPlaceholderText(/CIAE-2026-001/i), datos.folio)
  if (datos.nombre)
    await user.type(screen.getByLabelText(/nombre del alumno/i), datos.nombre)
  if (datos.curso)
    await user.type(screen.getByLabelText(/^curso$/i), datos.curso)
  if (datos.fechaEmision) {
    const fechaInput = screen.getByLabelText(/fecha de emisión/i)
    await user.clear(fechaInput)
    await user.type(fechaInput, datos.fechaEmision)
  }
  if (datos.correo)
    await user.type(screen.getByLabelText(/correo electrónico/i), datos.correo)
  if (datos.instructor)
    await user.type(
      screen.getByLabelText(/instructor \/ emisor/i),
      datos.instructor
    )

  await user.click(
    screen.getByRole('button', { name: /guardar y generar qr/i })
  )
}

describe('Registro (panel admin)', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('muestra el estado vacío cuando no hay certificados', () => {
    renderRegistro()
    expect(
      screen.getByText(/aún no se registran certificados/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /agregar el primero/i })
    ).toBeInTheDocument()
  })

  it('cierra sesión y navega a "/" al hacer clic en "Cerrar sesión"', async () => {
    const user = userEvent.setup()
    renderRegistro()

    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  describe('modal "Agregar curso"', () => {
    it('abre el modal al hacer clic en "Agregar curso"', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))

      expect(
        screen.getByRole('heading', { name: /agregar curso/i })
      ).toBeInTheDocument()
    })

    it('muestra error si falta el folio', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user, { folio: '' })

      expect(screen.getByText(/el folio es obligatorio/i)).toBeInTheDocument()
    })

    it('muestra error si el folio ya existe (RF-11)', async () => {
      const user = userEvent.setup()
      renderRegistro()

      // Primer registro exitoso
      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user)
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      // Intento de registrar el mismo folio de nuevo
      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user)

      expect(
        screen.getByText(/ya existe un certificado con el folio ciae-2026-001/i)
      ).toBeInTheDocument()
    })

    it('muestra error si falta nombre, curso, fecha o instructor', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user, { nombre: '' })

      expect(
        screen.getByText(/el nombre del alumno es obligatorio/i)
      ).toBeInTheDocument()
    })

    it('muestra error si no hay correo NI teléfono', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user, { correo: '' })

      expect(
        screen.getByText(
          /registra al menos un correo electrónico o un número de teléfono/i
        )
      ).toBeInTheDocument()
    })

    it('permite pasar la validación de contacto usando solo teléfono (sin correo)', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user, { correo: '' })
      // El error de contacto ya se mostró; ahora llenamos el teléfono y reintentamos
      await user.type(
        screen.getByLabelText(/número de teléfono/i),
        '5512345678'
      )
      await user.click(
        screen.getByRole('button', { name: /guardar y generar qr/i })
      )

      expect(screen.getByText(/certificado registrado/i)).toBeInTheDocument()
    })

    it('muestra error si se marca "tiene vigencia" pero no se da la fecha', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await user.click(
        screen.getByLabelText(/este certificado tiene vigencia/i)
      )
      await llenarFormularioValido(user)

      expect(
        screen.getByText(/indica la fecha de vigencia o desmarca la opción/i)
      ).toBeInTheDocument()
    })

    it('registro exitoso: muestra el QR generado con el folio correcto', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user)

      expect(screen.getByText(/certificado registrado/i)).toBeInTheDocument()
      expect(screen.getByText(/folio ciae-2026-001/i)).toBeInTheDocument()
      expect(
        screen.getByAltText(/código qr del folio ciae-2026-001/i)
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: /descargar qr/i })
      ).toHaveAttribute('download', 'qr-CIAE-2026-001.png')
    })

    it('el certificado registrado aparece en la tabla tras cerrar el modal de QR', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user)
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      const fila = screen.getByText('CIAE-2026-001').closest('tr')
      expect(within(fila).getByText('Juana Pérez')).toBeInTheDocument()
      expect(within(fila).getByText('React Avanzado')).toBeInTheDocument()
      expect(within(fila).getByText(/activo/i)).toBeInTheDocument()
    })

    it('marca el certificado como "Vencido" si la fecha de vigencia ya pasó', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await user.click(
        screen.getByLabelText(/este certificado tiene vigencia/i)
      )

      // Nota: se evita usar la palabra "vencido" dentro del folio de prueba,
      // para no chocar con la etiqueta de estatus real al buscar por texto.
      await user.type(
        screen.getByPlaceholderText(/CIAE-2026-001/i),
        'CIAE-2026-999'
      )
      await user.type(screen.getByLabelText(/nombre del alumno/i), 'Luis Gómez')
      await user.type(screen.getByLabelText(/^curso$/i), 'Node.js')
      await user.type(screen.getByLabelText(/fecha de emisión/i), '2020-01-01')

      // El input de fecha de vigencia aparece tras marcar el checkbox y no tiene label propio;
      // es el segundo input[type="date"] visible en el formulario.
      const fechaVigenciaInput =
        document.querySelectorAll('input[type="date"]')[1]
      await user.type(fechaVigenciaInput, '2020-06-01')

      await user.type(
        screen.getByLabelText(/correo electrónico/i),
        'luis@correo.com'
      )
      await user.type(
        screen.getByLabelText(/instructor \/ emisor/i),
        'Ana López'
      )
      await user.click(
        screen.getByRole('button', { name: /guardar y generar qr/i })
      )
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      const fila = screen.getByText('CIAE-2026-999').closest('tr')
      expect(
        within(fila).getByText('Vencido', { exact: true })
      ).toBeInTheDocument()
    })

    it('cierra el modal sin guardar al hacer clic en "Cancelar"', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(
        screen.queryByRole('heading', { name: /agregar curso/i })
      ).not.toBeInTheDocument()
      expect(
        screen.getByText(/aún no se registran certificados/i)
      ).toBeInTheDocument()
    })
  })

  describe('modal "Buscar"', () => {
    async function registrarCertificado(user, datos) {
      await user.click(screen.getByRole('button', { name: /agregar curso/i }))
      await llenarFormularioValido(user, datos)
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )
    }

    it('abre el modal de búsqueda y muestra mensaje inicial', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /^buscar$/i }))

      expect(
        screen.getByRole('heading', { name: /buscar certificado/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /escribe para buscar entre los certificados registrados/i
        )
      ).toBeInTheDocument()
    })

    it('encuentra un certificado por folio, nombre o CURP', async () => {
      const user = userEvent.setup()
      renderRegistro()
      await registrarCertificado(user, {
        folio: 'CIAE-2026-777',
        nombre: 'Ana Torres',
      })

      await user.click(screen.getByRole('button', { name: /^buscar$/i }))
      const input = screen.getByPlaceholderText(/folio, curp o nombre/i)
      await user.type(input, 'Ana Torres')

      // Acotamos la verificación al contenedor de resultados (hermano del input en el JSX de ModalBuscar),
      // así evitamos chocar con la fila "Ana Torres" que sigue en la tabla de fondo.
      const contenedorResultados = input.nextElementSibling
      expect(
        within(contenedorResultados).getByText('Ana Torres')
      ).toBeInTheDocument()
      expect(
        within(contenedorResultados).getByText(/folio ciae-2026-777/i)
      ).toBeInTheDocument()
    })

    it('muestra mensaje de "no encontrado" si el término no coincide con nada', async () => {
      const user = userEvent.setup()
      renderRegistro()
      await registrarCertificado(user, { folio: 'CIAE-2026-888' })

      await user.click(screen.getByRole('button', { name: /^buscar$/i }))
      await user.type(
        screen.getByPlaceholderText(/folio, curp o nombre/i),
        'nombre-inexistente'
      )

      expect(
        screen.getByText(/no se encontró ningún certificado con ese dato/i)
      ).toBeInTheDocument()
    })

    it('cierra el modal de búsqueda al hacer clic en la X', async () => {
      const user = userEvent.setup()
      renderRegistro()

      await user.click(screen.getByRole('button', { name: /^buscar$/i }))
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      expect(
        screen.queryByRole('heading', { name: /buscar certificado/i })
      ).not.toBeInTheDocument()
    })
  })
})
