import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { getServices, getBarbers, bookAppointment, getCurrentUser } from '../../services/api'

const STEPS = ['Servicio', 'Barbero', 'Fecha', 'Pago']

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
  const location = useLocation()
  const [step, setStep] = useState(0)
  
  // Data de la API
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [user, setUser] = useState(null)
  
  const [selectedService, setSelectedService] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('sucursal') // 'sucursal' o 'linea'
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)

  // Tiempos fijos para la grid
  const timeSlots = {
    morning: ['09:00', '10:00', '11:00', '11:30'],
    afternoon: ['13:00', '14:00', '15:30', '17:00'],
    evening: ['18:00', '19:30', '20:00']
  }
  const unavailableSlots = ['10:00', '14:00', '19:30'] // Fake unavailable

  useEffect(() => {
    Promise.all([getServices(), getBarbers(), getCurrentUser()]).then(([servs, barbs, u]) => {
      setServices(servs)
      setBarbers(barbs)
      setUser(u)

      // 1. Manejar Cita Express desde URL Query Params (Home)
      const params = new URLSearchParams(location.search)
      const qServiceId = params.get('service')
      const qBarberId = params.get('barber')

      if (qServiceId) {
        const foundServ = servs.find(s => s.id === qServiceId)
        if (foundServ) {
          setSelectedService(foundServ)
          
          if (qBarberId) {
            const foundBarb = barbs.find(b => b.id === qBarberId)
            if (foundBarb) {
              setSelectedBarber(foundBarb)
              setStep(2) // Saltar directamente a FECHA (Paso 2)
            } else {
              setStep(1) // Si el barbero no existe, ir a elegir barbero
            }
          } else {
            setStep(1) // Solo servicio, ir a elegir barbero
          }
        }
      }

      // 2. Manejar deep-linking heredado (location state)
      const stateServiceId = location.state?.serviceId
      if (stateServiceId && !qServiceId) {
        const found = servs.find(s => s.id === stateServiceId)
        if (found) {
          setSelectedService(found)
          setStep(1)
        }
      }
    })
  }, [location.search, location.state])

  const { days, year, month } = getCalendarDays()
  const today = new Date().getDate()

  const handleNext = async () => {
    if (step < 3) {
      setStep(s => s + 1)
    } else {
      handleConfirmBooking()
    }
  }

  const handleConfirmBooking = async () => {
    setIsDeploying(true)
    
    // Normalizar a MEDIODÍA del día seleccionado en la zona del cliente para evitar desplazamientos por zona horaria al convertir a ISO en el server.
    const apptDate = new Date(year, month, selectedDay, 12, 0, 0, 0)
    
    const payload = {
      clientId: user?.id || 'fail',
      barberId: selectedBarber.id,
      serviceId: selectedService.id,
      date: apptDate.toISOString(), // Enviar ISO completo pero con hora segura
      time: selectedTime,
      price: selectedService.price,
      paymentMethod: paymentMethod === 'sucursal' ? 'PRESENCIAL' : 'LINEA'
    }
    
    const res = await bookAppointment(payload)
    setIsDeploying(false)
    
    if (res.success) {
      setShowSuccessModal(true)
    } else {
      alert("Hubo un error al procesar tu cita. Por favor intentalo de nuevo.")
    }
  }
  const handleBack = () => setStep(s => s - 1)

  const canContinue = step === 0 ? !!selectedService
    : step === 1 ? !!selectedBarber
    : step === 2 ? (selectedDay && selectedTime)
    : !!paymentMethod

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
          {step === 3 && <>Finaliza el <span className="text-secondary italic">Pago</span></>}
        </h2>
        <div className="absolute -top-4 -right-4 w-32 h-32 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[120px] text-secondary">
            {step === 3 ? 'payments' : 'content_cut'}
          </span>
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
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Filtros de Categoría */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {['Todos', 'Corte', 'Barba'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface-container border-outline/5 text-outline hover:border-primary/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(services.filter(s => activeCategory === 'Todos' || s.category === activeCategory)).map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border relative group overflow-hidden ${
                  selectedService?.id === service.id
                    ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10 scale-[1.02]'
                    : 'bg-surface-container border-outline/5 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${selectedService?.id === service.id ? 'bg-primary text-on-primary rotate-3' : 'bg-surface-container-high text-outline'}`}>
                    <span className="material-symbols-outlined text-2xl font-variation-icon">{service.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-on-surface text-lg leading-tight mb-1">{service.name}</h3>
                    <div className="flex gap-3 items-center">
                      <span className="text-primary text-sm font-black italic">${service.price}</span>
                      <span className="w-1 h-1 bg-outline/30 rounded-full" />
                      <span className="text-outline text-[10px] font-black uppercase tracking-wider">{service.duration} min</span>
                    </div>
                  </div>
                  {selectedService?.id === service.id && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="w-10 h-10 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all animate-in zoom-in"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </div>
                  )}
                </div>
                {/* Subtle Gold Pulse if selected */}
                {selectedService?.id === service.id && (
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Select Barber */}
      {step === 1 && (
        <div className="space-y-6">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-outline hover:text-secondary transition-colors text-sm font-bold group mb-2"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Volver al Inicio
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {barbers.map(barber => (
              <button
                key={barber.id}
                onClick={() => barber.isAvailable && setSelectedBarber(barber)}
                disabled={!barber.isAvailable}
                className={`p-5 rounded-xl text-left transition-all duration-300 border relative group ${
                  !barber.isAvailable ? 'opacity-40 cursor-not-allowed bg-surface-container border-transparent' :
                  selectedBarber?.id === barber.id
                    ? 'bg-primary-container/20 border-primary shadow-[0_0_20px_rgba(249,186,130,0.1)]'
                    : 'bg-surface-container border-transparent hover:border-outline-variant/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={barber.avatar} alt={barber.name} className={`w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all ${selectedBarber?.id === barber.id && 'grayscale-0 border-2 border-primary'}`} />
                    {barber.isAvailable && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-surface-container rounded-full" />}
                  </div>
                  <div className="flex-1 pr-10">
                    <h3 className="font-headline font-bold text-on-surface">{barber.name}</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{barber.specialty}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold text-on-surface">{barber.rating}</span>
                    </div>
                  </div>
                  
                  {/* Botón Siguiente Mini */}
                  {selectedBarber?.id === barber.id && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all animate-in zoom-in duration-300"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </div>
                  )}

                  {!barber.isAvailable && (
                    <span className="text-[10px] text-outline uppercase font-black tracking-tighter">No Disponible</span>
                  )}
                </div>
              </button>
            ))}
          </div>
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
                {/* Botón Agendar (dentro del flujo) */}
                {selectedDay && selectedTime && (
                  <div className="pt-8 flex justify-end animate-in fade-in slide-in-from-top-4 duration-500">
                    <button 
                      onClick={handleNext}
                      className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-headline font-black text-sm shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                    >
                      AGENDAR CITA
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                )}
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

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-headline font-bold text-on-surface">¿Cómo deseas pagar?</h3>
            <p className="text-sm text-on-surface-variant mt-2 tracking-tight">Selecciona tu método de preferencia para finalizar la reserva.</p>
          </div>
          
          <button
            onClick={() => setPaymentMethod('sucursal')}
            className={`w-full p-6 rounded-2xl flex items-center gap-5 transition-all outline-none text-left border-2 group relative transition-all duration-300 ${
              paymentMethod === 'sucursal' 
               ? 'border-primary bg-primary/20 shadow-[0_10px_40px_rgba(249,186,130,0.25)] scale-[1.02]' 
               : 'border-outline/10 bg-surface-container hover:border-primary/40'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'sucursal' ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-high text-secondary'}`}>
               <span className="material-symbols-outlined text-3xl">store</span>
            </div>
            <div className="flex-1">
               <h4 className={`font-headline font-black text-lg transition-colors ${paymentMethod === 'sucursal' ? 'text-primary' : 'text-white'}`}>Pago en Sucursal</h4>
               <p className={`text-xs mt-1 leading-relaxed ${paymentMethod === 'sucursal' ? 'text-white/80' : 'text-outline-variant'}`}>Paga físicamente el día de tu cita.</p>
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); handleConfirmBooking(); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${paymentMethod === 'sucursal' ? 'bg-secondary text-on-secondary scale-110 shadow-xl' : 'bg-surface-container-highest text-outline group-hover:bg-primary/10 group-hover:text-primary'}`}
            >
               <span className="material-symbols-outlined text-2xl font-black">arrow_forward</span>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('linea')}
            className={`w-full p-6 rounded-2xl flex items-center gap-5 transition-all outline-none text-left border-2 group relative overflow-hidden transition-all duration-300 ${
              paymentMethod === 'linea' 
               ? 'border-primary bg-primary/20 shadow-[0_10px_40px_rgba(249,186,130,0.25)] scale-[1.02]' 
               : 'border-outline/10 bg-surface-container hover:border-primary/40'
            }`}
          >
            {paymentMethod === 'linea' && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'linea' ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-high text-secondary'}`}>
               <span className="material-symbols-outlined text-3xl">credit_card</span>
            </div>
            <div className="flex-1 z-10 w-full">
               <div className="flex items-center justify-between w-full">
                  <h4 className={`font-headline font-black text-lg transition-colors ${paymentMethod === 'linea' ? 'text-primary' : 'text-white'}`}>Pago en Línea</h4>
                  <span className="bg-primary/20 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/30">Próximamente</span>
               </div>
               <p className={`text-xs mt-1 leading-relaxed ${paymentMethod === 'linea' ? 'text-white/80' : 'text-outline-variant'}`}>Paga de forma segura con tarjeta (Stripe).</p>
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); handleConfirmBooking(); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${paymentMethod === 'linea' ? 'bg-secondary text-on-secondary scale-110 shadow-xl' : 'bg-surface-container-highest text-outline group-hover:bg-primary/10 group-hover:text-primary'}`}
            >
               <span className="material-symbols-outlined text-2xl font-black">arrow_forward</span>
            </div>
          </button>
        </div>
      )}

      {/* MODAL DE ÉXITO CON RADIX UI */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md animate-in fade-in duration-300" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] max-w-sm w-full outline-none animate-in zoom-in-95 duration-500">
                <div className="bg-gradient-to-b from-surface-container-highest to-surface-container rounded-3xl p-10 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-2 border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
                    <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20 animate-bounce">
                        <span className="material-symbols-outlined text-6xl">verified</span>
                    </div>
                    <Dialog.Title className="text-3xl font-black font-headline text-on-surface mb-3 tracking-tighter">
                        ¡Cita <span className="text-secondary italic">Confirmada!</span>
                    </Dialog.Title>
                    <Dialog.Description className="text-base text-white/90 mb-10 leading-relaxed font-bold">
                        Tu reserva fue exitosa para el <span className="text-on-surface">{selectedDay}/{month + 1}/{year}</span> a las <span className="text-secondary">{selectedTime} HS</span>.
                    </Dialog.Description>
                    <button 
                        onClick={() => navigate('/mis-citas')}
                        className="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-headline font-black text-sm shadow-2xl shadow-secondary/40 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                    >
                        VER MI AGENDA
                    </button>
                    <p className="mt-6 text-[10px] text-outline-variant font-black uppercase tracking-[0.3em]">Black & Blade Barbershop</p>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
              onClick={handleNext}
              disabled={!canContinue || isDeploying}
              className={`px-8 py-3 rounded-md font-headline font-bold text-sm transition-all flex items-center gap-2 ${
                canContinue
                  ? 'bg-primary-container text-on-primary-container hover:bg-primary shadow-lg shadow-primary-container/20 active:scale-95 cursor-pointer'
                  : 'bg-surface-container text-outline cursor-not-allowed border border-outline/10'
              }`}
            >
              {isDeploying ? (
                 <span className="material-symbols-outlined animate-spin text-base">sync</span>
              ) : step === 2 ? 'Agendar' : step === 3 ? 'Confirmar Reserva' : 'Continuar'}
              {canContinue && !isDeploying && <span className="material-symbols-outlined align-middle ml-1 text-base">arrow_forward</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Extra bottom padding for fixed footer */}
      <div className="h-24" />
    </div>
  )
}
