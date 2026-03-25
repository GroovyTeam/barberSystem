import { pastAppointments, barbers } from '../../data/mockData'

export default function Perfil() {
  const totalSpent = pastAppointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0)

  return (
    <div className="px-6 max-w-2xl mx-auto py-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[100px] text-secondary opacity-5 pointer-events-none">person</span>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-4xl text-secondary">person</span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline font-black text-2xl text-on-surface">Carlos Méndez</h2>
            <p className="text-outline text-sm">carlos.mendez@email.com</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Cliente Frecuente</span>
            </div>
          </div>
          <button className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Visitas', value: pastAppointments.filter(a => a.status === 'completed').length + 2, icon: 'content_cut' },
          { label: 'Total Gastado', value: `$${totalSpent + 500}`, icon: 'payments' },
          { label: 'Barbero Fav.', value: 'Marco', icon: 'star' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-secondary text-xl mb-2 block">{stat.icon}</span>
            <p className="font-headline font-black text-on-surface text-lg leading-none">{stat.value}</p>
            <p className="text-outline text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info Sections */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-secondary text-xs uppercase tracking-[0.2em]">Información Personal</h3>
        {[
          { icon: 'person', label: 'Nombre', value: 'Carlos Méndez' },
          { icon: 'phone', label: 'Teléfono', value: '+52 55 1234 5678' },
          { icon: 'email', label: 'Correo', value: 'carlos.mendez@email.com' },
        ].map(field => (
          <div key={field.label} className="bg-surface-container rounded-xl p-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary">{field.icon}</span>
            <div className="flex-1">
              <p className="text-[10px] text-outline uppercase tracking-widest">{field.label}</p>
              <p className="text-on-surface font-medium text-sm">{field.value}</p>
            </div>
            <button className="text-outline hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-secondary text-xs uppercase tracking-[0.2em]">Cuenta</h3>
        {[
          { icon: 'lock', label: 'Cambiar contraseña' },
          { icon: 'receipt_long', label: 'Historial de pagos' },
          { icon: 'help_outline', label: 'Soporte' },
        ].map(item => (
          <button key={item.label} className="w-full bg-surface-container rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-secondary">{item.icon}</span>
            <span className="text-on-surface font-medium text-sm flex-1">{item.label}</span>
            <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <Link to="/login" className="w-full border border-error/20 hover:border-error/50 text-error py-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all">
        <span className="material-symbols-outlined text-lg">logout</span>
        Cerrar Sesión
      </Link>
    </div>
  )
}
