# Claude Constitution & Project Guidelines

Este documento establece la "Constitución" para el agente de IA (Claude) en el proyecto **Barberia Shop — Black & Blade**. Define los estándares, flujos, objetivos y principios de seguridad que deben seguirse en cada interacción.

---

## 🎯 Objetivos del Proyecto

1. **Digitalización**: Automatizar la reserva de citas online para barberías, eliminando la necesidad de llamadas o visitas presenciales.
2. **Multi-tenant**: Permitir que múltiples barberías operen de forma aislada en la misma plataforma, con datos, configuración y pagos independientes.
3. **Experiencia Premium**: Mantener un diseño visual de alta calidad con paleta sofisticada (Dorado `#D4AF77`, superficies oscuras `#131313`, tipografía Epilogue + Inter).
4. **Seguridad**: Procesamiento de pagos seguro mediante Stripe, autenticación robusta con JWT, y cumplimiento de OWASP Top 10.
5. **Escalabilidad**: Arquitectura preparada para crecer de MVP a plataforma SaaS completa.

---

## 🛠️ Stack Tecnológico Mandatorio

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 (Vite 5) |
| **Estilos** | Tailwind CSS 3.4 + Vanilla CSS (Rich Aesthetics) |
| **Tipografía** | Google Fonts: Epilogue (headlines), Inter (body/labels) |
| **Iconografía** | Material Symbols Outlined |
| **Backend** | Node.js + Express 5 |
| **ORM** | Prisma 5 |
| **Base de Datos** | Neon DB (PostgreSQL) — *Actualmente en SQLite para desarrollo local* |
| **Pagos** | Stripe (integración pendiente) |
| **Autenticación** | JWT (implementación pendiente) |
| **UI Components** | Radix UI (Dialog, Popover) |
| **Routing** | React Router DOM v6 |

> ⚠️ **No introducir** nuevas librerías de base de datos, ORMs, o frameworks sin aprobación explícita del usuario.

---

## 📐 Arquitectura Actual del Proyecto

```
barberiaShop/
├── src/                        # Frontend React
│   ├── App.jsx                 # Router principal (Client + Admin)
│   ├── main.jsx                # Entry point
│   ├── index.css               # Estilos globales + Tailwind
│   ├── components/layout/      # BottomNavBar, SideNavBar, TopAppBar
│   ├── context/                # ThemeContext
│   ├── data/mockData.js        # Datos mock (fallback)
│   ├── layouts/                # ClientLayout, AdminLayout
│   ├── pages/
│   │   ├── client/             # Home, Servicios, ReservaCita, MisCitas, Perfil
│   │   ├── admin/              # Dashboard, Calendario, Clientes, Reportes, etc.
│   │   └── auth/               # Login
│   └── services/api.js         # Capa de conexión al backend
├── server/index.cjs            # Backend Express (API REST)
├── prisma/
│   ├── schema.prisma           # Modelos: User, Barber, Service, Appointment
│   ├── seed.js                 # Seed de datos iniciales
│   └── generated/client3/      # Cliente Prisma generado
├── scripts/                    # Scripts auxiliares (seed_today)
├── claudeplaning/              # Documentación de planeación
│   └── planeacion.md           # Plan maestro del proyecto
├── claude.md                   # 📜 ESTE ARCHIVO — Constitución del agente
└── memory.md                   # 🧠 Bitácora de aprendizaje
```

---

## 📊 Features Implementadas vs Pendientes

### ✅ Implementado
- **Cliente**: Home con servicios, flujo completo de reserva (servicio → barbero → fecha → hora → confirmación), Mis Citas con cancelación, Perfil editable
- **Admin**: Dashboard con stats en tiempo real, Calendario, Gestión de Clientes, Reportes, Gestión de Servicios, Gestión de Barberos, Configuración
- **Backend**: API REST completa (CRUD de citas, barberos, servicios, usuarios, stats del dashboard)
- **BD**: Schema Prisma con 4 modelos (User, Barber, Service, Appointment)
- **UI**: Diseño premium dark mode, paleta dorada, tipografía moderna, navegación client/admin separada
- **Walk-in**: Soporte para citas rápidas sin cuenta de cliente

### 🔲 Pendiente (según planeación)
- **Autenticación real**: JWT, registro, login funcional, recuperación de contraseña
- **Stripe**: Integración de pagos
- **Multi-tenant**: Aislamiento por barbería, onboarding de nuevas barberías
- **Migración BD**: De SQLite → Neon DB (PostgreSQL)
- **Roles diferenciados**: Barbero vs Admin vs Super Admin
- **Notificaciones**: Email de confirmación/cancelación
- **Reportes avanzados**: Gráficas, exportación PDF/Excel
- **Switch de sistema**: Activar/desactivar reservas temporalmente

---

## 🔐 Principios de Seguridad — OWASP Top 10

Toda corrección y feature nueva debe respetar los 10 principios de OWASP:

| # | Principio | Aplicación en el Proyecto |
|---|---|---|
| A01 | **Broken Access Control** | Implementar middleware de autorización por rol (Client/Barber/Admin). No exponer rutas admin sin autenticación. |
| A02 | **Cryptographic Failures** | Hashear contraseñas (bcrypt). Usar HTTPS en producción. No almacenar secretos en código fuente. |
| A03 | **Injection** | Usar Prisma (ORM) que parametriza queries automáticamente. Validar/sanitizar inputs en servidor. |
| A04 | **Insecure Design** | Diseñar con separación de concerns (API ↔ Frontend). Principio de mínimo privilegio por rol. |
| A05 | **Security Misconfiguration** | Desactivar CORS abierto en producción. Configurar headers de seguridad. Eliminar rutas seed en producción. |
| A06 | **Vulnerable Components** | Auditar dependencias regularmente (`npm audit`). Mantener Prisma, Express y React actualizados. |
| A07 | **Auth Failures** | JWT con expiración, refresh tokens, rate limiting en login. No almacenar tokens en localStorage sin protección. |
| A08 | **Data Integrity Failures** | Validar datos tanto en frontend como backend. No confiar en datos del cliente sin verificación servidor. |
| A09 | **Logging & Monitoring** | Registrar eventos de seguridad (intentos de login fallidos, accesos no autorizados). |
| A10 | **SSRF** | No permitir que el usuario controle URLs internas. Validar cualquier URL externa procesada por el servidor. |

---

## 📋 Reglas de Desarrollo

- **Consistencia**: Seguir siempre el stack tecnológico definido arriba. Cero excepciones sin aprobación.
- **Aesthetics First**: Cada componente de UI debe sentirse premium. Usar gradientes (`btn-gold`), micro-animaciones, tipografía Epilogue/Inter, paleta dorada `#D4AF77`.
- **Control de Errores**: Cada error detectado debe ser documentado en `memory.md` para evitar su recurrencia.
- **SEO**: Implementar etiquetas meta, estructura de encabezados correcta y performance optimizada en cada página.
- **Código Limpio**: Funciones descriptivas, componentes reutilizables, separación clara entre lógica y presentación.
- **Seguridad por defecto**: Aplicar principios OWASP en cada endpoint y cada formulario.

---

## 🚀 Flujo de Trabajo

1. **Consultar Memoria**: Antes de cualquier tarea, revisar `memory.md` para evitar repetir errores pasados.
2. **Planificación**: Analizar impacto antes de cambios mayores. Documentar decisiones en planeación.
3. **Ejecución**: Seguir el stack mandatorio. Escribir código bajo los principios OWASP.
4. **Verificación**: Validar cambios mediante pruebas en navegador o scripts de prueba.
5. **Documentación**: Actualizar `memory.md` con cada corrección, error o lección aprendida.

---

*Este documento es la ley del proyecto para Claude. Cualquier desviación debe ser justificada y aprobada por el usuario.*
