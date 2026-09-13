import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '../pages/Contact'

describe('Contact', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra la información de contacto (teléfono, correo, ubicación)', () => {
    render(<Contact />)

    expect(screen.getByText('+52 123 456 7890')).toBeInTheDocument()
    expect(screen.getByText('contacto@ciae.mx')).toBeInTheDocument()
    expect(screen.getByText('Ciudad de México, MX')).toBeInTheDocument()
  })

  it('genera el link de WhatsApp con el número y mensaje correctos', () => {
    render(<Contact />)

    const linkWhatsapp = screen.getByRole('link', {
      name: /escríbenos por whatsapp/i,
    })
    expect(linkWhatsapp).toHaveAttribute(
      'href',
      'https://wa.me/529934324302?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n.'
    )
    expect(linkWhatsapp).toHaveAttribute('target', '_blank')
    expect(linkWhatsapp).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('muestra el formulario con los campos Nombre, Correo y Mensaje', () => {
    render(<Contact />)

    expect(screen.getByPlaceholderText(/tu nombre/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i)
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/escribe tu mensaje aquí/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /enviar mensaje/i })
    ).toBeInTheDocument()
  })

  it('los campos del formulario son obligatorios', () => {
    render(<Contact />)

    expect(screen.getByPlaceholderText(/tu nombre/i)).toBeRequired()
    expect(screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i)).toBeRequired()
    expect(
      screen.getByPlaceholderText(/escribe tu mensaje aquí/i)
    ).toBeRequired()
  })

  it('el campo de correo es de tipo email', () => {
    render(<Contact />)
    expect(
      screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i)
    ).toHaveAttribute('type', 'email')
  })

  it('permite escribir en los tres campos', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const nombreInput = screen.getByPlaceholderText(/tu nombre/i)
    const correoInput = screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i)
    const mensajeInput = screen.getByPlaceholderText(/escribe tu mensaje aquí/i)

    await user.type(nombreInput, 'Juan Pérez')
    await user.type(correoInput, 'juan@correo.com')
    await user.type(mensajeInput, 'Quiero información sobre sus cursos.')

    expect(nombreInput).toHaveValue('Juan Pérez')
    expect(correoInput).toHaveValue('juan@correo.com')
    expect(mensajeInput).toHaveValue('Quiero información sobre sus cursos.')
  })

  it('al enviar el formulario muestra una alerta de confirmación y lo limpia', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const nombreInput = screen.getByPlaceholderText(/tu nombre/i)
    const correoInput = screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i)
    const mensajeInput = screen.getByPlaceholderText(/escribe tu mensaje aquí/i)

    await user.type(nombreInput, 'Juan Pérez')
    await user.type(correoInput, 'juan@correo.com')
    await user.type(mensajeInput, 'Quiero información sobre sus cursos.')

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(window.alert).toHaveBeenCalledWith(
      '¡Gracias por tu mensaje! Te responderemos pronto.'
    )
    expect(nombreInput).toHaveValue('')
    expect(correoInput).toHaveValue('')
    expect(mensajeInput).toHaveValue('')
  })

  it('NO recarga la página al enviar (previene el comportamiento por defecto del form)', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByPlaceholderText(/tu nombre/i), 'Juan Pérez')
    await user.type(
      screen.getByPlaceholderText(/tucorreo@ejemplo\.com/i),
      'juan@correo.com'
    )
    await user.type(
      screen.getByPlaceholderText(/escribe tu mensaje aquí/i),
      'Mensaje de prueba'
    )

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(window.alert).toHaveBeenCalled()
  })
})
