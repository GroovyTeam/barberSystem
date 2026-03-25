import { financialData } from '../../data/mockData'

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const monthlyRevenue = [28000, 32000, 29500, 35000, 38200, 42500, 0, 0, 0, 0, 0, 0]
const maxRev = Math.max(...monthlyRevenue.filter(v => v > 0))

const kpis = [
  { label: 'Ingresos del Mes', value: `$${financialData.monthly.current.toLocaleString()}`, change: financialData.monthly.change, up: true },
  { label: 'Servicio Top', value: financialData.topService, icon: 'content_cut' },
  { label: 'Cancelaciones', value: financialData.cancellationRate, icon: 'cancel' },
  { label: 'Horas Pico', value: financialData.peakHours, icon: 'schedule' },
]

export default function Reportes() {
  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Reportes &amp; Estadísticas</h2>
          <p className="text-outline text-sm">Análisis financiero y de rendimiento del negocio</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-outline/20 text-outline hover:text-secondary hover:border-secondary/30 px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Exportar PDF
          </button>
          <button className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-lg">grid_view</span>
            Excel
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex bg-surface-container p-1 rounded-xl w-fit">
        {['Mensual', 'Semestral', 'Anual'].map((p, i) => (
          <button
            key={p}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${i === 1 ? 'bg-primary-container text-on-primary-container shadow-lg' : 'text-outline hover:text-on-surface'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-surface-container p-6 rounded-xl relative overflow-hidden group">
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">{kpi.label}</p>
            <p className="font-headline font-black text-2xl text-on-surface leading-tight">{kpi.value}</p>
            {kpi.change && (
              <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${kpi.up ? 'bg-green-500/10 text-green-500' : 'bg-error/10 text-error'}`}>
                <span className="material-symbols-outlined text-xs">{kpi.up ? 'trending_up' : 'trending_down'}</span>
                {kpi.change} vs mes anterior
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-surface-container rounded-2xl p-8 overflow-hidden">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-8">Ingresos por Mes (2026)</h3>
        <div className="flex items-end justify-between gap-3 h-52">
          {months.map((month, i) => {
            const rev = monthlyRevenue[i]
            const heightPct = rev > 0 ? (rev / maxRev) * 100 : 0
            const isCurrent = i === 5
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end" style={{ height: '160px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-primary-container to-primary'
                        : rev > 0
                        ? 'bg-surface-container-high hover:bg-secondary-container/40 transition-colors'
                        : 'bg-surface-container-high/30'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-[10px] uppercase font-bold ${isCurrent ? 'text-primary' : 'text-outline'}`}>{month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue by Barber */}
      <div className="bg-surface-container rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Ingresos por Barbero</h3>
        <div className="space-y-5">
          {financialData.byBarber.map((barber, i) => {
            const pct = Math.round((barber.revenue / financialData.byBarber[0].revenue) * 100)
            return (
              <div key={barber.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/32?img=${i + 8}`} alt={barber.name} className="w-8 h-8 rounded-full grayscale" />
                    <span className="text-sm font-bold text-on-surface">{barber.name}</span>
                    <span className="text-[10px] text-outline">{barber.appointments} citas</span>
                  </div>
                  <span className="text-sm font-bold text-primary">${barber.revenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
