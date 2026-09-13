import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuloAlumnos from '../components/admin/ModuloAlumnos'

vi.mock('../services/api', () => ({
  API_URL: 'http://localhost:8000',
  getJsonHeaders: () => ({
    'Content-Type': 'application/json',
  }),
}))

const alumnosBase = [
  {
    id: 1,
    nombre: 'Juana',
    apellidos: 'Pérez',
    curp: 'PEGC900101HDFRNR09',
    email: 'juana@correo.com',
    telefono: '5512345678',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Luis',
    apellidos: 'Gómez',
    curp: 'GOML850505HDFMXS02',
    email: null,
    telefono: null,
    activo: false,
  },
]

const cursosBase = [
  { id: 1, nombre: 'React Avanzado' },
  { id: 2, nombre: 'Node.js Básico' },
]

const certificadosBase = [
  {
    id: 1,
    alumno_id: 1,
    curso_id: 1,
    folio_manual: 'CIAE-001',
    tiene_vigencia: true,
    fecha_vigencia: '2027-01-15',
  },
  {
    id: 2,
    alumno_id: 1,
    curso_id: 2,
    folio_manual: 'CIAE-002',
    tiene_vigencia: false,
  },
]

function renderModulo(overrides = {}) {
  const props = {
    alumnos: alumnosBase,
    cursos: cursosBase,
    certificados: certificadosBase,
    onRecargar: vi.fn(),
    onAlerta: vi.fn(),
    ...overrides,
  }
  return { ...render(<ModuloAlumnos {...props} />), props }
}

describe('ModuloAlumnos', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('listado y filtros', () => {
    it('muestra todos los alumnos recibidos por props', () => {
      renderModulo()

      expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      expect(screen.getByText('Luis Gómez')).toBeInTheDocument()
    })

    it('muestra la etiqueta ACTIVO o DADO DE BAJA según corresponda', () => {
      renderModulo()

      expect(screen.getByText('ACTIVO')).toBeInTheDocument()
      expect(screen.getByText('DADO DE BAJA')).toBeInTheDocument()
    })

    it('muestra el conteo de cursos/certificados por alumno', () => {
      renderModulo()

      expect(
        screen.getByRole('button', {
          name: /ver certificados y cursos inscritos de juana pérez/i,
        })
      ).toHaveTextContent('Cursos (2)')
      expect(
        screen.getByRole('button', {
          name: /ver certificados y cursos inscritos de luis gómez/i,
        })
      ).toHaveTextContent('Cursos (0)')
    })

    it('filtra alumnos por nombre completo', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar alumnos/i), 'Juana')

      expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      expect(screen.queryByText('Luis Gómez')).not.toBeInTheDocument()
    })

    it('filtra alumnos por CURP', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar alumnos/i), 'GOML850505')

      expect(screen.getByText('Luis Gómez')).toBeInTheDocument()
      expect(screen.queryByText('Juana Pérez')).not.toBeInTheDocument()
    })

    it('filtra alumnos por correo', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(
        screen.getByLabelText(/buscar alumnos/i),
        'juana@correo.com'
      )

      expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      expect(screen.queryByText('Luis Gómez')).not.toBeInTheDocument()
    })

    it('filtra por "activos"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'activos', exact: true })
      )

      expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      expect(screen.queryByText('Luis Gómez')).not.toBeInTheDocument()
    })

    it('filtra por "desactivados"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'desactivados', exact: true })
      )

      expect(screen.getByText('Luis Gómez')).toBeInTheDocument()
      expect(screen.queryByText('Juana Pérez')).not.toBeInTheDocument()
    })

    it('el botón de limpiar filtros restablece búsqueda y filtro de estado', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar alumnos/i), 'Juana')
      await user.click(
        screen.getByRole('button', { name: 'activos', exact: true })
      )
      await user.click(
        screen.getByRole('button', { name: /limpiar filtros de alumnos/i })
      )

      expect(screen.getByLabelText(/buscar alumnos/i)).toHaveValue('')
      expect(screen.getByText('Juana Pérez')).toBeInTheDocument()
      expect(screen.getByText('Luis Gómez')).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay coincidencias', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(
        screen.getByLabelText(/buscar alumnos/i),
        'nombre-inexistente'
      )

      expect(
        screen.getByText(
          /no se encontraron alumnos con los criterios seleccionados/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('formulario: alta de alumno', () => {
    it('muestra "Alta de Alumno" y "Registrar Alumno" por defecto', () => {
      renderModulo()

      expect(
        screen.getByRole('heading', { name: /alta de alumno/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /registrar alumno/i })
      ).toBeInTheDocument()
    })

    it('convierte el CURP a mayúsculas automáticamente', async () => {
      const user = userEvent.setup()
      renderModulo()

      const inputCurp = screen.getByLabelText(/curp \(18 caracteres\)/i)
      await user.type(inputCurp, 'pegc900101hdfrnr09')

      expect(inputCurp).toHaveValue('PEGC900101HDFRNR09')
    })

    it('registra un alumno exitosamente (POST) y llama onRecargar + onAlerta', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/nombre\(s\)/i), 'Ana')
      await user.type(screen.getByLabelText(/apellidos/i), 'Torres')
      await user.type(
        screen.getByLabelText(/curp \(18 caracteres\)/i),
        'TOAA950101MDFRRN08'
      )
      await user.click(
        screen.getByRole('button', { name: /registrar alumno/i })
      )

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/alumnos',
        expect.objectContaining({ method: 'POST' })
      )
      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.nombre).toBe('Ana')
      expect(bodyEnviado.apellidos).toBe('Torres')
      expect(bodyEnviado.curp).toBe('TOAA950101MDFRRN08')
      expect(bodyEnviado.email).toBeNull()

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Alumno registrado con éxito',
        'exito'
      )
      expect(props.onRecargar).toHaveBeenCalled()
    })

    it('envía email null si el campo queda vacío (no string vacío)', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/nombre\(s\)/i), 'Ana')
      await user.type(screen.getByLabelText(/apellidos/i), 'Torres')
      await user.type(
        screen.getByLabelText(/curp \(18 caracteres\)/i),
        'TOAA950101MDFRRN08'
      )
      await user.click(
        screen.getByRole('button', { name: /registrar alumno/i })
      )

      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.email).toBeNull()
      expect(bodyEnviado.telefono).toBeNull()
    })

    it('muestra error del servidor si el registro falla', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'CURP ya registrado' }),
      })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/nombre\(s\)/i), 'Ana')
      await user.type(screen.getByLabelText(/apellidos/i), 'Torres')
      await user.type(
        screen.getByLabelText(/curp \(18 caracteres\)/i),
        'TOAA950101MDFRRN08'
      )
      await user.click(
        screen.getByRole('button', { name: /registrar alumno/i })
      )

      expect(props.onAlerta).toHaveBeenCalledWith('CURP ya registrado', 'error')
      expect(props.onRecargar).not.toHaveBeenCalled()
    })

    it('muestra error de conexión si fetch falla', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/nombre\(s\)/i), 'Ana')
      await user.type(screen.getByLabelText(/apellidos/i), 'Torres')
      await user.type(
        screen.getByLabelText(/curp \(18 caracteres\)/i),
        'TOAA950101MDFRRN08'
      )
      await user.click(
        screen.getByRole('button', { name: /registrar alumno/i })
      )

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Error de conexión con el servidor',
        'error'
      )
    })
  })

  describe('formulario: editar alumno', () => {
    it('al hacer clic en editar, precarga el formulario', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar expediente de juana pérez/i,
        })
      )

      expect(
        screen.getByRole('heading', { name: /modificar alumno/i })
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre\(s\)/i)).toHaveValue('Juana')
      expect(screen.getByLabelText(/apellidos/i)).toHaveValue('Pérez')
      expect(screen.getByLabelText(/curp \(18 caracteres\)/i)).toHaveValue(
        'PEGC900101HDFRNR09'
      )
      expect(
        screen.getByRole('button', { name: /guardar cambios/i })
      ).toBeInTheDocument()
    })

    it('envía PATCH al endpoint correcto al guardar cambios', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar expediente de juana pérez/i,
        })
      )
      await user.clear(screen.getByLabelText(/nombre\(s\)/i))
      await user.type(
        screen.getByLabelText(/nombre\(s\)/i),
        'Juana Actualizada'
      )
      await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/alumnos/1',
        expect.objectContaining({ method: 'PATCH' })
      )
      expect(props.onAlerta).toHaveBeenCalledWith(
        'Alumno actualizado con éxito',
        'exito'
      )
    })

    it('el botón "Cancelar" limpia el formulario y sale del modo edición', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar expediente de juana pérez/i,
        })
      )
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(
        screen.getByRole('heading', { name: /alta de alumno/i })
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre\(s\)/i)).toHaveValue('')
    })
  })

  describe('modal de cursos del alumno', () => {
    it('abre el modal y muestra los cursos/certificados del alumno', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver certificados y cursos inscritos de juana pérez/i,
        })
      )

      const modal = screen.getByRole('dialog')
      expect(within(modal).getByText('React Avanzado')).toBeInTheDocument()
      expect(within(modal).getByText('Node.js Básico')).toBeInTheDocument()
      expect(within(modal).getByText(/folio: ciae-001/i)).toBeInTheDocument()
    })

    it('muestra mensaje si el alumno no tiene certificados', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver certificados y cursos inscritos de luis gómez/i,
        })
      )

      expect(
        screen.getByText(/sin certificados emitidos todavía/i)
      ).toBeInTheDocument()
    })

    it('cierra el modal al hacer clic en "Cerrar"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver certificados y cursos inscritos de juana pérez/i,
        })
      )
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('baja y reactivación de alumno (con confirmación por contraseña)', () => {
    it('abre el modal de confirmación de baja para un alumno activo', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )

      expect(
        screen.getByRole('heading', { name: /confirmar baja institucional/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/¿autorizas dar de baja al alumno/i)
      ).toBeInTheDocument()
    })

    it('abre el modal de confirmación de reactivación para un alumno inactivo', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /reactivar en el padrón a luis gómez/i,
        })
      )

      expect(
        screen.getByRole('heading', { name: /reactivar alumno/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/¿autorizas reactivar al alumno/i)
      ).toBeInTheDocument()
    })

    it('muestra error si se intenta confirmar con la contraseña en blanco (solo espacios)', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )
      // Usamos un espacio en vez de dejarlo vacío: el atributo HTML "required"
      // solo exige que el campo no esté vacío, así que un espacio pasa la
      // validación nativa del navegador, mientras que el "password.trim()"
      // de tu componente sigue rechazándolo correctamente.
      await user.type(
        screen.getByLabelText(/contraseña de administrador/i),
        ' '
      )
      await user.click(screen.getByRole('button', { name: /confirmar/i }))

      expect(
        screen.getByText(/ingresa tu contraseña de administrador/i)
      ).toBeInTheDocument()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('confirma la baja exitosamente con contraseña correcta', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )
      await user.type(
        screen.getByLabelText(/contraseña de administrador/i),
        'admin123'
      )
      await user.click(screen.getByRole('button', { name: /confirmar/i }))

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/alumnos/1/estado',
        expect.objectContaining({ method: 'PATCH' })
      )
      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.activo).toBe(false)
      expect(bodyEnviado.admin_password).toBe('admin123')

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Alumno dado de baja correctamente.',
        'exito'
      )
      expect(props.onRecargar).toHaveBeenCalled()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('confirma la reactivación exitosamente', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /reactivar en el padrón a luis gómez/i,
        })
      )
      await user.type(
        screen.getByLabelText(/contraseña de administrador/i),
        'admin123'
      )
      await user.click(screen.getByRole('button', { name: /confirmar/i }))

      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.activo).toBe(true)

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Alumno reactivado correctamente.',
        'exito'
      )
    })

    it('muestra error si la contraseña es incorrecta (respuesta no ok del servidor)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({
          detail: 'Contraseña de administrador incorrecta',
        }),
      })
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )
      await user.type(
        screen.getByLabelText(/contraseña de administrador/i),
        'incorrecta'
      )
      await user.click(screen.getByRole('button', { name: /confirmar/i }))

      expect(
        await screen.findByText('Contraseña de administrador incorrecta')
      ).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('muestra error de conexión si falla la petición', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )
      await user.type(
        screen.getByLabelText(/contraseña de administrador/i),
        'admin123'
      )
      await user.click(screen.getByRole('button', { name: /confirmar/i }))

      expect(await screen.findByText(/error de conexión/i)).toBeInTheDocument()
    })

    it('cierra el modal de confirmación con "Cancelar" sin ejecutar el cambio', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /dar de baja institucional a juana pérez/i,
        })
      )
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })
})
