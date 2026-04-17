import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBarbers } from '../../services/api'
import TopAppBar from '../../components/layout/TopAppBar'

export default function BarbersList() {
  const navigate = useNavigate()
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="font-headline font-black text-4xl text-on-surface leading-none uppercase tracking-tighter">
              Elige a tu <br /><span className="text-primary italic">Expert</span>
            </h1>
            <p className="text-outline text-[10px] font-black uppercase tracking-[0.2em] mt-3">Maestros de la Tradición</p>
          </div>
          
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-2xl border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all shadow-lg shadow-black/20"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Regresar
          </button>
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
                className="bg-surface-container rounded-2xl p-5 flex items-center gap-5 border-2 border-primary/20 hover:border-primary shadow-xl shadow-black/10 transition-all group cursor-pointer"
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
          <div className="bg-surface-container p-1 rounded-[2.5rem] max-w-sm w-full relative z-10 border-2 border-primary shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
            <div className="bg-surface-container-high rounded-[2.3rem] p-8 border border-primary/10">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-6 border-2 border-primary shadow-lg p-1">
                  <img src={selectedBarber.avatar} className="w-full h-full object-cover rounded-xl" />
                </div>
                <h2 className="font-headline font-black text-3xl text-on-surface italic uppercase tracking-tighter leading-none mb-2">{selectedBarber.name}</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">{selectedBarber.specialty}</p>
                
                <div className="bg-surface-container-highest p-6 rounded-3xl text-left border border-primary/5 mb-8">
                  <h4 className="text-[9px] uppercase font-black text-outline tracking-[0.2em] mb-4 border-b border-outline/10 pb-2">Habilidades Maestras</h4>
                  <p className="text-on-surface/90 text-sm leading-relaxed italic font-medium">
                    "{selectedBarber.bio || "Este experto barbero prefiere que su trabajo hable por él. Especialista en cortes de alta gama y diseño de barbas."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
