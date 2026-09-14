import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Paginacion from '../components/admin/Paginacion'

const propsBase = {
  paginaActual: 1,
  totalPaginas: 3,
  totalRegistros: 25,
  registrosPorPagina: 10,
  onCambiarPagina: vi.fn(),
}

describe('Paginacion', () => {
  it('no renderiza nada si totalRegistros es 0', () => {
    const { container } = render(
      <Paginacion {...propsBase} totalRegistros={0} onCambiarPagina={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra el rango correcto "Mostrando X a Y de Z registros" en la primera página', () => {
    render(<Paginacion {...propsBase} onCambiarPagina={vi.fn()} />)

    // Acotamos al contenedor de texto de rango, ya que "1" también aparece
    // como número de botón de página y colisionaría con getByText('1').
    const contenedorTexto = screen.getByText(/mostrando/i).closest('div')
    expect(contenedorTexto).toHaveTextContent('Mostrando')
    expect(contenedorTexto).toHaveTextContent('1')
    expect(contenedorTexto).toHaveTextContent('10')
    expect(contenedorTexto).toHaveTextContent('25')
    expect(contenedorTexto).toHaveTextContent('registros')
  })

  it('calcula el rango correcto en la última página (parcial)', () => {
    render(
      <Paginacion {...propsBase} paginaActual={3} onCambiarPagina={vi.fn()} />
    )

    // Página 3 de 10 en 10: del 21 al 25 (último registro, no llega a 30)
    const contenedorTexto = screen.getByText(/mostrando/i).closest('div')
    expect(contenedorTexto).toHaveTextContent('Mostrando')
    expect(contenedorTexto).toHaveTextContent('21')
    expect(contenedorTexto).toHaveTextContent('25')
  })

  it('usa la etiqueta personalizada cuando se proporciona', () => {
    render(
      <Paginacion {...propsBase} etiqueta="alumnos" onCambiarPagina={vi.fn()} />
    )

    expect(
      screen.getByRole('navigation', {
        name: /navegación de páginas de alumnos/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/alumnos$/i)).toBeInTheDocument()
  })

  it('renderiza un botón por cada página', () => {
    render(
      <Paginacion {...propsBase} totalPaginas={5} onCambiarPagina={vi.fn()} />
    )

    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByRole('button', {
          name: new RegExp(`ir a la página ${i} de`, 'i'),
        })
      ).toBeInTheDocument()
    }
  })

  it('marca la página actual con aria-current="page"', () => {
    render(
      <Paginacion {...propsBase} paginaActual={2} onCambiarPagina={vi.fn()} />
    )

    const botonPagina2 = screen.getByRole('button', {
      name: /ir a la página 2 de/i,
    })
    const botonPagina1 = screen.getByRole('button', {
      name: /ir a la página 1 de/i,
    })

    expect(botonPagina2).toHaveAttribute('aria-current', 'page')
    expect(botonPagina1).not.toHaveAttribute('aria-current')
  })

  it('deshabilita el botón "anterior" en la primera página', () => {
    render(
      <Paginacion {...propsBase} paginaActual={1} onCambiarPagina={vi.fn()} />
    )

    expect(
      screen.getByRole('button', { name: /página anterior/i })
    ).toBeDisabled()
  })

  it('deshabilita el botón "siguiente" en la última página', () => {
    render(
      <Paginacion
        {...propsBase}
        paginaActual={3}
        totalPaginas={3}
        onCambiarPagina={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /página siguiente/i })
    ).toBeDisabled()
  })

  it('habilita ambos botones en una página intermedia', () => {
    render(
      <Paginacion
        {...propsBase}
        paginaActual={2}
        totalPaginas={3}
        onCambiarPagina={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /página anterior/i })
    ).toBeEnabled()
    expect(
      screen.getByRole('button', { name: /página siguiente/i })
    ).toBeEnabled()
  })

  it('llama a onCambiarPagina con el número correcto al hacer clic en un botón de página', async () => {
    const onCambiarPagina = vi.fn()
    const user = userEvent.setup()
    render(<Paginacion {...propsBase} onCambiarPagina={onCambiarPagina} />)

    await user.click(
      screen.getByRole('button', { name: /ir a la página 3 de/i })
    )

    expect(onCambiarPagina).toHaveBeenCalledWith(3)
  })

  it('llama a onCambiarPagina con la página anterior al hacer clic en "anterior"', async () => {
    const onCambiarPagina = vi.fn()
    const user = userEvent.setup()
    render(
      <Paginacion
        {...propsBase}
        paginaActual={2}
        onCambiarPagina={onCambiarPagina}
      />
    )

    await user.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onCambiarPagina).toHaveBeenCalledWith(1)
  })

  it('llama a onCambiarPagina con la página siguiente al hacer clic en "siguiente"', async () => {
    const onCambiarPagina = vi.fn()
    const user = userEvent.setup()
    render(
      <Paginacion
        {...propsBase}
        paginaActual={2}
        onCambiarPagina={onCambiarPagina}
      />
    )

    await user.click(screen.getByRole('button', { name: /página siguiente/i }))

    expect(onCambiarPagina).toHaveBeenCalledWith(3)
  })

  it('el botón "anterior" deshabilitado no dispara onCambiarPagina si se intenta hacer clic', async () => {
    const onCambiarPagina = vi.fn()
    const user = userEvent.setup()
    render(
      <Paginacion
        {...propsBase}
        paginaActual={1}
        onCambiarPagina={onCambiarPagina}
      />
    )

    await user.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onCambiarPagina).not.toHaveBeenCalled()
  })
})
