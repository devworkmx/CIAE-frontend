import { useState, useRef, useEffect } from 'react'
// Íconos: búsqueda manual, QR, cámara, y los inputs de folio/CURP
import { Search, QrCode, Camera, FileDigit, IdCard } from 'lucide-react'

function Validacion() {
  // ------------------------------------------------------------------
  // ESTADO: qué pestaña está activa ("manual" o "qr")
  // Cambia el valor inicial aquí si quieres que abra en otra pestaña
  // ------------------------------------------------------------------
  const [tabActiva, setTabActiva] = useState('manual')

  // ------------------------------------------------------------------
  // ESTADO: método de búsqueda manual seleccionado ("folio" o "curp")
  // ------------------------------------------------------------------
  const [metodoBusqueda, setMetodoBusqueda] = useState('folio')

  // Valor que el usuario escribe en el input (folio o CURP)
  const [valorBusqueda, setValorBusqueda] = useState('')

  // Referencia al elemento <video> donde se muestra la cámara
  const videoRef = useRef(null)

  // Guarda el stream de la cámara para poder detenerlo después
  const streamRef = useRef(null)

  // Mensaje de error si la cámara no se puede activar (permisos, etc.)
  const [errorCamara, setErrorCamara] = useState('')

  // ------------------------------------------------------------------
  // EFECTO: activa la cámara SOLO cuando la pestaña "qr" está activa
  // y la apaga automáticamente al salir de esa pestaña o desmontar
  // el componente (buena práctica para no dejar la cámara encendida).
  // ------------------------------------------------------------------
  useEffect(() => {
    async function iniciarCamara() {
      try {
        // Pide acceso a la cámara trasera si existe (ideal para celulares)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setErrorCamara('')
      } catch (error) {
        // Si el usuario niega el permiso o no hay cámara disponible
        setErrorCamara('No se pudo acceder a la cámara. Verifica los permisos.')
      }
    }

    function detenerCamara() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }

    if (tabActiva === 'qr') {
      iniciarCamara()
    } else {
      detenerCamara()
    }

    // Limpieza: apaga la cámara si el componente se desmonta
    return () => detenerCamara()
  }, [tabActiva])

  // ------------------------------------------------------------------
  // FUNCIÓN: se ejecuta al enviar el formulario de búsqueda manual
  // Aquí conectarías tu llamada a la API/backend para validar el curso
  // ------------------------------------------------------------------
  function handleBuscar(e) {
    e.preventDefault()
    console.log(`Buscando por ${metodoBusqueda}:`, valorBusqueda)
    // TODO: reemplazar este console.log por tu petición real (fetch/axios)
  }

  return (
    <section className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================================================================
            ENCABEZADO DE LA PÁGINA
            Cambia el título y el párrafo descriptivo aquí.
        ================================================================= */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1b3a6b] mb-2">
            Validación de Cursos
          </h1>
          <p className="text-gray-500">
            Verifica la autenticidad de un curso por folio, CURP o escaneando el
            código QR del certificado.
          </p>
        </div>

        {/* ================================================================
            TARJETA CONTENEDORA
            Envuelve las pestañas y su contenido en un solo bloque con sombra
        ================================================================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* ------------------------------------------------------------
              PESTAÑAS: "Búsqueda manual" | "Escanear QR"
              El botón activo se pinta en azul marino con texto dorado,
              el inactivo queda en gris claro.
          ------------------------------------------------------------- */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => setTabActiva('manual')}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors duration-200 ${
                tabActiva === 'manual'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Búsqueda manual
            </button>

            <button
              onClick={() => setTabActiva('qr')}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors duration-200 ${
                tabActiva === 'qr'
                  ? 'bg-[#1b3a6b] text-dorado'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Escanear QR
            </button>
          </div>

          {/* ================================================================
              CONTENIDO: BÚSQUEDA MANUAL (folio o CURP)
              Solo se muestra si tabActiva === 'manual'
          ================================================================= */}
          {tabActiva === 'manual' && (
            <form onSubmit={handleBuscar} className="p-8">
              {/* ------------------------------------------------------------
                  SELECTOR DE MÉTODO: Folio o CURP
                  Cambia entre los dos botones tipo "toggle"
              ------------------------------------------------------------- */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setMetodoBusqueda('folio')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                    metodoBusqueda === 'folio'
                      ? 'border-morena bg-morena/10 text-morena'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FileDigit className="w-4 h-4" />
                  Folio
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoBusqueda('curp')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                    metodoBusqueda === 'curp'
                      ? 'border-morena bg-morena/10 text-morena'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <IdCard className="w-4 h-4" />
                  CURP
                </button>
              </div>

              {/* ------------------------------------------------------------
                  INPUT DE BÚSQUEDA
                  El placeholder cambia según el método seleccionado
              ------------------------------------------------------------- */}
              <label
                htmlFor="valorBusqueda"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {metodoBusqueda === 'folio'
                  ? 'Número de folio'
                  : 'CURP del alumno'}
              </label>
              <input
                id="valorBusqueda"
                type="text"
                value={valorBusqueda}
                onChange={(e) => setValorBusqueda(e.target.value)}
                placeholder={
                  metodoBusqueda === 'folio'
                    ? 'Ej. CIAE-2024-00123'
                    : 'Ej. ABCD960101HDFXYZ01'
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] mb-6"
              />

              {/* Botón para enviar la búsqueda */}
              <button
                type="submit"
                className="w-full bg-dorado text-[#0f1f3d] font-semibold py-3 rounded-lg hover:brightness-95 transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Validar curso
              </button>
            </form>
          )}

          {/* ================================================================
              CONTENIDO: ESCANEAR QR
              Solo se muestra si tabActiva === 'qr'
              Muestra el video en vivo de la cámara del dispositivo.
          ================================================================= */}
          {tabActiva === 'qr' && (
            <div className="p-8 flex flex-col items-center">
              {/* ------------------------------------------------------------
                  CONTENEDOR DEL VIDEO
                  Aquí se renderiza el stream de la cámara en tiempo real.
                  El marco dorado punteado es solo visual, para indicar
                  dónde debe apuntar el usuario el código QR.
              ------------------------------------------------------------- */}
              <div className="relative w-full max-w-sm aspect-square bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Marco guía superpuesto sobre el video */}
                <div className="absolute inset-8 border-2 border-dashed border-dorado rounded-lg pointer-events-none" />
              </div>

              {/* Mensaje de error si la cámara no pudo activarse */}
              {errorCamara && (
                <p className="text-sm text-morena text-center mb-2">
                  {errorCamara}
                </p>
              )}

              <p className="text-sm text-gray-500 text-center flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Coloca el código QR dentro del recuadro para escanearlo.
              </p>

              {/* ------------------------------------------------------------
                  NOTA PARA EL DESARROLLADOR:
                  Este bloque solo MUESTRA la cámara. Para leer y decodificar
                  el contenido del QR automáticamente, instala una librería
                  como "jsqr" o "html5-qrcode" y, dentro de un setInterval
                  o requestAnimationFrame, captura un frame del <video>
                  en un <canvas> oculto y pásalo a la función de decodificación
                  de esa librería. Cuando obtengas el resultado, llama aquí
                  a tu función de validación (similar a handleBuscar).
              ------------------------------------------------------------- */}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Validacion
