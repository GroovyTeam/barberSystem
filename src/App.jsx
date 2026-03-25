import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'

// Client pages
import Home from './pages/client/Home'
import Servicios from './pages/client/Servicios'
import ReservaCita from './pages/client/ReservaCita'
import MisCitas from './pages/client/MisCitas'
import Perfil from './pages/client/Perfil'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import Calendario from './pages/admin/Calendario'
import Clientes from './pages/admin/Clientes'
import Reportes from './pages/admin/Reportes'
import GestionServicios from './pages/admin/GestionServicios'
import GestionBarberos from './pages/admin/GestionBarberos'
import Configuracion from './pages/admin/Configuracion'

// Auth
import Login from './pages/auth/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reservar" element={<ReservaCita />} />
          <Route path="/mis-citas" element={<MisCitas />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="servicios" element={<GestionServicios />} />
          <Route path="barberos" element={<GestionBarberos />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
