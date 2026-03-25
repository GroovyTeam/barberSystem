import { Outlet, NavLink } from 'react-router-dom'
import SideNavBar from '../components/layout/SideNavBar'

export default function AdminLayout() {
  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface flex">
      <SideNavBar />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Admin TopBar */}
        <header className="fixed top-0 right-0 left-64 z-30 flex justify-between items-center px-8 h-20 bg-[#131313]/70 backdrop-blur-xl border-b border-[#353534]/15">
          <div className="flex items-center gap-4 bg-[#1c1b1b] px-4 py-2 rounded-lg border-b-2 border-[#51443a]/30 focus-within:ring-1 focus-within:ring-[#8B5A2B]">
            <span className="material-symbols-outlined text-[#9e8e82] text-sm">search</span>
            <input
              className="bg-transparent border-none text-sm text-[#e5e2e1] focus:ring-0 w-64 outline-none placeholder:text-[#9e8e82]/40"
              placeholder="Buscar cliente o cita..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#9E8E82] hover:text-[#F9BA82] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#f9ba82] rounded-full" />
            </button>
            <div className="h-8 w-px bg-[#51443a]/20 mx-2" />
            <span className="text-sm font-bold text-[#e7c187] tracking-tight">BLACK &amp; BLADE</span>
          </div>
        </header>

        <main className="pt-20 px-10 pb-12 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
