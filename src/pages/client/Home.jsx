import { Link } from 'react-router-dom'
import { barbers, services, upcomingAppointments } from '../../data/mockData'

export default function Home() {
  const nextAppt = upcomingAppointments[0]

  return (
    <div className="px-6 max-w-2xl mx-auto space-y-10 py-6">

      {/* Next Appointment Card */}
      {nextAppt && (
        <section>
          <div className="bg-surface-container rounded-xl p-5 relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-secondary opacity-5 pointer-events-none">event_available</span>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-secondary font-headline text-xs font-semibold tracking-widest uppercase mb-1">Próxima Cita</p>
                <h3 className="text-on-surface font-headline text-lg font-bold">{nextAppt.service}</h3>
              </div>
              <div className="bg-primary-container/20 px-3 py-1 rounded-full">
                <span className="text-primary text-xs font-bold">Mañana</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">schedule</span>
                <span>{nextAppt.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">person</span>
                <span>{nextAppt.barber}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Promo Banner */}
      <section className="relative">
        <div className="relative h-[220px] rounded-xl overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e] via-[#201f1f] to-[#131313]" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-8">
            <span className="text-secondary font-headline text-xs font-bold tracking-[0.2em] uppercase mb-2">Promoción Exclusiva</span>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface leading-tight mb-4 max-w-[200px]">
              Corte &amp; Barba Premium
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-black">15% Off</span>
              <Link
                to="/reservar"
                className="bg-primary-container hover:bg-primary text-on-primary-container px-5 py-2 rounded-md font-headline font-semibold text-sm transition-colors active:scale-95 duration-200 shadow-lg shadow-primary-container/20"
              >
                Reservar
              </Link>
            </div>
          </div>
          {/* Watermark scissors */}
          <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[120px] text-secondary opacity-5 pointer-events-none">content_cut</span>
        </div>
        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-8 h-1 rounded-full bg-primary" />
          <div className="w-2 h-1 rounded-full bg-outline-variant" />
          <div className="w-2 h-1 rounded-full bg-outline-variant" />
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

      {/* Services Grid */}
      <section>
        <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-6">Nuestros Servicios</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.slice(0, 4).map((service) => (
            <Link
              key={service.id}
              to="/servicios"
              className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">
                {service.icon}
              </span>
              <div>
                <p className="font-headline font-bold text-on-surface">{service.name}</p>
                <p className="text-xs text-on-surface-variant mt-1">${service.price} MXN</p>
              </div>
            </Link>
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
