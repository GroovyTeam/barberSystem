import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-6">
      <div className="text-center mb-16">
        <h1 className="font-headline font-black text-6xl text-[#D4AF77] uppercase tracking-tighter">
          Black & Blade
        </h1>
        <p className="text-gray-400 text-lg tracking-[0.4em] uppercase mt-4">
          The Premium Experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link 
          to="/home" 
          className="bg-[#1a1a1a] p-10 rounded-3xl border border-white/5 text-center hover:bg-[#D4AF77] transition-all group"
        >
          <h2 className="font-headline font-black text-3xl text-white group-hover:text-black uppercase">
            Soy Cliente
          </h2>
          <p className="text-gray-500 text-sm mt-4 group-hover:text-black/80">
            Reserva tu cita y elige a tu barbero.
          </p>
        </Link>

        <Link 
          to="/admin" 
          className="bg-[#1a1a1a] p-10 rounded-3xl border border-white/5 text-center hover:bg-white transition-all group"
        >
          <h2 className="font-headline font-black text-3xl text-white group-hover:text-black uppercase">
            Soy Admin
          </h2>
          <p className="text-gray-500 text-sm mt-4 group-hover:text-black/80">
            Gestiona tu negocio y horarios.
          </p>
        </Link>
      </div>
    </div>
  )
}
