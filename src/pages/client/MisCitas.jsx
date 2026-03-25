import { useState, useEffect } from 'react'
import { getClientAppointments, cancelAppointment } from '../../services/api'

const STATUS_STYLES = {
  confirmed: { label: 'Confirmada', cls: 'bg-green-500/10 text-green-500' },
  completed: { label: 'Completada', cls: 'bg-secondary/10 text-secondary' },
  cancelled: { label: 'Cancelada', cls: 'bg-error/10 text-error' },
  en_curso: { label: 'En curso', cls: 'bg-primary/10 text-primary' },
}

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function AppointmentCard({ appt, isPast, onCancel, onShowReceipt }) {
  const date = new Date(appt.date)
  const status = STATUS_STYLES[appt.status.toLowerCase()] || STATUS_STYLES['confirmed']
  const serviceName = appt.service?.name || 'Servicio Barbería'
  const barberName = appt.barber?.name || 'Barbero'

  return (
    <div className="bg-surface-container rounded-xl p-5 relative overflow-hidden group hover:bg-surface-container-high transition-colors">
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-secondary opacity-5 pointer-events-none">
        content_cut
      </span>

      <div className="flex items-start gap-4">
        {/* Date Block */}
        <div className="flex-shrink-0 w-14 h-14 bg-surface-container-high rounded-xl flex flex-col items-center justify-center">
          <span className="text-primary font-headline font-black text-lg leading-none">{date.getDate()}</span>
          <span className="text-outline text-[10px] uppercase font-bold">{monthNames[date.getMonth()]}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline font-bold text-on-surface truncate">{serviceName}</h3>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex-shrink-0 ${status.cls}`}>
              {appt.status === 'EN_CURSO' && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-base">person</span>
              <span>{barberName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-base">schedule</span>
              <span>{appt.time}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-primary font-headline font-bold">${appt.price} <span className="text-outline text-xs font-normal">MXN</span></span>
            {!isPast && appt.status !== 'CANCELLED' && (
              <button onClick={() => onCancel(appt.id)} className="text-xs text-outline hover:text-error transition-colors font-medium">
                Cancelar
              </button>
            )}
            {isPast && appt.status === 'COMPLETED' && (
              <button onClick={() => onShowReceipt(appt)} className="text-xs text-secondary hover:underline transition-colors font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">receipt_long</span>
                Ver comprobante
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MisCitas() {
  const [tab, setTab] = useState('upcoming')
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [receiptMode, setReceiptMode] = useState(null) // Para el popup

  useEffect(() => {
    loadCitas()
  }, [])

  const loadCitas = async () => {
    setIsLoading(true)
    const data = await getClientAppointments('current')
    setAppointments(data)
    setIsLoading(false)
  }

  const handleCancel = async (id) => {
    if(window.confirm('¿Seguro que deseas cancelar esta cita?')) {
      await cancelAppointment(id)
      loadCitas()
    }
  }

  // Filtrar base en fecha actual
  const now = new Date()
  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= now || a.status === 'PENDING')
  const pastAppointments = appointments.filter(a => new Date(a.date) < now && a.status !== 'PENDING')

  return (
    <div className="px-6 max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-secondary font-headline text-xs font-bold tracking-[0.2em] uppercase block mb-2">Mi Historial</span>
        <h1 className="font-headline font-extrabold text-4xl leading-tight tracking-tighter text-on-surface">
          Mis <span className="text-secondary italic">Citas</span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container p-1 rounded-xl">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === 'upcoming' ? 'bg-primary-container text-on-primary-container shadow-lg' : 'text-outline hover:text-on-surface'}`}
        >
          Próximas ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === 'past' ? 'bg-primary-container text-on-primary-container shadow-lg' : 'text-outline hover:text-on-surface'}`}
        >
          Pasadas ({pastAppointments.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-outline py-10">Cargando tus citas...</p>
        ) : tab === 'upcoming' && (
          upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} isPast={false} onCancel={handleCancel} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-outline/30 mb-4">event_busy</span>
              <p className="font-headline font-bold text-on-surface">No tienes citas próximas</p>
              <p className="text-outline text-sm mt-1">¡Agenda tu siguiente visita!</p>
            </div>
          )
        )}
        {!isLoading && tab === 'past' && (
          pastAppointments.length > 0 ? pastAppointments.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} isPast={true} onShowReceipt={setReceiptMode} />
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-outline/30 mb-4">history</span>
              <p className="font-headline font-bold text-on-surface">No hay citas pasadas</p>
            </div>
          )
        )}
      </div>

      {/* COMPROBANTE MODAL */}
      {receiptMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
             <button 
                onClick={() => setReceiptMode(null)} 
                className="absolute top-4 right-4 text-outline hover:text-on-surface"
             >
                <span className="material-symbols-outlined">close</span>
             </button>
             <div className="text-center mb-6">
                <span className="material-symbols-outlined text-4xl text-secondary mb-2">check_circle</span>
                <h2 className="font-headline font-bold text-on-surface text-xl">Comprobante de Pago</h2>
                <p className="text-outline text-xs mt-1">Ref: {receiptMode.id.split('-')[0].toUpperCase()}</p>
             </div>
             
             <div className="space-y-4 text-sm bg-surface p-4 rounded-xl border border-outline-variant/10 text-on-surface-variant">
                <div className="flex justify-between">
                   <span>Fecha</span>
                   <span className="font-bold text-on-surface">{new Date(receiptMode.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                   <span>Servicio</span>
                   <span className="font-bold text-on-surface max-w-[150px] truncate text-right">{receiptMode.service?.name}</span>
                </div>
                <div className="flex justify-between">
                   <span>Barbero</span>
                   <span className="font-bold text-on-surface">{receiptMode.barber?.name}</span>
                </div>
                <div className="h-px bg-outline/10 w-full" />
                <div className="flex justify-between text-base">
                   <span className="font-bold text-on-surface">Total pagado</span>
                   <span className="font-headline font-black text-primary">${receiptMode.price} MXN</span>
                </div>
             </div>

             <button 
                onClick={() => window.print()}
                className="w-full mt-6 bg-primary-container text-on-primary-container hover:bg-primary font-headline font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
                <span className="material-symbols-outlined text-sm">download</span>
                Descargar PDF
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
