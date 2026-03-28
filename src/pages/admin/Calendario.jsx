import { useState, useEffect } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { getBarbers, getAppointments } from '../../services/api'

const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

function getWeekDates() {
  const now = new Date()
  const day = now.getDay() // 0 (Sun) to 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust to get Monday
  const monday = new Date(now.setDate(diff))
  
  const daysArr = []
  const names = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    
    // Formato YYYY-MM-DD local manual para evitar desfases de toISOString
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dayNum = String(d.getDate()).padStart(2, '0')
    const localYMD = `${y}-${m}-${dayNum}`

    daysArr.push({
      abbr: names[i],
      num: d.getDate(),
      fullDate: localYMD,
      current: d.toDateString() === new Date().toDateString()
    })
  }
  return daysArr
}

const days = getWeekDates()
const currentMonthYear = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()



export default function Calendario() {
  const [view, setView] = useState('Semana')
  const [selectedBarberId, setSelectedBarberId] = useState('all')
  const [barberList, setBarberList] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [openPopoverId, setOpenPopoverId] = useState(null)

  useEffect(() => {
    Promise.all([getBarbers(true), getAppointments()]).then(([barbs, appts]) => {
      setBarberList(barbs)
      setAppointments(appts)
      setLoading(false)
    })
  }, [])

  // Helper to map index (0-6) to actual week dates starting from the 18th in mock days
  // In a real app we'd use date-fns to get the current week.
  const getApptsForSlot = (hour, dayIndex) => {
    return appointments.filter(a => {
      const d = new Date(a.date)
      // Normalizar a YYYY-MM-DD local exacto para comparar con el grid
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dayNum = String(d.getDate()).padStart(2, '0')
      const apptYMD = `${y}-${m}-${dayNum}`
      
      const targetYMD = days[dayIndex].fullDate
      
      const matchesDate = apptYMD === targetYMD
      const matchesHour = a.time === hour
      const matchesBarber = selectedBarberId === 'all' || a.barberId === selectedBarberId
      
      return matchesDate && matchesHour && matchesBarber
    })
  }

  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Gestión de Calendario</h2>
          <nav className="flex items-center gap-2 text-sm text-outline">
            <span>Admin</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-secondary">Agenda {view}</span>
          </nav>
        </div>
        <div className="flex items-center gap-4 bg-surface-container px-6 py-3 rounded-2xl border border-outline-variant/10 shadow-lg">
           <span className="material-symbols-outlined text-primary">calendar_today</span>
           <span className="text-sm font-black font-headline tracking-widest text-on-surface">
             {currentMonthYear}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-container p-6 rounded-xl relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-secondary/5 text-8xl pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>content_cut</span>
            <h3 className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">Filtrar por Barbero</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high cursor-pointer border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-sm">group</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface">Todos los Barberos</span>
                </div>
                <input type="radio" name="barber" checked={selectedBarberId === 'all'} onChange={() => setSelectedBarberId('all')} className="text-primary" />
              </label>
              {barberList.map(barber => (
                <label key={barber.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high cursor-pointer border border-outline-variant/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <img src={barber.avatar} alt={barber.name} className={`w-8 h-8 rounded-full transition-all ${barber.isAvailable ? 'grayscale-0' : 'grayscale opacity-40'}`} />
                    <span className="text-sm font-medium text-on-surface">{barber.name}</span>
                  </div>
                  <input type="radio" name="barber" checked={selectedBarberId === barber.id} onChange={() => setSelectedBarberId(barber.id)} className="text-primary" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-xl">
            <h3 className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">Resumen de Hoy</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-outline">Citas Totales</span>
                <span className="text-sm font-bold text-on-surface">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-outline">Disponibles</span>
                <span className="text-sm font-bold text-primary">6</span>
              </div>
              <div className="h-px bg-outline-variant/10 w-full" />
              <button className="w-full py-3 bg-secondary-container text-secondary font-bold text-sm rounded-lg hover:bg-secondary hover:text-on-secondary transition-all">
                + NUEVA CITA
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl">
            {/* Header row */}
            <div className="calendar-grid border-b border-outline-variant/10 bg-surface-container-high/50">
              <div className="p-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">schedule</span>
              </div>
              {days.map(day => (
                <div key={day.num} className={`p-4 text-center ${day.current ? 'bg-primary/5 relative' : ''}`}>
                  {day.current && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
                  <p className={`text-[10px] uppercase font-bold tracking-tighter ${day.current ? 'text-primary' : 'text-outline'}`}>{day.abbr}</p>
                  <p className={`text-lg font-black ${day.current ? 'text-primary' : 'text-on-surface'}`}>{day.num}</p>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="h-[520px] overflow-y-auto custom-scrollbar">
              <div className="calendar-grid">
                {hours.map((hour) => (
                  <div key={hour} className="contents">
                    <div className="h-20 border-b border-r border-outline-variant/10 flex items-start justify-center pt-2 text-xs font-bold text-outline">
                      {hour}
                    </div>
                    {days.map((day, di) => {
                      const apptsInSlot = getApptsForSlot(hour, di)
                      return (
                        <div
                          key={`${hour}-${di}`}
                          className={`h-20 border-b border-outline-variant/10 relative p-1 ${day.current ? 'bg-primary/5' : ''}`}
                        >
                          {apptsInSlot.map((appt, ai) => (
                            <Popover.Root 
                              key={appt.id} 
                              open={openPopoverId === appt.id} 
                              onOpenChange={(open) => setOpenPopoverId(open ? appt.id : null)}
                            >
                                <Popover.Trigger asChild>
                                    <div
                                      onMouseEnter={() => setOpenPopoverId(appt.id)}
                                      onMouseLeave={() => setOpenPopoverId(null)}
                                      className="absolute inset-x-1 bg-gradient-to-br from-[#8B5A2B] to-[#D4AF77] rounded p-1.5 shadow-lg z-10 cursor-pointer hover:brightness-110 transition-all overflow-hidden"
                                      style={{ 
                                        top: `${ai * 2}px`, 
                                        height: '72px' 
                                      }}
                                    >
                                      <p className="text-[9px] font-black text-on-primary-container leading-tight mb-0.5 truncate">{appt.service.name}</p>
                                      <p className="text-[10px] font-medium text-on-primary-container/90 truncate">{appt.client.name}</p>
                                    </div>
                                </Popover.Trigger>

                                <Popover.Portal>
                                    <Popover.Content 
                                        side="top" 
                                        sideOffset={5}
                                        className="z-[200] w-64 bg-surface-container-highest border-2 border-primary/30 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] outline-none animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-primary font-black text-[10px] uppercase tracking-widest">Resumen de Cita</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${appt.paymentMethod === 'PRESENCIAL' ? 'bg-secondary/10 text-secondary' : 'bg-green-500/10 text-green-500'}`}>
                                                {appt.paymentMethod === 'PRESENCIAL' ? 'POR PAGAR' : 'PAGADO'}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-outline">calendar_month</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-outline font-bold uppercase leading-none mb-1">Fecha</p>
                                                    <p className="text-xs text-on-surface font-black">{new Date(appt.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-outline">schedule</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-outline font-bold uppercase leading-none mb-1">Horario</p>
                                                    <p className="text-xs text-on-surface font-black uppercase">{appt.time} HS</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-outline">payments</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-outline font-bold uppercase leading-none mb-1">Método de Pago</p>
                                                    <p className="text-xs font-black text-on-surface">
                                                        {appt.paymentMethod === 'PRESENCIAL' ? '💳 Pago en Sucursal' : '💳 Pago en Línea'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Popover.Arrow className="fill-primary/30" />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FABs */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
        <button className="w-14 h-14 bg-surface-container rounded-full border border-outline-variant/20 flex items-center justify-center text-primary shadow-xl hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">print</span>
        </button>
        <button className="w-16 h-16 bg-gradient-to-tr from-primary-container to-secondary-container rounded-full flex items-center justify-center text-on-primary-container shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  )
}
