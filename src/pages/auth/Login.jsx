import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 leather-texture">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-12">
          <h1 className="font-headline font-black text-4xl text-primary uppercase tracking-tighter">Black &amp; Blade</h1>
          <p className="text-outline text-sm tracking-[0.2em] uppercase mt-2">Barbershop</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Bienvenido de vuelta</h2>
            <p className="text-outline text-sm mt-1">Inicia sesión para gestionar tus citas</p>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-secondary text-xs font-bold uppercase tracking-widest">Correo electrónico</label>
            <div className="bg-surface-container-low rounded-lg px-4 py-3 flex items-center gap-3 border-b-2 border-outline-variant/50 focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-outline text-sm">email</span>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="bg-transparent text-on-surface text-sm focus:outline-none flex-1 placeholder:text-outline/40"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-secondary text-xs font-bold uppercase tracking-widest">Contraseña</label>
            <div className="bg-surface-container-low rounded-lg px-4 py-3 flex items-center gap-3 border-b-2 border-outline-variant/50 focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-outline text-sm">lock</span>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent text-on-surface text-sm focus:outline-none flex-1 placeholder:text-outline/40"
              />
              <button className="text-outline hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-sm">visibility</span>
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button className="text-secondary text-xs hover:underline">¿Olvidaste tu contraseña?</button>
          </div>

          {/* Login Button */}
          <Link
            to="/"
            className="block w-full bg-primary-container hover:bg-primary text-on-primary-container text-center py-4 rounded-xl font-headline font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
          >
            Iniciar Sesión
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/20" />
            <span className="text-outline text-xs">o</span>
            <div className="flex-1 h-px bg-outline-variant/20" />
          </div>

          {/* Register */}
          <p className="text-center text-outline text-sm">
            ¿No tienes cuenta?{' '}
            <button className="text-secondary font-bold hover:underline">Regístrate</button>
          </p>

          {/* Admin demo link */}
          <div className="pt-4 border-t border-outline-variant/10 text-center">
            <Link to="/admin" className="text-xs text-outline hover:text-secondary transition-colors">
              → Acceder como Administrador (demo)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
