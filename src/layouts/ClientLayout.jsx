import { Outlet } from 'react-router-dom'
import TopAppBar from '../components/layout/TopAppBar'
import BottomNavBar from '../components/layout/BottomNavBar'

export default function ClientLayout() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <TopAppBar />
      <main className="pt-[73px] pb-24">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  )
}
