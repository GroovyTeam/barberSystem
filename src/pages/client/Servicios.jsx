import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../services/api'

const categories = ['Todos', 'Hair', 'Beard'] // Updated to match Prisma enums

export default function Servicios() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [expanded, setExpanded] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    getServices().then(setServices)
  }, [])

  const filtered = services.filter(s =>
    activeCategory === 'Todos' ? true : s.category === activeCategory
  )

  return (
    <div className="px-6 max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-secondary font-headline text-xs font-bold tracking-[0.2em] uppercase block mb-2">Catálogo</span>
        <h1 className="font-headline font-extrabold text-4xl leading-tight tracking-tighter text-on-surface">
          Nuestros <span className="text-secondary italic">Servicios</span>
        </h1>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                : 'bg-surface-container text-outline hover:text-on-surface'
            }`}
          >
            {cat === 'Hair' ? 'Corte' : cat === 'Beard' ? 'Barba' : cat}
          </button>
        ))}
      </div>

        {/* Service Drawer List */}
        <div className="space-y-3">
          {services.length === 0 && <p className="text-outline text-center py-8">Cargando servicios...</p>}
        {filtered.map(service => (
          <div key={service.id} className="overflow-hidden">
            {/* Closed State */}
            <button
              onClick={() => setExpanded(expanded === service.id ? null : service.id)}
              className="w-full bg-surface-container rounded-lg p-5 flex items-center gap-4 hover:bg-surface-container-high transition-colors group text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary text-xl">{service.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface">{service.name}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  <span className="text-primary font-bold">${service.price}</span>
                  <span className="mx-2">·</span>
                  <span>{service.duration} min</span>
                </p>
              </div>
              <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${expanded === service.id ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Expanded Drawer */}
            {expanded === service.id && (
              <div className="bg-surface-bright mx-2 rounded-b-lg p-5 -mt-1 animate-in slide-in-from-top-2 duration-200">
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-outline">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm">schedule</span>
                      {service.duration} minutos
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm">payments</span>
                      ${service.price} MXN
                    </span>
                  </div>
                  <Link
                    to="/reservar"
                    state={{ serviceId: service.id }}
                    className="bg-primary-container hover:bg-primary text-on-primary-container px-5 py-2 rounded-md font-headline font-bold text-sm transition-colors"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
