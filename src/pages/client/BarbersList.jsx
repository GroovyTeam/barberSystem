import { useState, useEffect } from 'react'
import { getBarbers } from '../../services/api'
import TopAppBar from '../../components/layout/TopAppBar'

export default function BarbersList() {
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBarber, setSelectedBarber] = useState(null)

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers(true) // true para traer todos
        setBarbers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBarbers()
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar title="Nuestros Barberos" showBack />
      
      <main className="flex-1 px-6 py-6">
        <div className="mb-8">
          <h1 className="font-headline font-black text-3xl text-on-surface leading-tight">
            Elige a tu <span className="text-primary italic">Expert</span>
          </h1>
          <p className="text-outline text-sm mt-2">Maestros del detalle y la tradición.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {barbers.map((barber) => (
              <div 
                key={barber.id} 
                onClick={() => setSelectedBarber(barber)}
                className="bg-surface-container rounded-2xl p-4 flex items-center gap-5 border border-primary/5 hover:border-primary/20 transition-all group cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high relative flex-shrink-0">
                  <img 
                    src={barber.avatar || 'https://images.unsplash.com/photo-1621605815841-28d645d37953?q=80&w=200&auto=format&fit=crop'} 
                    alt={barber.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-lg text-on-surface truncate">
                    {barber.name}
                  </h3>
                  <p className="text-secondary font-medium text-xs uppercase tracking-widest mt-0.5">
                    {barber.specialty}
                  </p>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`material-symbols-outlined text-sm ${i < Math.floor(barber.rating || 5) ? 'text-primary fill-1' : 'text-outline opacity-30'}`}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-[10px] text-outline font-bold ml-1">
                      {barber.rating || '5.0'}
                    </span>
                  </div>
                </div>

                {/* Action Arrow */}
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                  arrow_forward_ios
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bio Modal */}
      {selectedBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBarber(null)} />
          <div className="bg-surface-container rounded-3xl p-8 max-w-sm w-full relative z-10 border border-primary/20 shadow-2xl">
            <button 
              onClick={() => setSelectedBarber(null)}
              className="absolute right-4 top-4 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 border-2 border-primary/20 p-1">
                <img src={selectedBarber.avatar} className="w-full h-full object-cover rounded-xl" />
              </div>
              <h2 className="font-headline font-black text-2xl text-on-surface">{selectedBarber.name}</h2>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">{selectedBarber.specialty}</p>
              
              <div className="bg-surface-container-low p-6 rounded-2xl text-left border border-primary/5">
                <h4 className="text-[10px] uppercase font-black text-outline tracking-widest mb-3">Biografía & Habilidades</h4>
                <p className="text-on-surface text-sm leading-relaxed italic">
                  {selectedBarber.bio || "Este experto barbero prefiere que su trabajo hable por él. Especialista en cortes clásicos y modernos."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
