import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const presetColors = {
  surface: ['#131313', '#0A192F', '#1F1B24', '#0D1117', '#1B141A'], // Black, Navy Blue, Deep Purple, GitHub Dark, Dark Magenta
  primary: ['#F9BA82', '#64FFDA', '#BB86FC', '#58A6FF', '#FF79C6']  // Gold, Teal, Purple, Light Blue, Pink
}

export default function Configuracion() {
  const { theme, updateTheme, resetTheme } = useTheme()
  const [bgInput, setBgInput] = useState(theme.bgImage || '')

  const handleApplyImage = () => {
    updateTheme({ bgImage: bgInput })
  }

  return (
    <div className="space-y-8 pt-8">
      <div>
        <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Configuración del Portal</h2>
        <p className="text-outline text-sm">Personaliza la experiencia visual y los parámetros del sistema (Tema, Colores, Imágenes).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Aspecto Visual */}
        <div className="bg-surface-container rounded-2xl p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-secondary text-2xl">palette</span>
            <h3 className="font-headline font-bold text-xl text-on-surface">Apariencia</h3>
          </div>

          {/* Superficie / Fondo */}
          <div>
            <label className="text-secondary text-xs font-bold uppercase tracking-widest block mb-3">Color de Fondo Principal</label>
            <div className="flex flex-wrap gap-4">
              {presetColors.surface.map(color => (
                <button
                  key={color}
                  onClick={() => updateTheme({ surface: color })}
                  className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${theme.surface === color ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-outline/30'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-outline/30 flex items-center justify-center bg-surface-container-high transition-transform hover:scale-110">
                 <input 
                  type="color" 
                  value={theme.surface} 
                  onChange={(e) => updateTheme({ surface: e.target.value })}
                  className="absolute opacity-0 w-20 h-20 cursor-pointer"
                />
                <span className="material-symbols-outlined text-outline text-sm pointer-events-none">colorize</span>
              </div>
            </div>
          </div>

          {/* Color Primario */}
          <div>
            <label className="text-secondary text-xs font-bold uppercase tracking-widest block mb-3">Color Primario (Acentos)</label>
            <div className="flex flex-wrap gap-4">
              {presetColors.primary.map(color => (
                <button
                  key={color}
                  onClick={() => updateTheme({ primary: color })}
                  className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${theme.primary === color ? 'border-surface ring-4 ring-primary/40 scale-110' : 'border-outline/30'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-outline/30 flex items-center justify-center bg-surface-container-high transition-transform hover:scale-110">
                 <input 
                  type="color" 
                  value={theme.primary} 
                  onChange={(e) => updateTheme({ primary: e.target.value })}
                  className="absolute opacity-0 w-20 h-20 cursor-pointer"
                />
                <span className="material-symbols-outlined text-outline text-sm pointer-events-none">colorize</span>
              </div>
            </div>
          </div>

          {/* Imagen de Fondo */}
          <div>
            <label className="text-secondary text-xs font-bold uppercase tracking-widest block mb-3">URL de Imagen de Fondo (Opcional)</label>
            <div className="flex items-center gap-2">
              <div className="bg-surface-container-low rounded-lg px-4 py-3 border-b-2 border-outline-variant/40 focus-within:border-primary transition-colors flex-1">
                <input
                  type="url"
                  placeholder="https://ejemplo.com/fondo.jpg"
                  value={bgInput}
                  onChange={(e) => setBgInput(e.target.value)}
                  className="bg-transparent text-on-surface text-sm focus:outline-none w-full placeholder:text-outline/40"
                />
              </div>
              <button 
                onClick={handleApplyImage}
                className="bg-primary-container text-on-primary-container hover:bg-primary px-4 py-3 rounded-lg font-bold text-sm transition-colors"
                title="Aplicar Imagen"
              >
                Aplicar
              </button>
            </div>
            {theme.bgImage && (
              <p className="text-[10px] text-green-500 mt-2 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> Imagen activa
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-outline-variant/20">
             <button 
                onClick={() => { resetTheme(); setBgInput(''); }}
                className="text-error hover:bg-error/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors w-full flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Restaurar Diseño Original (Black & Blade)
              </button>
          </div>
        </div>

        {/* API Credentials Placeholder */}
        <div className="bg-surface-container rounded-2xl p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-secondary text-2xl">api</span>
            <h3 className="font-headline font-bold text-xl text-on-surface">Credenciales API</h3>
          </div>

          <p className="text-sm text-outline-variant leading-relaxed">
            Las credenciales de configuración de bases de datos (Firebase, Supabase) o pasarelas de pago (Stripe) se gestionan directamente a través del archivo de variables de entorno (<code className="bg-surface text-primary px-1 rounded">.env</code>) y en <code className="bg-surface text-primary px-1 rounded">src/services/api.js</code> por seguridad.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-outline-variant/20 relative opacity-60">
               <label className="text-secondary text-[10px] uppercase font-bold tracking-widest block mb-1">Stripe Public Key</label>
               <div className="font-mono text-sm text-on-surface">pk_test_************************</div>
               <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            </div>
            <div className="p-4 rounded-xl border border-outline-variant/20 relative opacity-60">
               <label className="text-secondary text-[10px] uppercase font-bold tracking-widest block mb-1">Database API URL</label>
               <div className="font-mono text-sm text-on-surface">https://api.supabase.co/rest/v1/...</div>
               <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            </div>
          </div>
          
          <div className="bg-primary-container/10 p-4 rounded-lg flex gap-3 text-sm">
             <span className="material-symbols-outlined text-primary">info</span>
             <p className="text-on-surface-variant font-medium">Revisa la documentación del proyecto para insertar las claves de producción del backend.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
