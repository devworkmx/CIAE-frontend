import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Paginacion({
  paginaActual,
  totalPaginas,
  totalRegistros,
  registrosPorPagina,
  onCambiarPagina,
  etiqueta = 'registros',
}) {
  if (totalRegistros === 0) return null

  const inicio = (paginaActual - 1) * registrosPorPagina + 1
  const fin = Math.min(paginaActual * registrosPorPagina, totalRegistros)

  return (
    <nav
      aria-label={`Navegación de páginas de ${etiqueta}`}
      className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600"
    >
      <div>
        Mostrando <span className="font-semibold text-gray-800">{inicio}</span>{' '}
        a <span className="font-semibold text-gray-800">{fin}</span> de{' '}
        <span className="font-semibold text-gray-800">{totalRegistros}</span>{' '}
        {etiqueta}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onCambiarPagina(Math.max(paginaActual - 1, 1))}
          disabled={paginaActual === 1}
          aria-label={`Página anterior de ${etiqueta}`}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onCambiarPagina(num)}
            aria-current={paginaActual === num ? 'page' : undefined}
            aria-label={`Ir a la página ${num} de ${etiqueta}`}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg font-semibold text-xs transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b] ${
              paginaActual === num
                ? 'bg-[#1b3a6b] text-white shadow-sm'
                : 'bg-white border text-gray-700 hover:bg-slate-100'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            onCambiarPagina(Math.min(paginaActual + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
          aria-label={`Página siguiente de ${etiqueta}`}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition focus-visible:ring-2 focus-visible:ring-[#1b3a6b]"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
