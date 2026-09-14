import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuloCursos from '../components/admin/ModuloCursos'

vi.mock('../services/api', () => ({
  API_URL: 'http://localhost:8000',
  getJsonHeaders: () => ({
    'Content-Type': 'application/json',
  }),
}))

const cursosBase = [
  {
    id: 1,
    nombre: 'React Avanzado',
    duracion_horas: 40,
    clave_curso: 'REACT-01',
    tiene_vigencia: true,
    meses_vigencia: 12,
  },
  {
    id: 2,
    nombre: 'Node.js Básico',
    duracion_horas: 20,
    clave_curso: 'NODE-01',
    tiene_vigencia: false,
    meses_vigencia: null,
  },
  {
    id: 3,
    nombre: 'Python Intermedio',
    duracion_horas: 30,
    clave_curso: null,
    tiene_vigencia: true,
    meses_vigencia: 6,
  },
]

const certificadosBase = [
  {
    id: 1,
    curso_id: 1,
    alumno_nombre: 'Juana Pérez',
    folio_manual: 'CIAE-001',
    fecha_emision: '2026-01-15',
    tiene_vigencia: true,
    fecha_vigencia: '2027-01-15',
  },
  {
    id: 2,
    curso_id: 1,
    alumno_nombre: 'Luis Gómez',
    folio_manual: 'CIAE-002',
    fecha_emision: '2026-02-01',
    tiene_vigencia: false,
  },
]

function renderModulo(overrides = {}) {
  const props = {
    cursos: cursosBase,
    certificados: certificadosBase,
    onRecargar: vi.fn(),
    onAlerta: vi.fn(),
    ...overrides,
  }
  return { ...render(<ModuloCursos {...props} />), props }
}

describe('ModuloCursos', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('listado y filtros', () => {
    it('muestra todos los cursos recibidos por props', () => {
      renderModulo()

      expect(screen.getByText('React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Node.js Básico')).toBeInTheDocument()
      expect(screen.getByText('Python Intermedio')).toBeInTheDocument()
    })

    it('muestra la etiqueta de vigencia o permanente según corresponda', () => {
      renderModulo()

      expect(screen.getByText('VIGENCIA 12 MESES')).toBeInTheDocument()
      expect(screen.getByText('PERMANENTE')).toBeInTheDocument()
      expect(screen.getByText('VIGENCIA 6 MESES')).toBeInTheDocument()
    })

    it('muestra el conteo de alumnos certificados por curso', () => {
      renderModulo()

      expect(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso react avanzado/i,
        })
      ).toHaveTextContent('Alumnos (2)')
      expect(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso node\.js básico/i,
        })
      ).toHaveTextContent('Alumnos (0)')
    })

    it('filtra cursos por texto de búsqueda (nombre o clave)', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar cursos/i), 'python')

      expect(screen.getByText('Python Intermedio')).toBeInTheDocument()
      expect(screen.queryByText('React Avanzado')).not.toBeInTheDocument()
    })

    it('filtra cursos por clave también', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar cursos/i), 'NODE-01')

      expect(screen.getByText('Node.js Básico')).toBeInTheDocument()
      expect(screen.queryByText('React Avanzado')).not.toBeInTheDocument()
    })

    it('filtra por "vigencia" mostrando solo cursos con vigencia', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'vigencia', exact: true })
      )

      expect(screen.getByText('React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Python Intermedio')).toBeInTheDocument()
      expect(screen.queryByText('Node.js Básico')).not.toBeInTheDocument()
    })

    it('filtra por "permanente" mostrando solo cursos sin vigencia', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'permanente', exact: true })
      )

      expect(screen.getByText('Node.js Básico')).toBeInTheDocument()
      expect(screen.queryByText('React Avanzado')).not.toBeInTheDocument()
    })

    it('el botón de limpiar filtros restablece búsqueda y filtro de vigencia', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar cursos/i), 'python')
      await user.click(
        screen.getByRole('button', { name: 'vigencia', exact: true })
      )
      await user.click(
        screen.getByRole('button', { name: /limpiar filtros de cursos/i })
      )

      expect(screen.getByLabelText(/buscar cursos/i)).toHaveValue('')
      expect(screen.getByText('React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Node.js Básico')).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay coincidencias', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(
        screen.getByLabelText(/buscar cursos/i),
        'curso-inexistente'
      )

      expect(
        screen.getByText(/no se encontraron cursos coincidentes/i)
      ).toBeInTheDocument()
    })
  })

  describe('paginación', () => {
    it('pagina correctamente cuando hay más de 5 cursos', () => {
      const muchosCursos = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        nombre: `Curso ${i + 1}`,
        duracion_horas: 10,
        clave_curso: null,
        tiene_vigencia: false,
      }))

      renderModulo({ cursos: muchosCursos, certificados: [] })

      // Página 1 muestra los primeros 5
      expect(screen.getByText('Curso 1')).toBeInTheDocument()
      expect(screen.getByText('Curso 5')).toBeInTheDocument()
      expect(screen.queryByText('Curso 6')).not.toBeInTheDocument()
    })

    it('al cambiar de página muestra los siguientes registros', async () => {
      const muchosCursos = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        nombre: `Curso ${i + 1}`,
        duracion_horas: 10,
        clave_curso: null,
        tiene_vigencia: false,
      }))
      const user = userEvent.setup()
      renderModulo({ cursos: muchosCursos, certificados: [] })

      await user.click(
        screen.getByRole('button', { name: /ir a la página 2 de cursos/i })
      )

      expect(screen.getByText('Curso 6')).toBeInTheDocument()
      expect(screen.getByText('Curso 7')).toBeInTheDocument()
      expect(screen.queryByText('Curso 1')).not.toBeInTheDocument()
    })

    it('vuelve a la página 1 al escribir en la búsqueda estando en otra página', async () => {
      const muchosCursos = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        nombre: `Curso ${i + 1}`,
        duracion_horas: 10,
        clave_curso: null,
        tiene_vigencia: false,
      }))
      const user = userEvent.setup()
      renderModulo({ cursos: muchosCursos, certificados: [] })

      await user.click(
        screen.getByRole('button', { name: /ir a la página 2 de cursos/i })
      )
      await user.type(screen.getByLabelText(/buscar cursos/i), 'Curso 7')

      expect(screen.getByText('Curso 7')).toBeInTheDocument()
    })
  })

  describe('formulario: crear curso', () => {
    it('muestra "Nuevo Curso" y "Registrar Curso" por defecto (sin edición)', () => {
      renderModulo()

      expect(
        screen.getByRole('heading', { name: /nuevo curso/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /registrar curso/i })
      ).toBeInTheDocument()
      expect(screen.queryByText(/modo edición/i)).not.toBeInTheDocument()
    })

    it('muestra el campo de meses de vigencia solo si se marca el checkbox', async () => {
      const user = userEvent.setup()
      renderModulo()

      expect(
        screen.queryByLabelText(/meses de vigencia/i)
      ).not.toBeInTheDocument()

      await user.click(
        screen.getByLabelText(/requiere renovación por vigencia/i)
      )

      expect(screen.getByLabelText(/meses de vigencia/i)).toBeInTheDocument()
    })

    it('crea un curso exitosamente (POST) y llama onRecargar + onAlerta', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(
        screen.getByLabelText(/nombre del programa/i),
        'Curso Nuevo'
      )
      await user.clear(screen.getByLabelText(/duración en horas/i))
      await user.type(screen.getByLabelText(/duración en horas/i), '15')
      await user.click(screen.getByRole('button', { name: /registrar curso/i }))

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/cursos',
        expect.objectContaining({ method: 'POST' })
      )
      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.nombre).toBe('Curso Nuevo')
      expect(bodyEnviado.duracion_horas).toBe(15)

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Curso registrado con éxito',
        'exito'
      )
      expect(props.onRecargar).toHaveBeenCalled()
    })

    it('muestra error del servidor si la creación falla (respuesta no ok)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'El nombre del curso ya existe' }),
      })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(
        screen.getByLabelText(/nombre del programa/i),
        'Duplicado'
      )
      await user.click(screen.getByRole('button', { name: /registrar curso/i }))

      expect(props.onAlerta).toHaveBeenCalledWith(
        'El nombre del curso ya existe',
        'error'
      )
      expect(props.onRecargar).not.toHaveBeenCalled()
    })

    it('muestra error de conexión si fetch falla', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/nombre del programa/i), 'Curso X')
      await user.click(screen.getByRole('button', { name: /registrar curso/i }))

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Error de conexión con el servidor',
        'error'
      )
    })
  })

  describe('formulario: editar curso', () => {
    it('al hacer clic en editar, precarga el formulario y cambia a modo edición', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar programa del curso react avanzado/i,
        })
      )

      expect(
        screen.getByRole('heading', { name: /modificar curso/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/modo edición/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre del programa/i)).toHaveValue(
        'React Avanzado'
      )
      expect(screen.getByLabelText(/duración en horas/i)).toHaveValue(40)
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
          name: /editar programa del curso react avanzado/i,
        })
      )
      await user.clear(screen.getByLabelText(/nombre del programa/i))
      await user.type(
        screen.getByLabelText(/nombre del programa/i),
        'React Avanzado Actualizado'
      )
      await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/cursos/1',
        expect.objectContaining({ method: 'PATCH' })
      )
      expect(props.onAlerta).toHaveBeenCalledWith(
        'Curso modificado correctamente',
        'exito'
      )
    })

    it('el botón "Cancelar" limpia el formulario y sale del modo edición', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar programa del curso react avanzado/i,
        })
      )
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(
        screen.getByRole('heading', { name: /nuevo curso/i })
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre del programa/i)).toHaveValue('')
    })
  })

  describe('modal de alumnos certificados', () => {
    it('abre el modal al hacer clic en "Alumnos" y muestra los certificados del curso', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso react avanzado/i,
        })
      )

      const modal = screen.getByRole('dialog')
      expect(within(modal).getByText('Juana Pérez')).toBeInTheDocument()
      expect(within(modal).getByText('Luis Gómez')).toBeInTheDocument()
      expect(within(modal).getByText(/folio: ciae-001/i)).toBeInTheDocument()
    })

    it('muestra mensaje si el curso no tiene certificados emitidos', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso node\.js básico/i,
        })
      )

      expect(
        screen.getByText(
          /aún no se han emitido certificados para este programa/i
        )
      ).toBeInTheDocument()
    })

    it('cierra el modal al hacer clic en "Cerrar"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso react avanzado/i,
        })
      )
      await user.click(
        screen.getByRole('button', { name: 'Cerrar', exact: true })
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('cierra el modal al hacer clic en la X', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /ver alumnos certificados en el curso react avanzado/i,
        })
      )
      await user.click(
        screen.getByRole('button', {
          name: /cerrar modal de alumnos certificados/i,
        })
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
