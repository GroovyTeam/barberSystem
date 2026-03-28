import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/calendario', icon: 'calendar_today', label: 'Calendario' },
  { to: '/admin/barberos', icon: 'content_cut', label: 'Barberos' },
  { to: '/admin/clientes', icon: 'group', label: 'Clientes' },
  { to: '/admin/reportes', icon: 'assessment', label: 'Reportes' },
  { to: '/admin/servicios', icon: 'spa', label: 'Servicios' },
  { to: '/admin/configuracion', icon: 'settings', label: 'Configuración' },
]

export default function SideNavBar() {
  return (
    <aside className="flex flex-col fixed left-0 top-0 h-screen w-64 z-40 bg-[#131313] border-r border-[#353534]/20 shadow-2xl shadow-black/50 font-headline">
      {/* Brand */}
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter text-[#D4AF77] uppercase">
          Black &amp; Blade
        </h1>
        <p className="text-[10px] tracking-[0.2em] text-[#9e8e82] uppercase mt-1">
          Master Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 text-sm rounded-r-full transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B5A2B] to-[#D4AF77] text-[#FFDDC2] font-bold shadow-lg shadow-[#8B5A2B]/20'
                  : 'text-[#9E8E82] hover:bg-[#201F1F] hover:text-[#D4AF77]'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom profile */}
      <div className="p-6 border-t border-[#51443a]/20">
        <div className="flex items-center gap-3 p-3 bg-[#201f1f] rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5a2b] to-[#D4AF77] flex items-center justify-center text-[#ffddc2] font-black text-sm">
            BB
          </div>
          <div>
            <p className="text-xs font-bold text-[#e5e2e1]">Admin Profile</p>
            <p className="text-[10px] text-[#9e8e82]">Black &amp; Blade</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
