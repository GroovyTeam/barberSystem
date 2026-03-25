import { useState, useEffect } from 'react'
import { getBarbers, updateBarberAvailability } from '../../services/api'

export default function GestionBarberos() {
  const [barberList, setBarberList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBarbers()
  }, [])

  const loadBarbers = async () => {
    setLoading(true)
    const data = await getBarbers(true) // showAll = true
    setBarberList(data)
    setLoading(false)
  }

  const toggleAvailability = async (id, currentStatus) => {
    await updateBarberAvailability(id, !currentStatus)
    loadBarbers()
  }

  return (
    <div className="space-y-8 pt-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Gestión de Barberos</h2>
          <p className="text-outline text-sm"><span className="text-secondary font-bold">{barberList.length}</span> barberos registrados</p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Nuevo Barbero
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {loading && <p className="text-center text-outline col-span-full py-12">Cargando barberos...</p>}
        {barberList.map(barber => (
          <div key={barber.id} className="bg-surface-container rounded-2xl overflow-hidden flex group hover:bg-surface-container-high transition-colors">
            {/* Photo */}
            <div className="w-28 flex-shrink-0 overflow-hidden">
              <img
                src={barber.avatar}
                alt={barber.name}
                className={`w-full h-full object-cover transition-all duration-500 ${barber.isAvailable ? 'grayscale-0' : 'grayscale opacity-40'}`}
              />
            </div>
            {/* Info */}
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-headline font-bold text-on-surface text-lg ${!barber.isAvailable && 'opacity-50'}`}>{barber.name}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{barber.specialty}</p>
                </div>
                <button 
                  onClick={() => toggleAvailability(barber.id, barber.isAvailable)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all active:scale-90 ${barber.isAvailable ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${barber.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {barber.isAvailable ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-on-surface">{barber.rating}</span>
                <span className="text-xs text-outline">({barber.reviews} reseñas)</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 border border-outline/20 hover:border-secondary/40 text-outline hover:text-secondary py-2 rounded-md text-xs font-bold transition-all text-center">
                  Editar
                </button>
                <button className="flex-1 bg-secondary-container/30 hover:bg-secondary-container text-secondary py-2 rounded-md text-xs font-bold transition-all text-center">
                  Ver Agenda
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
