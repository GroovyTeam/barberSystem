import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/home', icon: 'home', label: 'Inicio', exact: true },
  { to: '/reservar', icon: 'event_note', label: 'Reservar' },
  { to: '/mis-citas', icon: 'calendar_month', label: 'Mis Citas' },
  { to: '/perfil', icon: 'person', label: 'Perfil' },
]

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#131313]/90 backdrop-blur-xl border-t border-[#353534]/20 shadow-[0_-4px_24px_rgba(249,186,130,0.06)]">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'text-[#D4AF77] scale-110'
                  : 'text-[#9E8E82] opacity-60 hover:opacity-100 active:scale-90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-[#D4AF77]' : 'text-[#9E8E82]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
