import { useState } from 'react'
import { upcomingAppointments, pastAppointments } from '../../data/mockData'

const STATUS_STYLES = {
  confirmed: { label: 'Confirmada', cls: 'bg-green-500/10 text-green-500' },
  completed: { label: 'Completada', cls: 'bg-secondary/10 text-secondary' },
  cancelled: { label: 'Cancelada', cls: 'bg-error/10 text-error' },
  en_curso: { label: 'En curso', cls: 'bg-primary/10 text-primary' },
}

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function AppointmentCard({ appt, isPast }) {
  const date = new Date(appt.date)
  const status = STATUS_STYLES[appt.status]

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
            <h3 className="font-headline font-bold text-on-surface truncate">{appt.service}</h3>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex-shrink-0 ${status.cls}`}>
              {appt.status === 'en_curso' && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-base">person</span>
              <span>{appt.barber}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-base">schedule</span>
              <span>{appt.time}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-primary font-headline font-bold">${appt.price} <span className="text-outline text-xs font-normal">MXN</span></span>
            {!isPast && appt.status === 'confirmed' && (
              <button className="text-xs text-outline hover:text-error transition-colors font-medium">
                Cancelar
              </button>
            )}
            {isPast && appt.status === 'completed' && (
              <button className="text-xs text-secondary hover:underline transition-colors font-medium flex items-center gap-1">
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
        {tab === 'upcoming' && (
          upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} isPast={false} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-outline/30 mb-4">event_busy</span>
              <p className="font-headline font-bold text-on-surface">No tienes citas próximas</p>
              <p className="text-outline text-sm mt-1">¡Agenda tu siguiente visita!</p>
            </div>
          )
        )}
        {tab === 'past' && (
          pastAppointments.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} isPast={true} />
          ))
        )}
      </div>
    </div>
  )
}
