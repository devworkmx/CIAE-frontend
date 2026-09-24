// Si hay una variable de entorno definida (por ejemplo en producción), la usa;
// de lo contrario, deja un string vacío para hacer peticiones relativas al mismo origen y protocolo.
export const API_URL = import.meta.env.VITE_API_URL || ''

// La sesión ya NO se maneja con un JWT en localStorage. El backend entrega el
// token como cookie httpOnly (ver /api/auth/login), así que el navegador la
// envía solo automáticamente en cada petición -- JavaScript nunca la lee ni
// la puede robar un XSS. Por eso toda petición autenticada debe mandar
// `credentials: 'include'`, y ya no hace falta un header Authorization.

export function getJsonHeaders() {
  return { 'Content-Type': 'application/json' }
}

// Opciones base para incluir siempre en fetch() de endpoints autenticados.
// Uso: fetch(url, { ...conSesion(), method: 'POST', body: JSON.stringify(x) })
export function conSesion(opciones = {}) {
  return {
    ...opciones,
    credentials: 'include',
    headers: {
      ...getJsonHeaders(),
      ...(opciones.headers || {}),
    },
  }
}

// Pregunta al backend si hay una sesión activa y válida (la cookie httpOnly
// viaja sola). Regresa los datos del usuario si la sesión es válida, o null
// si no hay sesión, expiró, o el usuario fue desactivado mientras tanto.
export async function verificarSesion() {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Le pide al backend borrar la cookie de sesión.
export async function cerrarSesion() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Si el backend no responde, igual dejamos que el frontend redirija al
    // login; la cookie expirará sola según su tiempo de vida.
  }
}

// Envía el formulario público de contacto. No requiere sesión (no manda
// `credentials: 'include'` ni cookie), a diferencia de los endpoints
// autenticados de arriba.
export async function enviarContacto({ nombre, correo, mensaje }) {
  const res = await fetch(`${API_URL}/api/public/contacto`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ nombre, correo, mensaje }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // El backend regresa 422 con `errors` por campo cuando la validación
    // de Pydantic falla (ver validation_exception_handler en main.py).
    if (res.status === 429) {
      throw new Error(
        'Enviaste demasiados mensajes en poco tiempo. Intenta de nuevo en un minuto.'
      )
    }
    throw new Error(
      data.message ||
        'No se pudo enviar tu mensaje. Intenta de nuevo más tarde.'
    )
  }

  return data
}

export async function renovarCertificado(certificadoId) {
  const res = await fetch(
    `${API_URL}/api/certificados/${certificadoId}/renovar`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || 'No fue posible renovar el certificado.')
  }
  return data
}
