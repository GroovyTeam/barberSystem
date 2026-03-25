import { useState } from 'react'
import { clients } from '../../data/mockData'

const TYPE_STYLES = {
  Platinum: 'bg-yellow-500/10 text-yellow-500',
  Frecuente: 'bg-primary/10 text-primary',
  Nuevo: 'bg-green-500/10 text-green-500',
  Nueva: 'bg-green-500/10 text-green-500',
}

export default function Clientes() {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Registro de Clientes</h2>
          <p className="text-outline text-sm">
            <span className="text-secondary font-bold">{clients.length}</span> clientes registrados en la plataforma
          </p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary-container/20">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4 border-b-2 border-outline-variant/30 focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o correo..."
          className="bg-transparent text-on-surface text-sm focus:outline-none flex-1 placeholder:text-outline/40"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-outline hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-outline uppercase text-[10px] tracking-[0.2em] font-bold border-b border-outline-variant/10">
                {['Cliente', 'Contacto', 'Visitas', 'Total Gastado', 'Última Visita', 'Tipo', ''].map((h, i) => (
                  <th key={i} className={`px-8 py-6 ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-surface-bright/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-secondary text-xs border border-outline-variant/20">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-sm font-bold text-on-surface">{client.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-on-surface-variant">{client.email}</p>
                    <p className="text-xs text-outline mt-0.5">{client.phone}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-on-surface">{client.visits}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-primary">${client.total.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-outline">
                      {new Date(client.lastVisit).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${TYPE_STYLES[client.type] || 'bg-outline/10 text-outline'}`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-outline hover:text-on-surface transition-colors p-1">
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-outline/30 mb-4 block">search_off</span>
            <p className="text-outline">No se encontraron clientes con esa búsqueda</p>
          </div>
        )}
        <div className="p-6 bg-surface-container-low flex justify-between items-center text-outline text-xs border-t border-outline-variant/5">
          <p>Mostrando {filtered.length} de {clients.length} clientes</p>
        </div>
      </div>
    </div>
  )
}
