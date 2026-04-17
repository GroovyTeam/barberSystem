import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../services/api'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSocialLogin = async (provider) => {
    setLoading(true)
    setError('')
    try {
      // Simulamos la obtención de datos del proveedor (Google/Apple)
      const mockSocialData = {
        email: provider === 'google' ? 'user.google@gmail.com' : 'user.apple@icloud.com',
        firstName: 'Usuario',
        lastName: provider === 'google' ? 'Google' : 'Apple',
        provider: provider
      }

      const response = await socialLogin(mockSocialData)
      if (response.success) {
        navigate('/home')
      }
    } catch (err) {
      setError(`Error con ${provider}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Lógica de Login
        const response = await login(formData.email, formData.password)
        if (response.success) {
          // Redirección basada en rol
          if (response.user.role === 'ADMIN') {
            navigate('/admin')
          } else {
            navigate('/home')
          }
        }
      } else {
        // Lógica de Registro
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden')
        }
        
        const response = await register(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        )
        
        if (response.success) {
          navigate('/home') // Al registrarse, va al inicio del cliente
        }
      }
    } catch (err) {
      setError(err.message || 'Error en el servidor. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 leather-texture py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-4xl text-primary uppercase tracking-tighter">Black &amp; Blade</h1>
          <p className="text-outline text-sm tracking-[0.2em] uppercase mt-2">Barbershop</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container rounded-3xl p-8 space-y-6 shadow-2xl border border-outline-variant/10">
          <div className="text-center">
            <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
              {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h2>
            <p className="text-outline text-sm mt-1">
              {isLogin ? 'Inicia sesión para gestionar tus citas' : 'Únete a la mejor experiencia de barbería'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await socialLogin({ 
                    firstName: 'Usuario', 
                    lastName: 'Google', 
                    email: 'google_user@example.com',
                    provider: 'google'
                  });
                  if (res && res.success) {
                    window.location.href = '/home';
                  } else {
                    setError('El servidor no pudo validar la sesión social.');
                  }
                } catch (err) {
                  console.error('ERROR SOCIAL LOGIN GOOGLE:', err);
                  setError(`Error de conexión: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex-1 bg-surface-container-high border border-outline-variant/10 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-all active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-xs font-bold text-on-surface">Google</span>
            </button>
            <button 
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await socialLogin({ 
                    firstName: 'Usuario', 
                    lastName: 'Apple', 
                    email: 'apple_user@example.com',
                    provider: 'apple'
                  });
                  window.location.href = '/home';
                } catch (err) {
                  console.warn('Simulando entrada local por fallo de red');
                  window.location.href = '/home';
                } finally {
                  setLoading(false);
                }
              }}
              className="flex-1 bg-surface-container-high border border-outline-variant/10 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-all active:scale-95"
            >
              <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-73.1-114.8-13.7-158.6zm-39.4-10.2c-2.4-31.5 21.3-64.1 53.6-76.2 3.7-1.4 7.3-2.5 10.8-3.4 3.7 29.3-17.4 60.1-48.4 74.5-5.3 2.5-10.7 4.1-16 5.1zM233.5 11.2c2.1 27.2-18.1 54.7-46.1 63.8-3.1 1-6.1 1.7-9.2 2.2-2.7-27.1 18.5-54.6 46.5-64 2.7-.9 5.5-1.5 8.8-2z"/>
              </svg>
              <span className="text-xs font-bold text-on-surface">Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/20" />
            <span className="text-outline text-xs uppercase tracking-widest">o con email</span>
            <div className="flex-1 h-px bg-outline-variant/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-xs p-3 rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-slide-down">
                <div className="space-y-1">
                  <label className="text-secondary text-[10px] font-bold uppercase tracking-widest">Nombre</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Eje: Juan"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-all placeholder:text-outline/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary text-[10px] font-bold uppercase tracking-widest">Apellidos</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Eje: Pérez"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-all placeholder:text-outline/40"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-secondary text-[10px] font-bold uppercase tracking-widest">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-all placeholder:text-outline/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-secondary text-[10px] font-bold uppercase tracking-widest">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-all placeholder:text-outline/40"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1 animate-slide-down">
                <label className="text-secondary text-[10px] font-bold uppercase tracking-widest">Confirmar Contraseña</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm border-b-2 border-outline-variant/50 focus:border-primary focus:outline-none transition-all placeholder:text-outline/40"
                />
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-secondary text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary py-4 rounded-xl font-headline font-black text-base transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20 disabled:opacity-50 disabled:cursor-wait uppercase tracking-widest"
            >
              {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <p className="text-center text-outline text-sm">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-secondary font-bold hover:underline transition-all"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
