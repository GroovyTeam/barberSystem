import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { updateProfile, getCurrentUser, logout } from '../../services/api' 

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: 'Cargando...',
    lastName: '',
    email: 'cargando@email.com',
    phone: '',
    memberSince: '2024'
  })

  useEffect(() => {
    getCurrentUser().then(u => {
      if(u) {
         setProfileData({
           firstName: u.firstName,
           lastName: u.lastName,
           email: u.email,
           phone: u.phone || '',
           id: u.id,
           memberSince: new Date(u.createdAt).getFullYear().toString()
         })
      }
    })
  }, [])

  const totalSpent = 0 // En una versión futura se calculará sumando el historial de citas obtenido del API.

  // Handle form save
  const handleSave = async () => {
    // Validar teléfono: 10 dígitos numéricos
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(profileData.phone)) {
      alert("El teléfono debe contener exactamente 10 dígitos numéricos.")
      return
    }

    setIsSaving(true)
    try {
      const response = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email
      })
      if (response.success) {
        setIsEditing(false)
        alert("¡Perfil actualizado correctamente!")
      }
    } catch (error) {
      alert("Error al guardar perfil: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Si es teléfono, solo permitir números y máx 10
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '')
      if (onlyNums.length <= 10) {
        setProfileData(prev => ({ ...prev, [name]: onlyNums }))
      }
      return
    }
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="px-6 max-w-2xl mx-auto py-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[100px] text-secondary opacity-5 pointer-events-none">person</span>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center flex-shrink-0 relative group">
            <span className="material-symbols-outlined text-4xl text-secondary">person</span>
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                 <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 mb-1">
                <input 
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="font-headline font-bold text-lg text-on-surface bg-transparent border-b border-primary focus:outline-none w-1/2"
                />
                <input 
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  className="font-headline font-bold text-lg text-on-surface bg-transparent border-b border-primary focus:outline-none w-1/2"
                />
              </div>
            ) : (
              <h2 className="font-headline font-black text-2xl text-on-surface truncate">
                {profileData.firstName} {profileData.lastName}
              </h2>
            )}
            <p className="text-outline text-sm truncate">{profileData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Cliente Frecuente</span>
            </div>
          </div>
          
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`transition-colors p-2 rounded-full ${isEditing ? 'bg-primary-container text-on-primary-container hover:bg-primary' : 'text-secondary hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            {isSaving ? (
               <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
               <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Visitas', value: 2, icon: 'content_cut' },
          { label: 'Gastado', value: `$${totalSpent + 500}`, icon: 'payments' },
          { label: 'Barbero', value: 'Marco', icon: 'star' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-secondary text-xl mb-2 block">{stat.icon}</span>
            <p className="font-headline font-black text-on-surface text-lg leading-none">{stat.value}</p>
            <p className="text-outline text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info Sections */}
      <div className="space-y-3 relative">
        <h3 className="font-headline font-bold text-secondary text-xs uppercase tracking-[0.2em]">Información Personal</h3>
        
        {/* Name Field */}
        <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">person</span>
          <div className="flex-1">
            <p className="text-[10px] text-outline uppercase tracking-widest">Nombre Completo</p>
            {isEditing ? (
              <div className="flex gap-2 mt-1">
                <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} className="text-on-surface font-medium text-sm bg-surface-container-low border-b-2 border-primary focus:outline-none w-1/2 px-2 py-1 rounded-t" />
                <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} className="text-on-surface font-medium text-sm bg-surface-container-low border-b-2 border-primary focus:outline-none w-1/2 px-2 py-1 rounded-t" />
              </div>
            ) : (
              <p className="text-on-surface font-medium text-sm">{profileData.firstName} {profileData.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">phone</span>
          <div className="flex-1">
            <p className="text-[10px] text-outline uppercase tracking-widest">Teléfono</p>
            {isEditing ? (
              <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} className="text-on-surface font-medium text-sm bg-surface-container-low border-b-2 border-primary focus:outline-none w-full px-2 py-1 mt-1 rounded-t" />
            ) : (
              <p className="text-on-surface font-medium text-sm">{profileData.phone}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">email</span>
          <div className="flex-1">
            <p className="text-[10px] text-outline uppercase tracking-widest">Correo</p>
            {isEditing ? (
              <input type="email" name="email" value={profileData.email} onChange={handleChange} className="text-on-surface font-medium text-sm bg-surface-container-low border-b-2 border-primary focus:outline-none w-full px-2 py-1 mt-1 rounded-t" />
            ) : (
              <p className="text-on-surface font-medium text-sm">{profileData.email}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setIsEditing(false)} className="text-outline font-bold text-sm px-4 py-2 hover:text-on-surface">Cancelar</button>
            <button onClick={handleSave} className="bg-primary-container text-on-primary-container font-bold text-sm px-6 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2">
                {isSaving ? <span className="material-symbols-outlined text-sm animate-spin">refresh</span> : 'Guardar Cambios'}
            </button>
          </div>
        )}
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
      <button 
        onClick={async () => {
          await logout();
          window.location.href = '/login';
        }}
        className="w-full border border-error/20 hover:border-error/50 text-error py-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all"
      >
        <span className="material-symbols-outlined text-lg">logout</span>
        Cerrar Sesión
      </button>
    </div>
  )
}
