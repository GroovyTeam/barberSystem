import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Componente para capturar errores fatales
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#131313', color: 'white', minHeight: '100vh' }}>
          <h1 style={{ color: '#D4AF77' }}>Error de Aplicación</h1>
          <p>Lo sentimos, un componente ha fallado.</p>
          <pre style={{ background: '#1a1a1a', padding: '1rem', color: '#ff4444' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.href = '/'} style={{ background: '#D4AF77', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            Reintentar Inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Carga perezosa de componentes (Lazy Loading)
const Welcome = lazy(() => import('./pages/Welcome'))
const Login = lazy(() => import('./pages/auth/Login'))
const ClientLayout = lazy(() => import('./layouts/ClientLayout'))
const Home = lazy(() => import('./pages/client/Home'))
const Servicios = lazy(() => import('./pages/client/Servicios'))
const ReservaCita = lazy(() => import('./pages/client/ReservaCita'))
const MisCitas = lazy(() => import('./pages/client/MisCitas'))
const Perfil = lazy(() => import('./pages/client/Perfil'))

// Admin (Lazy)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div style={{ background: '#131313', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Black & Blade...</div>}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ClientLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/reservar" element={<ReservaCita />} />
              <Route path="/mis-citas" element={<MisCitas />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
