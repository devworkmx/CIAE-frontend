import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Servicio de generación de QR sin dependencias extra.
// Si el proyecto ya usa una librería (p. ej. qrcode.react), se puede
// sustituir esta constante por la llamada correspondiente.
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/'

function folioExiste(certificados, folio) {
  return certificados.some(
    (c) => c.folio.trim().toLowerCase() === folio.trim().toLowerCase()
  )
}

function coincide(cert, termino) {
  const t = termino.trim().toLowerCase()
  if (!t) return false
  return (
    cert.folio.toLowerCase().includes(t) ||
    (cert.curp || '').toLowerCase().includes(t) ||
    cert.nombre.toLowerCase().includes(t)
  )
}

// RF-13: el estatus se calcula al vuelo a partir de la vigencia,
// nunca se guarda como valor fijo.
function estatusDe(cert) {
  if (!cert.tieneVigencia || !cert.fechaVigencia) return 'activo'
  const hoy = new Date().setHours(0, 0, 0, 0)
  const vigencia = new Date(cert.fechaVigencia).setHours(0, 0, 0, 0)
  return vigencia < hoy ? 'vencido' : 'activo'
}

function Etiqueta({ estatus }) {
  const esActivo = estatus === 'activo'
  return (
    <span
      className={`text-xs font-medium ${
        esActivo ? 'text-emerald-600' : 'text-red-600'
      }`}
    >
      {esActivo ? 'Activo' : 'Vencido'}
    </span>
  )
}

const inputClase =
  'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-morena focus:ring-2 focus:ring-morena/15'

function Campo({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-stone-400">{hint}</span>
      )}
    </label>
  )
}

function ModalAgregarCurso({ certificados, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    folio: '',
    nombre: '',
    curp: '',
    curso: '',
    fechaEmision: '',
    tieneVigencia: false,
    fechaVigencia: '',
    correo: '',
    telefono: '',
    instructor: '',
  })
  const [error, setError] = useState('')
  const [qr, setQr] = useState(null)

  const actualizar = (campo, valor) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const validar = () => {
    if (!form.folio.trim()) return 'El folio es obligatorio.'
    // RF-11: folios duplicados
    if (folioExiste(certificados, form.folio))
      return `Ya existe un certificado con el folio ${form.folio}.`
    if (!form.nombre.trim()) return 'El nombre del alumno es obligatorio.'
    if (!form.curso.trim()) return 'El curso es obligatorio.'
    if (!form.fechaEmision) return 'La fecha de emisión es obligatoria.'
    if (form.tieneVigencia && !form.fechaVigencia)
      return 'Indica la fecha de vigencia o desmarca la opción.'
    if (!form.correo.trim() && !form.telefono.trim())
      return 'Registra al menos un correo electrónico o un número de teléfono.'
    if (!form.instructor.trim()) return 'El instructor/emisor es obligatorio.'
    return ''
  }

  const guardar = (e) => {
    e.preventDefault()
    const mensaje = validar()
    if (mensaje) {
      setError(mensaje)
      return
    }
    setError('')

    // RF-09: el QR apunta a la URL pública de validación de ese folio.
    const urlValidacion = `${window.location.origin}/validar/${encodeURIComponent(
      form.folio
    )}`
    const qrSrc = `${QR_API}?size=220x220&data=${encodeURIComponent(urlValidacion)}`

    onGuardar({ ...form, qrSrc, urlValidacion })
    setQr({ folio: form.folio, src: qrSrc })

    // TODO: además de generar el QR, disparar aquí el aviso por
    // correo/SMS/WhatsApp al alumno (RF-09), vía el servicio del backend.
  }

  if (qr) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
          <h3 className="font-serif text-lg text-stone-800">
            Certificado registrado
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Folio {qr.folio}. Descarga el código y pégalo en el certificado.
          </p>
          <img
            src={qr.src}
            alt={`Código QR del folio ${qr.folio}`}
            className="mx-auto mt-4 h-44 w-44 rounded border border-stone-200"
          />
          <div className="mt-5 flex justify-center gap-3">
            <a
              href={qr.src}
              download={`qr-${qr.folio}.png`}
              className="rounded-md bg-morena px-4 py-2 text-sm font-medium text-white hover:bg-morena/90"
            >
              Descargar QR
            </a>
            <button
              onClick={onCerrar}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-serif text-lg text-stone-800">Agregar curso</h3>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={guardar}
          className="max-h-[75vh] overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Folio" hint="Se asigna manualmente">
              <input
                className={inputClase}
                value={form.folio}
                onChange={(e) => actualizar('folio', e.target.value)}
                placeholder="Ej. CIAE-2026-001"
              />
            </Campo>

            <Campo label="Nombre del alumno">
              <input
                className={inputClase}
                value={form.nombre}
                onChange={(e) => actualizar('nombre', e.target.value)}
              />
            </Campo>

            <Campo label="CURP" hint="Opcional, facilita la búsqueda">
              <input
                className={inputClase}
                value={form.curp}
                onChange={(e) =>
                  actualizar('curp', e.target.value.toUpperCase())
                }
              />
            </Campo>

            <Campo label="Curso">
              <input
                className={inputClase}
                value={form.curso}
                onChange={(e) => actualizar('curso', e.target.value)}
              />
            </Campo>

            <Campo label="Fecha de emisión">
              <input
                type="date"
                className={inputClase}
                value={form.fechaEmision}
                onChange={(e) => actualizar('fechaEmision', e.target.value)}
              />
            </Campo>

            <div>
              <label className="flex items-center gap-2 pt-6 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 text-morena focus:ring-morena/30"
                  checked={form.tieneVigencia}
                  onChange={(e) =>
                    actualizar('tieneVigencia', e.target.checked)
                  }
                />
                Este certificado tiene vigencia
              </label>
              {form.tieneVigencia && (
                <input
                  type="date"
                  className={`${inputClase} mt-2`}
                  value={form.fechaVigencia}
                  onChange={(e) => actualizar('fechaVigencia', e.target.value)}
                />
              )}
            </div>

            <Campo label="Correo electrónico">
              <input
                type="email"
                className={inputClase}
                value={form.correo}
                onChange={(e) => actualizar('correo', e.target.value)}
              />
            </Campo>

            <Campo label="Número de teléfono">
              <input
                className={inputClase}
                value={form.telefono}
                onChange={(e) => actualizar('telefono', e.target.value)}
              />
            </Campo>

            <Campo label="Instructor / emisor">
              <input
                className={inputClase}
                value={form.instructor}
                onChange={(e) => actualizar('instructor', e.target.value)}
              />
            </Campo>
          </div>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-morena px-4 py-2 text-sm font-medium text-white hover:bg-morena/90"
            >
              Guardar y generar QR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalBuscar({ certificados, onCerrar }) {
  const [termino, setTermino] = useState('')
  const resultados = certificados.filter((c) => coincide(c, termino))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-serif text-lg text-stone-800">
            Buscar certificado
          </h3>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          <input
            autoFocus
            className={inputClase}
            placeholder="Folio, CURP o nombre del alumno"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />

          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
            {termino.trim() === '' && (
              <p className="text-sm text-stone-400">
                Escribe para buscar entre los certificados registrados.
              </p>
            )}
            {termino.trim() !== '' && resultados.length === 0 && (
              <p className="text-sm text-stone-400">
                No se encontró ningún certificado con ese dato.
              </p>
            )}
            {resultados.map((c) => (
              <div
                key={c.folio}
                className="rounded-md border border-stone-200 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-800">{c.nombre}</span>
                  <Etiqueta estatus={estatusDe(c)} />
                </div>
                <p className="mt-0.5 text-sm text-stone-500">
                  Folio {c.folio} · {c.curso}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Registro() {
  const navigate = useNavigate()
  const [certificados, setCertificados] = useState([])
  const [modal, setModal] = useState(null) // null | "agregar" | "buscar"

  const agregarCertificado = (cert) =>
    setCertificados((prev) => [...prev, cert])
  const cerrarSesion = () => navigate('/')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-2xl text-stone-800">
            Panel de administrador
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setModal('buscar')}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Buscar
            </button>
            <button
              onClick={() => setModal('agregar')}
              className="rounded-md bg-morena px-4 py-2 text-sm font-medium text-white hover:bg-morena/90"
            >
              Agregar curso
            </button>
            <button
              onClick={cerrarSesion}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {certificados.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="text-stone-500">Aún no se registran certificados.</p>
            <button
              onClick={() => setModal('agregar')}
              className="mt-4 rounded-md bg-morena px-4 py-2 text-sm font-medium text-white hover:bg-morena/90"
            >
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Folio</th>
                  <th className="px-4 py-3 font-medium">Alumno</th>
                  <th className="px-4 py-3 font-medium">Curso</th>
                  <th className="px-4 py-3 font-medium">Emisión</th>
                  <th className="px-4 py-3 font-medium">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {certificados.map((c) => (
                  <tr key={c.folio}>
                    <td className="px-4 py-3 text-stone-700">{c.folio}</td>
                    <td className="px-4 py-3 text-stone-700">{c.nombre}</td>
                    <td className="px-4 py-3 text-stone-700">{c.curso}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {c.fechaEmision}
                    </td>
                    <td className="px-4 py-3">
                      <Etiqueta estatus={estatusDe(c)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modal === 'agregar' && (
        <ModalAgregarCurso
          certificados={certificados}
          onGuardar={agregarCertificado}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal === 'buscar' && (
        <ModalBuscar
          certificados={certificados}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  )
}
