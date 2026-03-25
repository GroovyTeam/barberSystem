import { useState } from 'react'
import { services } from '../../data/mockData'

export default function GestionServicios() {
  const [items, setItems] = useState(services)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-8 pt-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Gestión de Servicios</h2>
          <p className="text-outline text-sm"><span className="text-secondary font-bold">{items.length}</span> servicios activos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancelar' : 'Nuevo Servicio'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-container rounded-2xl p-8 space-y-6">
          <h3 className="font-headline font-bold text-xl text-on-surface">Nuevo Servicio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Nombre del Servicio', 'Precio (MXN)', 'Duración (min)', 'Categoría'].map(label => (
              <div key={label} className="space-y-1">
                <label className="text-secondary text-xs font-bold uppercase tracking-widest">{label}</label>
                <div className="bg-surface-container-low rounded-lg px-4 py-3 border-b-2 border-outline-variant/40 focus-within:border-primary transition-colors">
                  <input
                    type="text"
                    placeholder={label}
                    className="bg-transparent text-on-surface text-sm focus:outline-none w-full placeholder:text-outline/40"
                  />
                </div>
              </div>
            ))}
            <div className="md:col-span-2 space-y-1">
              <label className="text-secondary text-xs font-bold uppercase tracking-widest">Descripción</label>
              <div className="bg-surface-container-low rounded-lg px-4 py-3 border-b-2 border-outline-variant/40 focus-within:border-primary transition-colors">
                <textarea rows={2} className="bg-transparent text-on-surface text-sm focus:outline-none w-full placeholder:text-outline/40 resize-none" placeholder="Descripción del servicio..." />
              </div>
            </div>
          </div>
          <button className="bg-primary-container hover:bg-primary text-on-primary-container px-8 py-3 rounded-md font-bold text-sm transition-colors">
            Guardar Servicio
          </button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(service => (
          <div key={service.id} className="bg-surface-container rounded-xl p-6 relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-secondary/5 pointer-events-none">{service.icon}</span>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-xl">{service.icon}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-outline hover:text-secondary transition-colors p-1">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button className="text-outline hover:text-error transition-colors p-1">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
            <h3 className="font-headline font-bold text-on-surface mb-1">{service.name}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{service.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-primary font-headline font-black text-xl">${service.price}</span>
              <div className="flex items-center gap-1 text-xs text-outline">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {service.duration} min
              </div>
            </div>
            <div className="mt-3">
              <span className="bg-surface-container-high text-outline text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">{service.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
