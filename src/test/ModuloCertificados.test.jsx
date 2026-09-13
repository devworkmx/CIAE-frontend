import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuloCertificados from '../components/admin/ModuloCertificados'

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
    clave_curso: null,
    tiene_vigencia: false,
  },
]

const alumnosBase = [
  { id: 1, nombre: 'Juana', apellidos: 'Pérez', curp: 'PEGC900101HDFRNR09' },
  { id: 2, nombre: 'Luis', apellidos: 'Gómez', curp: 'GOML850505HDFMXS02' },
]

const certificadosBase = [
  {
    id: 1,
    alumno_id: 1,
    curso_id: 1,
    alumno_nombre: 'Juana Pérez',
    curso_nombre: 'React Avanzado',
    folio_manual: 'CIAE-001',
    fecha_emision: '2026-01-15',
    tiene_vigencia: true,
    fecha_vigencia: '2099-01-01',
    instructor: 'Carlos Ruiz',
    token_publico: 'tok1',
  },
  {
    id: 2,
    alumno_id: 2,
    curso_id: 2,
    alumno_nombre: 'Luis Gómez',
    curso_nombre: 'Node.js Básico',
    folio_manual: 'CIAE-002',
    fecha_emision: '2026-02-01',
    tiene_vigencia: false,
    instructor: 'Ana López',
    token_publico: 'tok2',
  },
  {
    id: 3,
    alumno_id: 1,
    curso_id: 1,
    alumno_nombre: 'Rosa Ibáñez',
    curso_nombre: 'React Avanzado',
    folio_manual: 'CIAE-003',
    fecha_emision: '2020-01-01',
    tiene_vigencia: true,
    fecha_vigencia: '2020-06-01',
    instructor: 'Carlos Ruiz',
    token_publico: 'tok3',
  },
]

function renderModulo(overrides = {}) {
  const props = {
    cursos: cursosBase,
    alumnos: alumnosBase,
    certificados: certificadosBase,
    onRecargar: vi.fn(),
    onAlerta: vi.fn(),
    ...overrides,
  }
  return { ...render(<ModuloCertificados {...props} />), props }
}

async function seleccionarCurso(user, nombreCurso) {
  await user.click(
    screen.getByPlaceholderText(/buscar curso por nombre o clave/i)
  )
  await user.click(
    await screen.findByRole('button', { name: new RegExp(nombreCurso, 'i') })
  )
}

// FIX: el regex genérico /nombreAlumno/i podía matchear también los botones
// "Editar certificado folio ... de <alumno>" y "Descargar código QR para
// certificado de <alumno>" de la tabla, que incluyen el nombre del alumno en
// su aria-label. Para desambiguar, nos quedamos solo con la opción del
// dropdown de búsqueda: es la única que NO tiene aria-label (su nombre
// accesible viene del texto interno, no de un atributo aria-label).
async function seleccionarAlumno(user, nombreAlumno) {
  await user.click(
    screen.getByPlaceholderText(/buscar alumno por nombre o curp/i)
  )

  const opciones = await screen.findAllByRole('button', {
    name: new RegExp(nombreAlumno, 'i'),
  })
  const opcionDropdown = opciones.find(
    (boton) => !boton.hasAttribute('aria-label')
  )

  if (!opcionDropdown) {
    throw new Error(
      `No se encontró la opción de dropdown para el alumno "${nombreAlumno}". ` +
        `Botones encontrados: ${opciones.map((b) => b.getAttribute('aria-label') || b.textContent).join(' | ')}`
    )
  }

  await user.click(opcionDropdown)
}

describe('ModuloCertificados', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('listado y filtros', () => {
    it('muestra todos los certificados recibidos por props', () => {
      renderModulo()

      expect(
        screen.getByText(/CIAE-001/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/CIAE-002/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/CIAE-003/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
    })

    it('muestra la etiqueta PERMANENTE, VIGENTE o EXPIRADO según corresponda', () => {
      renderModulo()

      expect(screen.getByText('PERMANENTE')).toBeInTheDocument()
      expect(screen.getByText('VIGENTE')).toBeInTheDocument()
      expect(screen.getByText('EXPIRADO')).toBeInTheDocument()
    })

    it('filtra certificados por folio', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar certificados/i), 'CIAE-002')

      // ignore: '.sr-only' porque el componente ahora incluye un
      // <span class="sr-only">del folio CIAE-XXX de <alumno></span> junto al
      // <p> visible con el mismo folio, y eso duplica el texto en el DOM.
      expect(
        screen.getByText(/CIAE-002/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-001/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
    })

    it('filtra certificados por alumno', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(
        screen.getByLabelText(/buscar certificados/i),
        'Rosa Ibáñez'
      )

      expect(
        screen.getByText(/CIAE-003/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-001/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
    })

    it('filtra por "vigentes"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'vigentes', exact: true })
      )

      expect(
        screen.getByText(/CIAE-001/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-002/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-003/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
    })

    it('filtra por "expirados"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'expirados', exact: true })
      )

      expect(
        screen.getByText(/CIAE-003/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-001/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
    })

    it('filtra por "permanente"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', { name: 'permanente', exact: true })
      )

      expect(
        screen.getByText(/CIAE-002/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/CIAE-001/, { ignore: '.sr-only' })
      ).not.toBeInTheDocument()
    })

    it('el botón de limpiar filtros restablece búsqueda y filtro', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar certificados/i), 'CIAE-001')
      await user.click(
        screen.getByRole('button', { name: /limpiar filtros de certificados/i })
      )

      expect(screen.getByLabelText(/buscar certificados/i)).toHaveValue('')
      expect(
        screen.getByText(/CIAE-002/, { ignore: '.sr-only' })
      ).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay coincidencias', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.type(
        screen.getByLabelText(/buscar certificados/i),
        'folio-inexistente'
      )

      expect(
        screen.getByText(/no se encontraron certificados registrados/i)
      ).toBeInTheDocument()
    })
  })

  describe('selector de curso y alumno (combobox)', () => {
    it('muestra el buscador de curso por defecto (sin selección)', () => {
      renderModulo()
      expect(
        screen.getByPlaceholderText(/buscar curso por nombre o clave/i)
      ).toBeInTheDocument()
    })

    it('al seleccionar un curso, muestra la vista colapsada con botón "Cambiar"', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarCurso(user, 'React Avanzado')

      expect(
        screen.queryByPlaceholderText(/buscar curso por nombre o clave/i)
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cambiar/i })
      ).toBeInTheDocument()
    })

    it('el botón "Cambiar" permite volver a elegir otro curso', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarCurso(user, 'React Avanzado')
      await user.click(screen.getByRole('button', { name: /cambiar/i }))

      expect(
        screen.getByPlaceholderText(/buscar curso por nombre o clave/i)
      ).toBeInTheDocument()
    })

    it('al seleccionar un alumno, muestra su CURP en la vista colapsada', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarAlumno(user, 'Juana Pérez')

      expect(
        screen.queryByPlaceholderText(/buscar alumno por nombre o curp/i)
      ).not.toBeInTheDocument()
      expect(screen.getByText(/PEGC900101HDFRNR09/)).toBeInTheDocument()
    })
  })

  describe('lógica automática de vigencia según el curso', () => {
    it('al elegir un curso CON vigencia, marca el checkbox y calcula la fecha de expiración', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarCurso(user, 'React Avanzado')

      expect(
        screen.getByLabelText(/establecer fecha límite de vigencia/i)
      ).toBeChecked()
      expect(screen.getByLabelText(/fecha de expiración/i)).toBeInTheDocument()
    })

    it('al elegir un curso SIN vigencia, no marca el checkbox ni muestra fecha de expiración', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarCurso(user, 'Node.js Básico')

      expect(
        screen.getByLabelText(/establecer fecha límite de vigencia/i)
      ).not.toBeChecked()
      expect(
        screen.queryByLabelText(/fecha de expiración/i)
      ).not.toBeInTheDocument()
    })

    it('al cambiar la fecha de emisión con un curso de vigencia ya elegido, recalcula la fecha de expiración', async () => {
      const user = userEvent.setup()
      renderModulo()

      await seleccionarCurso(user, 'React Avanzado')

      const inputEmision = screen.getByLabelText(/fecha de emisión/i)
      await user.clear(inputEmision)
      await user.type(inputEmision, '2026-01-15')

      expect(screen.getByLabelText(/fecha de expiración/i)).toHaveValue(
        '2027-01-15'
      )
    })
  })

  describe('guardar certificado', () => {
    it('muestra error si se intenta guardar sin seleccionar curso o alumno', async () => {
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/folio manual único/i), 'CIAE-999')
      await user.type(
        screen.getByLabelText(/instructor \/ evaluador/i),
        'Mtro. Pérez'
      )
      await user.click(
        screen.getByRole('button', { name: /generar certificado/i })
      )

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Selecciona tanto el curso como el alumno titular',
        'error'
      )
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('crea un certificado exitosamente (POST) con los datos correctos', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await seleccionarCurso(user, 'Node.js Básico')
      await seleccionarAlumno(user, 'Juana Pérez')
      await user.type(screen.getByLabelText(/folio manual único/i), 'CIAE-999')
      await user.type(
        screen.getByLabelText(/instructor \/ evaluador/i),
        'Mtro. Pérez'
      )
      await user.click(
        screen.getByRole('button', { name: /generar certificado/i })
      )

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/certificados',
        expect.objectContaining({ method: 'POST' })
      )
      const bodyEnviado = JSON.parse(global.fetch.mock.calls[0][1].body)
      expect(bodyEnviado.folio_manual).toBe('CIAE-999')
      expect(bodyEnviado.curso_id).toBe(2)
      expect(bodyEnviado.alumno_id).toBe(1)
      expect(bodyEnviado.instructor).toBe('Mtro. Pérez')
      expect(bodyEnviado.tiene_vigencia).toBe(false)
      expect(bodyEnviado.fecha_vigencia).toBeNull()

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Certificado emitido con éxito',
        'exito'
      )
      expect(props.onRecargar).toHaveBeenCalled()
    })

    it('muestra error del servidor si la creación falla', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Folio ya registrado' }),
      })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await seleccionarCurso(user, 'Node.js Básico')
      await seleccionarAlumno(user, 'Juana Pérez')
      await user.type(screen.getByLabelText(/folio manual único/i), 'CIAE-001')
      await user.type(
        screen.getByLabelText(/instructor \/ evaluador/i),
        'Mtro. Pérez'
      )
      await user.click(
        screen.getByRole('button', { name: /generar certificado/i })
      )

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Folio ya registrado',
        'error'
      )
      expect(props.onRecargar).not.toHaveBeenCalled()
    })

    it('muestra error de conexión si fetch falla', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))
      const user = userEvent.setup()
      const { props } = renderModulo()

      await seleccionarCurso(user, 'Node.js Básico')
      await seleccionarAlumno(user, 'Juana Pérez')
      await user.type(screen.getByLabelText(/folio manual único/i), 'CIAE-999')
      await user.type(
        screen.getByLabelText(/instructor \/ evaluador/i),
        'Mtro. Pérez'
      )
      await user.click(
        screen.getByRole('button', { name: /generar certificado/i })
      )

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Error de conexión con el servidor',
        'error'
      )
    })
  })

  describe('editar certificado', () => {
    it('precarga el formulario con curso, alumno y datos del certificado', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar certificado folio ciae-001 de juana pérez/i,
        })
      )

      const formSeccion = screen
        .getByRole('heading', { name: /modificar certificado/i })
        .closest('section')

      expect(screen.getByLabelText(/folio manual único/i)).toHaveValue(
        'CIAE-001'
      )
      expect(screen.getByLabelText(/instructor \/ evaluador/i)).toHaveValue(
        'Carlos Ruiz'
      )
      expect(screen.getByLabelText(/fecha de emisión/i)).toHaveValue(
        '2026-01-15'
      )
      expect(
        screen.getByLabelText(/establecer fecha límite de vigencia/i)
      ).toBeChecked()
      expect(screen.getByLabelText(/fecha de expiración/i)).toHaveValue(
        '2099-01-01'
      )
      expect(
        within(formSeccion).getByText('React Avanzado')
      ).toBeInTheDocument()
    })

    it('envía PATCH al endpoint correcto al guardar cambios', async () => {
      global.fetch.mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar certificado folio ciae-001 de juana pérez/i,
        })
      )
      await user.clear(screen.getByLabelText(/instructor \/ evaluador/i))
      await user.type(
        screen.getByLabelText(/instructor \/ evaluador/i),
        'Nuevo Instructor'
      )
      await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/certificados/1',
        expect.objectContaining({ method: 'PATCH' })
      )
      expect(props.onAlerta).toHaveBeenCalledWith(
        'Certificado actualizado',
        'exito'
      )
    })

    it('el botón "Cancelar" limpia el formulario y sale del modo edición', async () => {
      const user = userEvent.setup()
      renderModulo()

      await user.click(
        screen.getByRole('button', {
          name: /editar certificado folio ciae-001 de juana pérez/i,
        })
      )
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(
        screen.getByRole('heading', { name: /emitir certificado/i })
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/folio manual único/i)).toHaveValue('')
    })
  })

  describe('descarga de código QR', () => {
    beforeEach(() => {
      window.URL.createObjectURL = vi.fn(() => 'blob:fake-url')
      window.URL.revokeObjectURL = vi.fn()
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
        () => {}
      )
    })

    it('descarga el QR correctamente al hacer clic', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        blob: async () => new Blob(['contenido-falso-del-qr']),
      })
      const user = userEvent.setup()
      renderModulo()

      await user.type(screen.getByLabelText(/buscar certificados/i), 'CIAE-001')
      await user.click(
        screen.getByRole('button', {
          name: /descargar código qr para certificado de juana pérez/i,
        })
      )

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          'http://localhost:8000/api/certificados/1/qr?base_url='
        ),
        expect.objectContaining({ headers: expect.any(Object) })
      )
      expect(window.URL.createObjectURL).toHaveBeenCalled()
      expect(window.URL.revokeObjectURL).toHaveBeenCalled()
    })

    it('muestra error si la descarga del QR falla', async () => {
      global.fetch.mockResolvedValue({ ok: false })
      const user = userEvent.setup()
      const { props } = renderModulo()

      await user.type(screen.getByLabelText(/buscar certificados/i), 'CIAE-001')
      await user.click(
        screen.getByRole('button', {
          name: /descargar código qr para certificado de juana pérez/i,
        })
      )

      expect(props.onAlerta).toHaveBeenCalledWith(
        'Error al descargar el código QR',
        'error'
      )
    })
  })

  describe('link de validación pública', () => {
    it('genera el link con el token público correcto', () => {
      renderModulo()

      const link = screen.getByRole('link', {
        name: /ver validación pública oficial del certificado folio ciae-001 de juana pérez/i,
      })
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('/validar/tok1')
      )
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
})
