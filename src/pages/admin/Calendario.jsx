import { useState } from 'react'
import { barbers } from '../../data/mockData'

const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
const days = [
  { abbr: 'LUN', num: 18 },
  { abbr: 'MAR', num: 19 },
  { abbr: 'MIÉ', num: 20, current: true },
  { abbr: 'JUE', num: 21 },
  { abbr: 'VIE', num: 22 },
  { abbr: 'SÁB', num: 23 },
  { abbr: 'DOM', num: 24 },
]

// Sample appointments on the calendar
const calAppts = [
  { hour: '09:00', day: 1, label: 'CORTE CLÁSICO', client: 'Carlos Ruiz' },
  { hour: '10:00', day: 2, label: 'BARBA & CORTE', client: 'Luis Méndez' },
  { hour: '10:00', day: 4, label: 'LIMPIEZA FACIAL', client: 'Roberto G.' },
  { hour: '11:00', day: 0, label: 'CORTE NIÑO', client: 'Daniel S.' },
  { hour: '11:00', day: 3, label: 'CORTE CLÁSICO', client: 'Alejandro P.' },
  { hour: '12:00', day: 2, label: 'VIP EXPERIENCE', client: 'Sr. Rodriguez', span: 2 },
]

export default function Calendario() {
  const [view, setView] = useState('Semana')
  const [selectedBarber, setSelectedBarber] = useState('all')

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
        <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl">
          {['Semana', 'Día', 'Mes'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${view === v ? 'bg-primary-container text-on-primary-container shadow-lg' : 'text-outline hover:text-on-surface'}`}
            >
              {v}
            </button>
          ))}
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
                <input type="radio" name="barber" checked={selectedBarber === 'all'} onChange={() => setSelectedBarber('all')} className="text-primary" />
              </label>
              {barbers.map(barber => (
                <label key={barber.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high cursor-pointer border border-outline-variant/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <img src={barber.avatar} alt={barber.name} className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm font-medium text-on-surface">{barber.name}</span>
                  </div>
                  <input type="radio" name="barber" checked={selectedBarber === barber.id} onChange={() => setSelectedBarber(barber.id)} className="text-primary" />
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
                      const appt = calAppts.find(a => a.hour === hour && a.day === di)
                      return (
                        <div
                          key={`${hour}-${di}`}
                          className={`h-20 border-b border-outline-variant/10 relative p-1 ${day.current ? 'bg-primary/5' : ''}`}
                        >
                          {appt && (
                            <div
                              className="absolute inset-1 bg-gradient-to-br from-[#8B5A2B] to-[#F9BA82] rounded-lg p-2 shadow-lg z-10 cursor-pointer hover:brightness-110 transition-all"
                              style={appt.span ? { height: `${appt.span * 80 - 8}px` } : {}}
                            >
                              <p className="text-[10px] font-black text-on-primary-container leading-none mb-1">{appt.label}</p>
                              <p className="text-xs font-medium text-on-primary-container truncate">{appt.client}</p>
                              {appt.span && (
                                <p className="mt-2 text-[9px] text-on-primary-container/70 uppercase">{appt.span * 30} MIN</p>
                              )}
                            </div>
                          )}
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
