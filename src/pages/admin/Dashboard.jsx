import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { getDashboardStats } from '../../services/api'

const STATUS_STYLES = {
  en_curso: { label: 'En curso', cls: 'bg-primary/10 text-primary', pulse: true },
  confirmed: { label: 'Confirmada', cls: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Cancelada', cls: 'bg-error/10 text-error' },
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewApptModal, setShowNewApptModal] = useState(false)

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const kpiCards = [
    { label: 'Citas del Día', value: stats?.appointmentsToday || 0, icon: 'calendar_month', badge: 'Hoy', badgeCls: 'bg-primary/10 text-primary' },
    { label: 'Ingresos Estimados', value: `$${stats?.revenueToday || 0}`, icon: 'payments', badge: 'Hoy', badgeCls: 'text-outline' },
    { label: 'Barberos Activos', value: stats?.activeBarbers || 0, icon: 'content_cut', badge: 'En turno', badgeCls: 'text-green-500 flex items-center gap-1', pulse: true },
    { label: 'Nuevos Clientes', value: stats?.newClientsToday || 0, icon: 'person_add', badge: 'Hoy', badgeCls: 'text-primary' },
  ]

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
        <button
          onClick={() => setShowNewApptModal(true)}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Cita
        </button>
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
            <Link to="/admin/calendario" className="text-outline/50 hover:text-secondary text-sm px-4 py-2 transition-colors">Ver Calendario</Link>
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
              {stats?.recentAppointments.map((appt) => {
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
              {stats?.recentAppointments.length === 0 && (
                <tr>
                   <td colSpan="6" className="px-8 py-10 text-center text-outline text-sm">No hay citas próximas para hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low flex justify-between items-center text-outline text-xs border-t border-outline-variant/5">
          <p>Mostrando {stats?.recentAppointments.length || 0} citas pendientes</p>
          <Link to="/admin/calendario" className="flex items-center gap-1 hover:text-secondary transition-colors font-bold uppercase tracking-tight">
            Ir al Calendario Completo
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Bottom Asymmetric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-[#1C1B1B] to-[#131313] p-10 rounded-2xl relative overflow-hidden flex flex-col justify-between h-64 shadow-xl">
          <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[200px] text-primary/5 -rotate-12">brush</span>
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-on-surface font-headline mb-2">Reporte de Desempeño</h4>
            <div className="space-y-4 mt-6">
               {stats?.performance.map((p, i) => (
                 <div key={p.name} className="flex items-center justify-between max-w-sm">
                    <div className="flex items-center gap-3">
                       <span className="text-outline font-black text-xs">0{i+1}</span>
                       <span className="text-on-surface font-bold text-sm">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-outline text-[10px] uppercase font-bold">{p.appointments} CITAS</span>
                       <span className="text-primary font-black text-sm">${p.revenue}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          <div className="relative z-10 flex gap-4 items-center">
            <div className="flex -space-x-2">
              {stats?.performance.map((p, i) => (
                <img key={p.name} src={`https://i.pravatar.cc/40?img=${10+i}`} alt="Barber" className="w-8 h-8 rounded-full border-2 border-surface grayscale" />
              ))}
            </div>
            <span className="text-xs text-secondary font-bold">Líderes de la semana</span>
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

      {/* QUICK NEW APPOINTMENT MODAL */}
      <Dialog.Root open={showNewApptModal} onOpenChange={setShowNewApptModal}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] max-w-md w-full animate-in zoom-in-95 duration-200 outline-none">
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-black font-headline text-on-surface tracking-tighter">
                            Nueva Cita Rápida
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-outline hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </Dialog.Close>
                    </div>
                    
                    <div className="space-y-6">
                        <p className="text-sm text-outline leading-relaxed">
                            Para agendar una cita completa con selección de barbero y servicio detallado, te recomendamos usar el calendario interactivo.
                        </p>
                        
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Acceso Directo</p>
                            <p className="text-[10px] text-outline mb-4">Serás redirigido al editor de agenda profesional.</p>
                            <Link 
                                to="/admin/calendario" 
                                onClick={() => setShowNewApptModal(false)}
                                className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline font-black text-xs text-center block tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                IR AL CALENDARIO
                            </Link>
                        </div>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
