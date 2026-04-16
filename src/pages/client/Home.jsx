import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getBarbers, getServices, getMyAppointments } from '../../services/api'

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [nextAppt, setNextAppt] = useState(null)
  
  const [quickForm, setQuickForm] = useState({ barberId: '', serviceId: '' })
  
  const promos = [
    { title: "Corte & Barba Premium", tag: "Promoción Exclusiva", benefit: "15% Off", icon: "content_cut", color: "from-[#0e0e0e] via-[#201f1f] to-[#131313]" },
    { title: "Color & Estilo Nuevo", tag: "Trend Alert", benefit: "Atrévete", icon: "brush", color: "from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" },
    { title: "Club de Fidelidad", tag: "Gana Puntos", benefit: "Regalo", icon: "military_tech", color: "from-[#131313] via-[#353534] to-[#131313]" }
  ]

  useEffect(() => {
    async function loadData() {
      try {
        const [bData, sData, appts] = await Promise.all([
          getBarbers(),
          getServices(),
          getMyAppointments()
        ])
        
        if(Array.isArray(bData)) setBarbers(bData)
        if(Array.isArray(sData)) setServices(sData)
        
        if (Array.isArray(appts) && appts.length > 0) {
          const now = new Date()
          const sorted = appts
            .filter(a => a && a.date && (new Date(a.date) >= now || (new Date(a.date).toDateString() === now.toDateString())))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
          if(sorted.length > 0) setNextAppt(sorted[0])
        }
      } catch (err) {
        console.error("Home Load Error:", err)
      }
    }
    loadData()

    const interval = setInterval(() => {
      setActiveSlide(s => (s + 1) % promos.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="px-6 max-w-2xl mx-auto space-y-10 py-6">

      {/* Next Appointment Card */}
      {nextAppt && nextAppt.date && (
        <section>
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl p-6 relative overflow-hidden group shadow-xl border border-outline-variant/5">
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] text-secondary opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">event_available</span>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-secondary font-headline text-[10px] font-black tracking-[0.2em] uppercase">Confirmada</p>
                </div>
                <h3 className="text-on-surface font-headline text-xl font-black tracking-tight">{nextAppt.service?.name || 'Servicio'}</h3>
              </div>
              <div className="bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/20">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">Próxima</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-surface-container-highest/30 p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                   <span className="material-symbols-outlined text-secondary text-lg">calendar_month</span>
                </div>
                <div>
                  <p className="text-[8px] text-outline font-black uppercase mb-0.5">Fecha</p>
                  <p className="text-xs text-on-surface font-bold">{new Date(nextAppt.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <div className="bg-surface-container-highest/30 p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                   <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
                </div>
                <div>
                  <p className="text-[8px] text-outline font-black uppercase mb-0.5">Hora</p>
                  <p className="text-xs text-on-surface font-bold">{nextAppt.time} HS</p>
                </div>
              </div>
              <div className="col-span-2 bg-surface-container-highest/30 p-3 rounded-xl flex items-center gap-3">
                 <img src={nextAppt.barber?.avatar || `https://i.pravatar.cc/150?u=${nextAppt.barber?.id}`} className="w-8 h-8 rounded-full border border-primary/20" />
                 <div>
                    <p className="text-[8px] text-outline font-black uppercase mb-0.5">Barbero</p>
                    <p className="text-xs text-on-surface font-bold">{nextAppt.barber?.name || 'Barbero'}</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Booking Widget */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-6xl">bolt</span>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-on-surface font-headline text-lg font-black uppercase tracking-tight">Cita Express</h3>
            <p className="text-outline text-xs mt-1">Elige y agenda en segundos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">¿Quién te atiende?</label>
              <select 
                value={quickForm.barberId}
                onChange={(e) => setQuickForm({...quickForm, barberId: e.target.value})}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="">Cualquier Barbero</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">¿Qué necesitas?</label>
              <select 
                value={quickForm.serviceId}
                onChange={(e) => setQuickForm({...quickForm, serviceId: e.target.value})}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="">Seleccionar Servicio</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <Link 
                to={quickForm.serviceId ? `/reservar?service=${quickForm.serviceId}&barber=${quickForm.barberId}` : '/reservar'}
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-headline font-black text-xs text-center uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                Continuar
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Hero Promo Banner Carousel */}
      <section className="relative">
        <div className="relative h-[240px] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-2xl border border-outline-variant/10">
          {promos.map((promo, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                idx === activeSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-110'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${promo.color}`} />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-10" />
              <div className="relative h-full flex flex-col justify-center px-10">
                <span className="text-secondary font-headline text-[10px] font-black tracking-[0.3em] uppercase mb-3 animate-in fade-in slide-in-from-bottom duration-500">{promo.tag}</span>
                <h2 className="text-3xl font-headline font-black text-on-surface leading-none mb-6 max-w-[220px] tracking-tighter">
                  {promo.title}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-primary font-headline text-[10px] font-black uppercase tracking-widest opacity-60">Beneficio</span>
                    <span className="text-primary font-headline text-2xl font-black tracking-tight">{promo.benefit}</span>
                  </div>
                  <Link
                    to="/reservar"
                    className="bg-primary text-on-primary px-8 py-3 rounded-xl font-headline font-black text-xs transition-all active:scale-95 hover:shadow-[0_0_30px_rgba(249,186,130,0.3)] uppercase tracking-widest"
                  >
                    Reserva Ya
                  </Link>
                </div>
              </div>
              {/* Promotion Icon Watermark */}
              <span className="absolute -right-8 -bottom-8 material-symbols-outlined text-[160px] text-secondary opacity-5 pointer-events-none rotate-12">{promo.icon}</span>
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-3 mt-6">
          {promos.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === activeSlide ? 'w-10 bg-primary' : 'w-4 bg-outline-variant/20'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Barbers */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Barberos Destacados</h2>
            <p className="text-on-surface-variant text-sm mt-1">Nuestros maestros artesanos</p>
          </div>
          <Link to="/reservar" className="text-secondary text-sm font-semibold hover:underline decoration-secondary/30 transition-all">
            Ver todos
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          {barbers.map((barber) => (
            <div key={barber.id} className="min-w-[160px] bg-surface-container rounded-xl overflow-hidden group flex-shrink-0">
              <div className="aspect-[3/4] overflow-hidden bg-surface-container-high flex items-center justify-center">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                />
              </div>
              <div className="p-4">
                <h4 className="font-headline font-bold text-on-surface">{barber.name}</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{barber.specialty}</p>
                <div className="flex items-center gap-1 mt-3">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold text-on-surface">{barber.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <Link
          to="/reservar"
          className="flex items-center bg-primary-container text-on-primary-container p-4 rounded-full shadow-2xl active:scale-95 transition-all duration-200 group"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 font-headline font-bold text-sm whitespace-nowrap">
            Agendar Cita
          </span>
        </Link>
      </div>
    </div>
  )
}
