import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { services, barbers, timeSlots, unavailableSlots } from '../../data/mockData'

const STEPS = ['Servicio', 'Barbero', 'Fecha y Hora']

function getCalendarDays() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)
  return { days, year, month }
}

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function ReservaCita() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const { days, year, month } = getCalendarDays()
  const today = new Date().getDate()

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }
  const handleBack = () => setStep(s => s - 1)

  const canContinue = step === 0 ? !!selectedService
    : step === 1 ? !!selectedBarber
    : selectedDay && selectedTime

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 leather-texture min-h-screen">
      {/* Hero Header */}
      <section className="mb-10 relative">
        <span className="font-headline font-bold text-primary tracking-tighter text-sm uppercase mb-2 block">
          Paso {String(step + 1).padStart(2, '0')} / Reserva
        </span>
        <h2 className="font-headline font-extrabold text-5xl leading-[0.95] tracking-tighter text-on-surface max-w-md">
          {step === 0 && <>Elige tu <span className="text-secondary italic">Servicio</span></>}
          {step === 1 && <>Elige tu <span className="text-secondary italic">Barbero</span></>}
          {step === 2 && <>Elige tu <span className="text-secondary italic">Momento</span></>}
        </h2>
        <div className="absolute -top-4 -right-4 w-32 h-32 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[120px] text-secondary">content_cut</span>
        </div>
        {/* Steps */}
        <div className="flex gap-2 mt-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-secondary' : 'w-4 bg-outline-variant'}`} />
              <span className={`text-xs font-bold ${i === step ? 'text-primary' : i < step ? 'text-secondary' : 'text-outline/40'}`}>{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Step 0: Select Service */}
      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`p-5 rounded-xl text-left transition-all duration-200 border group ${
                selectedService?.id === service.id
                  ? 'bg-primary-container/30 border-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container border-outline-variant/10 hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedService?.id === service.id ? 'bg-primary-container' : 'bg-surface-container-high'}`}>
                  <span className={`material-symbols-outlined text-xl ${selectedService?.id === service.id ? 'text-on-primary-container' : 'text-secondary'}`}>{service.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-on-surface">{service.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{service.description}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-primary text-sm font-bold">${service.price}</span>
                    <span className="text-outline text-xs">{service.duration} min</span>
                  </div>
                </div>
                {selectedService?.id === service.id && (
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Select Barber */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {barbers.map(barber => (
            <button
              key={barber.id}
              onClick={() => barber.available && setSelectedBarber(barber)}
              disabled={!barber.available}
              className={`p-5 rounded-xl text-left transition-all duration-200 border ${
                !barber.available ? 'opacity-40 cursor-not-allowed bg-surface-container border-outline-variant/10' :
                selectedBarber?.id === barber.id
                  ? 'bg-primary-container/30 border-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container border-outline-variant/10 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <img src={barber.avatar} alt={barber.name} className="w-14 h-14 rounded-xl object-cover grayscale" />
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-on-surface">{barber.name}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{barber.specialty}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-on-surface">{barber.rating}</span>
                    <span className="text-xs text-outline">({barber.reviews})</span>
                  </div>
                </div>
                {barber.available ? (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                ) : (
                  <span className="text-[10px] text-outline uppercase font-bold">Ocupado</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-outline">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-outline">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {dayNames.map(d => (
                  <div key={d} className="text-[10px] font-bold uppercase tracking-widest text-secondary/60 mb-2">{d}</div>
                ))}
                {days.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day ? (
                      <button
                        onClick={() => day >= today && setSelectedDay(day)}
                        disabled={day < today}
                        className={`w-9 h-9 flex items-center justify-center rounded-md font-medium text-sm transition-all ${
                          selectedDay === day
                            ? 'bg-primary-container text-on-primary-container font-bold shadow-md shadow-primary-container/30'
                            : day < today
                            ? 'text-outline/20 cursor-not-allowed'
                            : day === today
                            ? 'text-primary font-bold hover:bg-surface-container-high'
                            : 'text-on-surface hover:text-primary hover:bg-surface-container-high'
                        }`}
                      >
                        {day}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            {/* Cancellation Policy */}
            <div className="bg-surface-container-low rounded-lg p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary flex-shrink-0">info</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Política de Cancelación</p>
                <p className="text-xs text-outline leading-relaxed mt-1">Cancela hasta 24 horas antes sin cargos adicionales. Los retrasos de más de 15 min pueden incurrir en reprogramación.</p>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="lg:col-span-5 space-y-6">
            {selectedDay ? (
              <>
                {[
                  { label: 'Mañana', icon: 'light_mode', slots: timeSlots.morning },
                  { label: 'Tarde', icon: 'sunny', slots: timeSlots.afternoon },
                  { label: 'Noche', icon: 'dark_mode', slots: timeSlots.evening },
                ].map(period => (
                  <div key={period.label}>
                    <h3 className="font-headline font-bold text-secondary text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">{period.icon}</span>
                      {period.label}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {period.slots.map(time => {
                        const isUnavailable = unavailableSlots.includes(time)
                        const isSelected = selectedTime === time
                        return (
                          <button
                            key={time}
                            onClick={() => !isUnavailable && setSelectedTime(time)}
                            disabled={isUnavailable}
                            className={`py-3 px-2 text-sm rounded-md transition-all ${
                              isUnavailable
                                ? 'border border-outline/10 text-outline/30 opacity-40 cursor-not-allowed line-through'
                                : isSelected
                                ? 'border-2 border-secondary bg-primary-container text-on-primary-container font-bold shadow-lg scale-105'
                                : 'border border-outline/20 text-outline hover:border-primary/50 hover:text-on-surface'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <span className="material-symbols-outlined text-4xl text-outline/30 mb-3">calendar_today</span>
                <p className="text-outline text-sm">Selecciona una fecha para ver los horarios disponibles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#131313]/90 backdrop-blur-xl border-t border-[#353534]/20 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Summary */}
          <div className="flex items-center gap-4 min-w-0">
            {selectedService && (
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-on-surface text-sm leading-none truncate">{selectedService.name}</h4>
                <p className="text-secondary text-xs mt-1">
                  {selectedBarber ? `con ${selectedBarber.name}` : 'Selecciona barbero'}
                  {selectedDay && selectedTime ? ` · Día ${selectedDay}, ${selectedTime}` : ''}
                </p>
              </div>
            )}
            {selectedService && (
              <div className="text-right flex-shrink-0">
                <span className="block text-[10px] uppercase tracking-widest text-outline font-bold">Total</span>
                <span className="text-lg font-headline font-extrabold text-on-surface">${selectedService.price}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-shrink-0">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-3 border border-outline/20 text-outline hover:text-on-surface rounded-md font-headline font-bold text-sm transition-all"
              >
                Atrás
              </button>
            )}
            <button
              onClick={step < 2 ? handleNext : () => navigate('/mis-citas')}
              disabled={!canContinue}
              className={`px-8 py-3 rounded-md font-headline font-bold text-sm transition-all active:scale-95 ${
                canContinue
                  ? 'bg-primary-container text-on-primary-container hover:bg-primary shadow-lg shadow-primary-container/20'
                  : 'bg-surface-container text-outline cursor-not-allowed'
              }`}
            >
              {step < 2 ? 'Continuar' : 'Confirmar Reserva'}
              {canContinue && <span className="material-symbols-outlined align-middle ml-2 text-base">arrow_forward</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Extra bottom padding for fixed footer */}
      <div className="h-24" />
    </div>
  )
}
