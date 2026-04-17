import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { getDashboardStats, getServices, getBarbers, bookAppointment } from '../../services/api'

const STATUS_STYLES = {
  PENDING: { label: 'Pendiente', cls: 'bg-primary/10 text-primary', pulse: true },
  CONFIRMED: { label: 'Confirmada', cls: 'bg-green-500/10 text-green-500' },
  CANCELLED: { label: 'Cancelada', cls: 'bg-error/10 text-error' },
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('resumen')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewApptModal, setShowNewApptModal] = useState(false)
  const [services, setServices] = useState([])
  const [barberList, setBarberList] = useState([])
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    serviceId: '',
    barberId: '',
    time: '12:00',
  })

  const location = useLocation()

  useEffect(() => {
    // Sincronización inteligente con la URL
    const path = location.pathname
    if (path.includes('barberos')) setActiveTab('barberos')
    else if (path.includes('servicios')) setActiveTab('servicios')
    else if (path.includes('calendario')) setActiveTab('calendario')
    else if (path.includes('clientes')) setActiveTab('clientes')
    else if (path.includes('reportes')) setActiveTab('reportes')
    else if (path.includes('configuracion')) setActiveTab('configuracion')
    else setActiveTab('resumen')
    
    Promise.all([
      getDashboardStats(),
      getServices(),
      getBarbers(true)
    ]).then(([statsData, servicesData, barbersData]) => {
      setStats(statsData)
      setServices(servicesData)
      setBarberList(barbersData)
      setLoading(false)
    })
  }, [location.pathname])

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-surface">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const kpiCards = [
    { label: 'Citas Hoy', value: stats?.appointmentsToday || 0, icon: 'calendar_today', badge: 'Hoy', badgeCls: 'bg-primary/10 text-primary' },
    { label: 'Ingresos', value: `$${stats?.revenueToday || 0}`, icon: 'payments', badge: 'Hoy', badgeCls: 'text-outline' },
    { label: 'Barberos', value: stats?.activeBarbers || 0, icon: 'content_cut', badge: 'Activos', badgeCls: 'text-green-500', pulse: true },
    { label: 'Clientes', value: stats?.newClientsToday || 0, icon: 'person', badge: 'Total', badgeCls: 'text-primary' },
  ]

  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-on-surface font-headline">Admin Dashboard</h2>
          <p className="text-outline text-sm mt-1">Control de operaciones en tiempo real</p>
        </div>
        <button
          onClick={() => setShowNewApptModal(true)}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Cita
        </button>
      </div>



      {/* VIEW: RESUMEN */}
      {activeTab === 'resumen' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((card) => (
              <div key={card.label} className="bg-surface-container p-6 rounded-2xl border border-outline/5 relative overflow-hidden group">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-primary/5 transition-transform group-hover:scale-110">{card.icon}</span>
                <p className="text-outline text-[10px] font-black uppercase tracking-widest mb-4">{card.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black text-on-surface font-headline">{card.value}</h3>
                  <span className={`text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 ${card.badgeCls}`}>
                    {card.pulse && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container rounded-3xl overflow-hidden border border-outline/5">
            <div className="p-8 border-b border-outline/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-on-surface font-headline italic uppercase tracking-wider">Próximas Citas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-outline uppercase text-[10px] tracking-widest font-black border-b border-outline/5">
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Servicio</th>
                    <th className="px-8 py-6">Barbero</th>
                    <th className="px-8 py-6">Hora</th>
                    <th className="px-8 py-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5">
                  {(stats?.recentAppointments || []).map((appt) => {
                    const st = STATUS_STYLES[appt.status] || STATUS_STYLES.PENDING
                    return (
                      <tr key={appt.id} className="hover:bg-surface-container-high transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-on-surface">{appt.client}</p>
                        </td>
                        <td className="px-8 py-5 text-sm text-outline">{appt.service}</td>
                        <td className="px-8 py-5 text-sm text-outline">{appt.barber}</td>
                        <td className="px-8 py-5 text-sm font-black text-primary">{appt.time}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${st.cls}`}>{st.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                  {(!stats?.recentAppointments || stats.recentAppointments.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-outline italic text-sm">No hay citas registradas para hoy</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CALENDARIO */}
      {activeTab === 'calendario' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Agenda & Calendario</h3>
          <div className="bg-surface-container p-20 rounded-3xl border border-dashed border-outline/20 text-center">
             <span className="material-symbols-outlined text-5xl text-outline/30 mb-4 italic">event</span>
             <p className="text-outline text-sm italic">Cargando cronograma maestro de la barbería...</p>
          </div>
        </div>
      )}

      {/* VIEW: CLIENTES */}
      {activeTab === 'clientes' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Base de Datos de Clientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-surface-container p-6 rounded-2xl border border-outline/5">
                <p className="text-outline text-[10px] font-black uppercase tracking-widest mb-1">Total Registrados</p>
                <h4 className="text-3xl font-black text-primary font-headline">{stats?.newClientsToday || 0}</h4>
             </div>
          </div>
        </div>
      )}

      {/* VIEW: REPORTES */}
      {activeTab === 'reportes' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Informes & Analítica</h3>
          <div className="grid grid-cols-3 gap-6">
             <div className="col-span-2 bg-surface-container p-8 rounded-3xl h-64 border border-outline/5">
                <div className="h-full w-full bg-surface-container-low rounded-xl animate-pulse" />
             </div>
             <div className="bg-surface-container p-8 rounded-3xl h-64 border border-outline/5" />
          </div>
        </div>
      )}

      {/* VIEW: CONFIGURACIÓN */}
      {activeTab === 'configuracion' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Ajustes del Sistema</h3>
          <div className="max-w-xl space-y-4">
             <div className="bg-surface-container p-6 rounded-2xl border border-outline/5 flex justify-between items-center">
                <span className="font-bold text-on-surface">Horario de Apertura</span>
                <span className="text-primary font-black">09:00 AM - 08:00 PM</span>
             </div>
          </div>
        </div>
      )}

      {/* VIEW: SERVICIOS */}
      {activeTab === 'servicios' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Gestión de Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-surface-container p-6 rounded-2xl border border-outline/5">
                <h4 className="text-lg font-black text-on-surface font-headline">{service.name}</h4>
                <p className="text-primary font-bold text-xl mt-2">${service.price}</p>
                <p className="text-outline text-xs mt-1">{service.duration} min</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: BARBEROS */}
      {activeTab === 'barberos' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
          <h3 className="text-3xl font-black text-on-surface font-headline italic">Catálogo de Barberos</h3>
          <div className="grid gap-6">
            {barberList.map(barber => (
              <div key={barber.id} className="bg-surface-container p-8 rounded-3xl border border-outline/5 flex gap-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container-high border-2 border-primary/10">
                  <img src={barber.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black text-on-surface font-headline">{barber.name}</h4>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">{barber.specialty}</p>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Biografía Profesional</label>
                  <textarea 
                    defaultValue={barber.bio}
                    className="w-full bg-surface-container-low text-sm p-4 rounded-xl border border-outline/10 text-on-surface focus:border-primary outline-none transition-all h-32 resize-none italic"
                  />
                  <div className="mt-4 flex justify-end">
                    <button className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:scale-105 transition-all">
                      Actualizar Bio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nueva Cita (Reutilizado del original) */}
      <Dialog.Root open={showNewApptModal} onOpenChange={setShowNewApptModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface p-8 rounded-3xl z-50 border border-primary/20 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-on-surface font-headline mb-6 uppercase tracking-tighter">Nueva Cita</h2>
            {/* Formulario simplificado */}
            <form className="space-y-4 text-left">
               {/* Inputs... */}
               <button className="w-full bg-primary py-4 rounded-xl font-black uppercase text-xs tracking-widest text-on-primary">Registrar</button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
