import { Link } from 'react-router-dom'
import { adminAppointments, financialData } from '../../data/mockData'

const STATUS_STYLES = {
  en_curso: { label: 'En curso', cls: 'bg-primary/10 text-primary', pulse: true },
  confirmed: { label: 'Confirmada', cls: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Cancelada', cls: 'bg-error/10 text-error' },
}

const kpiCards = [
  { label: 'Citas del Día', value: '24', icon: 'calendar_month', badge: '+12%', badgeCls: 'bg-green-500/10 text-green-500' },
  { label: 'Ingresos Estimados', value: '$1,450', icon: 'payments', badge: 'Hoy', badgeCls: 'text-outline' },
  { label: 'Barberos Activos', value: '06', icon: 'content_cut', badge: 'En turno', badgeCls: 'text-green-500 flex items-center gap-1', pulse: true },
  { label: 'Nuevos Clientes', value: '08', icon: 'person_add', badge: '+3 hoy', badgeCls: 'text-primary' },
]

export default function Dashboard() {
  return (
    <div className="space-y-10 pt-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline mb-2">Resumen General</h2>
          <p className="text-outline text-sm">
            Control total de la jornada:{' '}
            <span className="text-secondary">
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>
        </div>
        <Link
          to="/admin/calendario"
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Cita
        </Link>
      </div>

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-surface-container p-6 rounded-xl border-b border-outline-variant/20 relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-secondary/5 transition-transform group-hover:scale-110">
              {card.icon}
            </span>
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-4">{card.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-on-surface">{card.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${card.badgeCls}`}>
                {card.pulse && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/30">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface font-headline flex items-center gap-3">
            Próximas Citas
            <span className="bg-primary/20 text-primary text-[10px] py-1 px-3 rounded-full font-black uppercase">En Vivo</span>
          </h3>
          <div className="flex gap-2">
            <button className="text-outline hover:text-secondary text-sm font-bold px-4 py-2 transition-colors underline decoration-outline-variant/50 underline-offset-8">Hoy</button>
            <button className="text-outline/50 hover:text-secondary text-sm px-4 py-2 transition-colors">Mañana</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-outline uppercase text-[10px] tracking-[0.2em] font-bold">
                {['Cliente', 'Servicio', 'Barbero', 'Hora', 'Estado', 'Acciones'].map((h, i) => (
                  <th key={h} className={`px-8 py-6 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {adminAppointments.map((appt) => {
                const st = STATUS_STYLES[appt.status] || STATUS_STYLES.confirmed
                return (
                  <tr key={appt.id} className="hover:bg-surface-bright/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-secondary text-xs border border-outline-variant/20">
                          {appt.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{appt.client}</p>
                          <p className="text-[10px] text-outline">{appt.clientType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-on-surface-variant">{appt.service}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-outline">{appt.barber}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-on-surface">{appt.time}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${st.cls}`}>
                        {st.pulse && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                        {st.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-outline hover:text-on-surface transition-colors p-1">
                        <span className="material-symbols-outlined text-xl">more_vert</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low flex justify-between items-center text-outline text-xs border-t border-outline-variant/5">
          <p>Mostrando {adminAppointments.length} de 24 citas programadas para hoy</p>
          <button className="flex items-center gap-1 hover:text-secondary transition-colors">
            Ver historial completo
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Bottom Asymmetric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-[#1C1B1B] to-[#131313] p-10 rounded-2xl relative overflow-hidden flex flex-col justify-between h-64 shadow-xl">
          <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[200px] text-primary/5 -rotate-12">brush</span>
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-on-surface font-headline mb-2">Reporte de Desempeño</h4>
            <p className="text-outline-variant max-w-sm text-sm">
              {financialData.byBarber[0]?.name} lidera las ventas con {financialData.byBarber[0]?.appointments} servicios completados y calificación perfecta.
            </p>
          </div>
          <div className="relative z-10 flex gap-4 items-center">
            <div className="flex -space-x-2">
              {[8, 11, 15].map(n => (
                <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="Barber" className="w-8 h-8 rounded-full border-2 border-surface grayscale" />
              ))}
            </div>
            <span className="text-xs text-secondary font-bold">+3 barberos más</span>
          </div>
        </div>

        <div className="bg-primary-container p-8 rounded-2xl flex flex-col justify-between text-on-primary-container relative overflow-hidden hover:shadow-2xl hover:shadow-primary-container/30 transition-shadow">
          <span className="material-symbols-outlined absolute top-4 right-4 text-4xl opacity-20">auto_awesome</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Recomendación Smart</p>
            <h4 className="text-xl font-bold font-headline leading-tight">Optimiza tus horarios de la tarde</h4>
          </div>
          <p className="text-xs opacity-80 leading-relaxed mb-6">
            Detectamos un hueco a las 17:00. Lanza una oferta relámpago del 10% para llenarlo ahora.
          </p>
          <button className="bg-on-primary-container text-primary-container py-3 rounded font-bold text-xs uppercase tracking-tighter hover:brightness-110 transition-all">
            Lanzar Promo
          </button>
        </div>
      </div>
    </div>
  )
}
