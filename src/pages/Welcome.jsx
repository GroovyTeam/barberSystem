import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 leather-texture">
      {/* Brand Header */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="font-headline font-black text-6xl text-primary uppercase tracking-tighter leading-none">
          Black &amp; Blade
        </h1>
        <p className="text-outline text-lg tracking-[0.4em] uppercase mt-4">
          The Premium Experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Client Option */}
        <Link 
          to="/home" 
          className="group relative bg-surface-container-high hover:bg-primary-container p-10 rounded-3xl border border-outline-variant/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
        >
          <div className="relative z-10">
            <span className="material-symbols-outlined text-5xl text-primary mb-6 group-hover:text-on-primary-container transition-colors">
              person
            </span>
            <h2 className="font-headline font-black text-3xl text-on-surface group-hover:text-on-primary-container uppercase tracking-tight">
              Soy Cliente
            </h2>
            <p className="text-outline text-sm mt-4 group-hover:text-on-primary-container/80 leading-relaxed">
              Reserva tu cita, elige a tu barbero favorito y descubre nuestras promociones exclusivas.
            </p>
          </div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[180px] text-outline/5 rotate-12 group-hover:text-on-primary-container/5 transition-all">
            calendar_month
          </span>
        </Link>

        {/* Admin Option */}
        <Link 
          to="/admin" 
          className="group relative bg-surface-container-high hover:bg-secondary-container p-10 rounded-3xl border border-outline-variant/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/20"
        >
          <div className="relative z-10">
            <span className="material-symbols-outlined text-5xl text-secondary mb-6 group-hover:text-on-secondary-container transition-colors">
              content_cut
            </span>
            <h2 className="font-headline font-black text-3xl text-on-surface group-hover:text-on-secondary-container uppercase tracking-tight">
              Soy Admin
            </h2>
            <p className="text-outline text-sm mt-4 group-hover:text-on-secondary-container/80 leading-relaxed">
              Gestiona tu negocio, revisa estadísticas en vivo, controla horarios y servicios de barbería.
            </p>
          </div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[180px] text-outline/5 rotate-12 group-hover:text-on-secondary-container/5 transition-all">
            dashboard
          </span>
        </Link>
      </div>

      <div className="mt-16 text-outline/40 text-xs font-bold uppercase tracking-widest">
        Establecido 2024 — Calidad y Tradición
      </div>
    </div>
  )
}
