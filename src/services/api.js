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

// ===================== SUPERADMIN =====================
// Todas las funciones de esta sección requieren que el usuario logueado
// tenga rol "superadmin"; el backend responde 403 en caso contrario.

async function _parsearRespuesta(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detalle =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(' ')
          : 'Ocurrió un error inesperado.'
    throw new Error(detalle)
  }
  return data
}

export async function listarTenants() {
  const res = await fetch(`${API_URL}/api/superadmin/tenants`, conSesion())
  return _parsearRespuesta(res)
}

export async function obtenerTenant(tenantId) {
  const res = await fetch(
    `${API_URL}/api/superadmin/tenants/${tenantId}`,
    conSesion()
  )
  return _parsearRespuesta(res)
}

export async function obtenerResumenPlataforma() {
  const res = await fetch(`${API_URL}/api/superadmin/resumen`, conSesion())
  return _parsearRespuesta(res)
}

export async function crearTenant(datos) {
  const res = await fetch(
    `${API_URL}/api/superadmin/tenants`,
    conSesion({ method: 'POST', body: JSON.stringify(datos) })
  )
  return _parsearRespuesta(res)
}

export async function actualizarSuscripcion(tenantId, datos) {
  const res = await fetch(
    `${API_URL}/api/superadmin/tenants/${tenantId}/suscripcion`,
    conSesion({ method: 'PATCH', body: JSON.stringify(datos) })
  )
  return _parsearRespuesta(res)
}

export async function listarUsuariosSuperadmin(tenantId) {
  const query = tenantId ? `?tenant_id=${tenantId}` : ''
  const res = await fetch(
    `${API_URL}/api/superadmin/usuarios${query}`,
    conSesion()
  )
  return _parsearRespuesta(res)
}

export async function crearUsuarioSuperadmin(datos) {
  const res = await fetch(
    `${API_URL}/api/superadmin/usuarios`,
    conSesion({ method: 'POST', body: JSON.stringify(datos) })
  )
  return _parsearRespuesta(res)
}

export async function resetearPasswordSuperadmin(usuarioId, password) {
  const res = await fetch(
    `${API_URL}/api/superadmin/usuarios/${usuarioId}/reset-password`,
    conSesion({ method: 'PATCH', body: JSON.stringify({ password }) })
  )
  return _parsearRespuesta(res)
}

export async function cambiarEstadoUsuarioSuperadmin(usuarioId, activo) {
  const res = await fetch(
    `${API_URL}/api/superadmin/usuarios/${usuarioId}/estado`,
    conSesion({ method: 'PATCH', body: JSON.stringify({ activo }) })
  )
  return _parsearRespuesta(res)
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
