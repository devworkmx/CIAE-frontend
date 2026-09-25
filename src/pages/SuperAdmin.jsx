import { useState, useEffect, useCallback } from 'react'
import { listarTenants, obtenerResumenPlataforma } from '../services/api'
import ModuloTenants from '../components/superadmin/ModuloTenants'
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'

export default function SuperAdmin() {
  const [tenants, setTenants] = useState([])
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [alerta, setAlerta] = useState({
    visible: false,
    mensaje: '',
    tipo: 'exito',
  })

  const mostrarAlerta = useCallback((mensaje, tipo = 'exito') => {
    setAlerta({ visible: true, mensaje, tipo })
    setTimeout(
      () => setAlerta({ visible: false, mensaje: '', tipo: 'exito' }),
      5000
    )
  }, [])

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const [dataTenants, dataResumen] = await Promise.all([
        listarTenants(),
        obtenerResumenPlataforma(),
      ])
      setTenants(dataTenants)
      setResumen(dataResumen)
    } catch (err) {
      mostrarAlerta(err.message, 'error')
    } finally {
      setCargando(false)
    }
  }, [mostrarAlerta])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Panel de plataforma
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Alta de instituciones, suscripciones y accesos de todos los
                clientes de CIAE.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <Building2 className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : (resumen?.total_tenants ?? 0)}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Instituciones
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <Users className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : (resumen?.total_usuarios ?? 0)}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Usuarios
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl text-center min-w-[85px]">
                <Award className="w-4 h-4 mx-auto text-[#1b3a6b] mb-1.5" />
                <span className="text-lg sm:text-xl font-black text-slate-900 block leading-none">
                  {cargando ? '...' : (resumen?.total_certificados ?? 0)}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Certificados
                </span>
              </div>
            </div>
          </div>
        </header>

        {alerta.visible && (
          <aside
            role="status"
            aria-live="polite"
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
              alerta.tipo === 'exito'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {alerta.tipo === 'exito' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <p>{alerta.mensaje}</p>
          </aside>
        )}

        {cargando && tenants.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm font-semibold">
            <RefreshCw className="w-7 h-7 mx-auto mb-3 animate-spin text-[#1b3a6b]" />
            Sincronizando plataforma...
          </div>
        ) : (
          <ModuloTenants
            tenants={tenants}
            onRecargar={cargarDatos}
            onAlerta={mostrarAlerta}
          />
        )}
      </div>
    </main>
  )
}
