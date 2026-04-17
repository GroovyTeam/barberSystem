# Memory Log — Barberia Shop (Black & Blade)

Este archivo es una bitácora de aprendizaje autoescrita por **Claude** para documentar errores, correcciones y lecciones aprendidas durante el desarrollo del proyecto. Su propósito es evitar la repetición de errores y aprender de cada sesión.

---

## 📓 Registro de Aprendizaje

### 2026-04-16 — Sesión 1 (Gemini)
- **Incidente**: Error `Cannot find module '.prisma/client/default'`.
- **Causa**: El archivo `schema.prisma` tiene una ruta de salida personalizada (`output = "./generated/client3"`) que puede causar que los paquetes que esperan al cliente en la ubicación por defecto no lo encuentren si no se importa correctamente. Además, se detectó que el provider actual es `sqlite` mientras que el stack mandatorio es `Neon DB (PostgreSQL)`.
- **Corrección**: Se recomienda normalizar el `output` del generador Prisma o asegurar que los imports apunten a la ruta correcta. Pendiente migrar el datasource a PostgreSQL para cumplir con la Constitución.
- **Lección**: Siempre revisar la configuración del generador Prisma y el datasource antes de realizar operaciones de base de datos.

---

### 2026-04-16 — Sesión 2 (Claude) — Transición de Agente
- **Incidente**: Error de permisos en Git — `Rename from 'master.lock' to 'master' failed`.
- **Causa**: El directorio `.git/` fue creado con permisos de `BUILTIN\Administradores` como propietario. El usuario `antonio` (grupo Usuarios) solo tenía permisos `RX,W` — sin permiso de Delete/Rename, lo cual es necesario para que Git renombre archivos `.lock` durante commits.
- **Corrección**: Se otorgó `Full Control (F)` recursivo al usuario `antonio` sobre `.git/` usando `icacls` como Administrador elevado.
- **Lección**: Cuando un repositorio Git se crea o clona desde una terminal con privilegios elevados (Admin), los permisos NTFS pueden no coincidir con el usuario que trabaja normalmente. Siempre verificar permisos con `icacls` si Git falla con errores de rename/lock.

---

### 2026-04-16 — Sesión 2 (Claude) — Migración de Constitución
- **Acción**: Se renombró `Gemini.md` → `claude.md` al cambiar de agente IA.
- **Cambios en `claude.md`**:
  - Identidad actualizada de Gemini a Claude.
  - Se agregó sección completa de arquitectura del proyecto con árbol de directorios.
  - Se agregó tabla de **Features Implementadas vs Pendientes** basada en análisis del código fuente.
  - Se incorporaron los **10 principios OWASP** con aplicación específica al proyecto.
  - Se documentó el stack tecnológico completo con versiones.
- **Lección**: Mantener la constitución del agente siempre sincronizada con el agente IA actual en uso. Documentar el estado real del proyecto (no solo aspiraciones) para evitar decisiones desinformadas.

---

### Observaciones del Análisis Inicial del Proyecto
- **Ruta de Prisma output personalizada**: `./generated/client3` — no convencional, puede causar errores de import. El server usa `require('../prisma/generated/client3')` que funciona pero es frágil.
- **SQLite en uso**: El schema usa `provider = "sqlite"` con `file:./dev.db`, pero la constitución manda `Neon DB (PostgreSQL)`. Migración pendiente.
- **Contraseñas en texto plano**: El seed crea usuarios con `password: 'password123'` sin hash. Violación de OWASP A02.
- **CORS abierto**: `app.use(cors())` sin restricciones. Aceptable en desarrollo, pero debe configurarse en producción. Violación de OWASP A05.
- **Ruta `/api/seed` expuesta**: Cualquiera puede ejecutar el seed via GET request. Debe protegerse o eliminarse en producción. Violación de OWASP A05. ✅ RESUELTO — ahora solo en `NODE_ENV !== 'production'`.
- **Sin autenticación**: No hay middleware de auth en ninguna ruta del backend. Violación de OWASP A01. ✅ RESUELTO — JWT + role middleware implementado.
- **Mock data duplicado**: `src/data/mockData.js` contiene datos que ya existen en la BD via seed. Posible fuente de inconsistencias.
- **Archivo `.env`**: Contiene credenciales de BD local (prisma+postgres). No está en `.gitignore` correctamente para producción con Neon DB.

---

### 2026-04-16 — Sesión 2 (Claude) — Implementación OWASP + Migración Neon DB

#### Incidente 1: Prisma v5 → v7 Breaking Changes
- **Causa**: `prisma.config.ts` fue generado por `neonctl init` para Prisma v7 (`import from 'prisma/config'`), pero el proyecto usaba Prisma v5.22 donde ese módulo no existe.
- **Corrección**: Actualizar `prisma` y `@prisma/client` a v7.7.0 con `npm install prisma@latest @prisma/client@latest`.
- **Lección**: Antes de correr CLI tools de Prisma, **siempre verificar** que la versión local coincida con la versión que el CLI espera. Usar `npx prisma --version` para confirmar.

#### Incidente 2: Prisma v7 — `schema.prisma` ya no acepta `url` en datasource
- **Causa**: En Prisma v7, la URL de conexión se mueve a `prisma.config.ts`, no en el schema. El schema solo declara el `provider`.
- **Corrección**: Eliminar `url = "file:./dev.db"` del schema, cambiar provider a `"postgresql"`, y eliminar `output = "./generated/client3"` del generator.
- **Lección**: En Prisma v7, el schema es declarativo (qué BD usar), el config es operacional (cómo conectar).

#### Incidente 3: `PrismaClient` necesita options en v7
- **Causa**: `new PrismaClient()` sin argumentos ya no funciona en v7. Requiere `adapter` o `accelerateUrl`.
- **Intentos fallidos**:
  1. `accelerateUrl` con `postgres://` → Error: debe empezar con `prisma://` o `prisma+postgres://`
  2. `accelerateUrl` con `prisma+postgres://` → Error: API key inválida
- **Corrección final**: Usar `@prisma/adapter-pg` con `pg.Pool` para conexión directa a PostgreSQL.
- **Lección**: Para Prisma Postgres (db.prisma.io), el adapter `@prisma/adapter-pg` con pool `pg` es el enfoque más simple y confiable en Prisma v7.

#### Incidente 4: `Connection terminated unexpectedly` en dashboard
- **Causa**: El pool de `pg` sin configuración SSL ni límite de conexiones causaba drops al hacer múltiples queries concurrentes (`Promise.all`) contra Neon DB remoto.
- **Corrección**: Configurar `ssl: { rejectUnauthorized: false }` y `max: 10` en el pool.
- **Lección**: Conexiones a BD remotas en la nube **siempre** necesitan SSL y configuración de pool adecuada.

#### OWASP Implementado ✅
| OWASP | Medida | Paquete |
|---|---|---|
| A01 | JWT auth middleware + role authorization | `jsonwebtoken` |
| A02 | Bcrypt password hashing (salt=12) | `bcrypt` |
| A03 | Input validation/sanitization | `express-validator` |
| A05 | Helmet + CORS restrictivo + seed solo en dev | `helmet` |
| A07 | Rate limiting (10 req/15min en auth) + httpOnly cookies | `express-rate-limit`, `cookie-parser` |
| A10 | Error handler centralizado (no stack traces al cliente) | Built-in |

#### Credenciales de Seed
- **Admin**: admin@blackblade.com / Admin123! (rol ADMIN)
- **Cliente**: cliente@demo.com / Cliente123! (rol CLIENT)

### 2026-04-16 — Sesión 3 (Gemini) — Blindaje de Secretos y Consolidación

#### Incidente 5: Riesgo de Exposición de API Keys
- **Causa**: Durante la migración a Neon DB, se generaron archivos de configuración (`prisma.config.ts`) y variables de entorno que contienen credenciales sensibles.
- **Corrección**: Se verificó que `.env` esté estrictamente en `.gitignore`. Se configuró `prisma.config.ts` para que extraiga la URL de las variables de entorno y no de texto plano.
- **Lección**: **NUNCA** hardcodear credenciales en archivos `.ts` o `.js` que sean rastreados por Git. El uso de `process.env` es obligatorio para cumplir con OWASP.

#### Cambio de Identidad: De Claude a Gemini
- **Nota**: El asistente ha transicionado a **Gemini**. Se mantiene la misma Constitución (`claude.md` se mantiene como referencia de reglas, pero el agente firma como Gemini).
- **Compromiso**: Seguir documentando cada error técnico en este archivo para evitar redundancia y mejorar la eficiencia en la resolución de problemas.

---

### Resumen de Estado de Seguridad (Post-Corrección)
1. **Credenciales**: Ocultas en `.env` (Protegidas por `.gitignore`).
2. **Base de Datos**: Neon DB conectada exitosamente mediante `@prisma/adapter-pg`.
3. **Autenticación**: JWT implementado con `httpOnly` cookies (OWASP A07).
4. **Hashing**: Bcrypt activo para todas las contraseñas en la base de datos (OWASP A02).

### 2026-04-16 — Sesión 4 (Gemini) — Sincronización de Esquema y Datos

#### Incidente 6: Error al añadir columnas obligatorias (firstName/lastName)
- **Causa**: Al añadir campos obligatorios a una tabla con datos existentes, Prisma falla porque no tiene valores para las filas viejas.
- **Corrección**: Se utilizó `npx prisma migrate reset --force` para limpiar la base de datos y aplicar el esquema desde cero.
- **Lección**: En etapas tempranas de desarrollo, el `reset` es la vía más rápida para cambios estructurales profundos.

#### Incidente 7: Prisma Client desactualizado
- **Causa**: El seed fallaba indicando que faltaba el campo `name`, a pesar de que ya había sido borrado del esquema.
- **Corrección**: Se ejecutó `npx prisma generate` para reconstruir los tipos de TypeScript/JavaScript del cliente.
- **Lección**: **Siempre** correr `generate` después de cualquier cambio en `schema.prisma` antes de intentar usar la base de datos.

#### Incidente 8: Conflictos de ESM en Scripts de Herramientas
- **Causa**: `seed.js` fallaba con `require is not defined` debido a `"type": "module"` en `package.json`.
- **Corrección**: Se renombró el archivo a `seed.cjs` para forzar el modo CommonJS y permitir el uso de `require` para dependencias como `bcrypt` y `pg`.
- **Lección**: Usar la extensión `.cjs` para scripts de utilidad que dependan de librerías CommonJS en proyectos ESM.

---

### 🔌 Información de Acceso
- **Frontend**: Port 5173 (`npm run dev`)
- **Backend**: Port 3000 (`node server/index.cjs`)
- **Acceso Directo**: http://localhost:5173

#### Incidente 9: Iconos no visibles en Admin
- **Causa**: Algunos navegadores requieren explícitamente `font-feature-settings: 'liga'` para renderizar los Material Symbols correctamente como iconos en lugar de texto plano.
- **Corrección**: Se añadió la propiedad al archivo `index.css` global.
- **Lección**: Asegurar siempre las ligaduras de fuente cuando se usen iconos basados en texto (ligatures).

#### Mejora de Experiencia de Usuario: Welcome Page (Gatekeeper)
- **Cambio**: Se implementó una página raíz (`/`) que permite al usuario seleccionar su rol antes de entrar.
- **Motivo**: Para despliegue en producción, se requiere un punto de entrada unificado que distinga entre la experiencia de negocio (Admin) y la de usuario (Cliente).
- **Rutas Actualizadas**:
  *   `/` -> Selector de Rol (Welcome).
  *   `/home` -> Inicio Cliente.
  *   `/admin` -> Panel Administrador.

---

### 🔑 Acceso al Proyecto (Actualizado)
- **Frontend**: http://localhost:5173 (Página de bienvenida).
- **Entrada Cliente**: Botón "Soy Cliente" -> `/home`.
- **Entrada Admin**: Botón "Soy Admin" -> `/admin`.

#### Incidente 11: Pantalla Blanca (SyntaxError de Exportación)
- **Causa**: Se renombró la función `updateUserProfile` a `updateProfile` en `api.js`, pero no se actualizaron las importaciones en `Perfil.jsx`. Esto causó un error fatal durante el empaquetado de Vite.
- **Corrección**: Se estandarizó el nombre a `updateProfile` en todo el proyecto.
- **Lección**: Siempre usar herramientas de búsqueda global (`grep`) después de renombrar funciones en la capa de servicios para asegurar la integridad de las importaciones.

#### Incidente 12: Bloqueo de Renderizado (Backend Offline)
- **Causa**: El frontend intentaba realizar peticiones críticas durante el montaje de componentes (en `useEffect`) mientras el backend estaba apagado, lo que en algunos entornos causaba que la app no montara correctamente.
- **Corrección**: Se implementaron bloques `try/catch` y validaciones de datos (`Array.isArray`) en el `Home.jsx` y se reactivó el proceso del servidor. Además, se añadió un **ErrorBoundary** en `App.jsx` para evitar pantallas blancas.
- **Lección**: Nunca confiar en que los datos del backend llegarán siempre; blindar los componentes con estados iniciales vacíos (`[]` o `null`) y validaciones rigurosas.

#### Mejora Técnica: Estabilidad y Carga
- **Lazy Loading**: Se implementó `React.lazy` para cargar las páginas solo cuando se necesitan. Esto reduce el peso del paquete inicial y evita que un error en una página "mate" a las demás.
- **Error Boundary**: Se añadió un capturador de errores global que muestra un mensaje descriptivo en lugar de una pantalla blanca si un componente falla.

#### Nuevas Reglas de Negocio Implementadas
1. **Regla de las 2 Horas**: Las citas solo pueden cancelarse con al menos 2 horas de antelación. Validado en backend y reflejado en el frontend con modales premium.
2. **Cita Express**: Acceso directo desde el Home que salta pasos de selección mediante parámetros de URL (`?service=X&barber=Y`).
#### Incidente 13: Incoherencia en Notificaciones (UX Fail)
- **Causa**: Se implementó una notificación "Toast" que usaba el mismo icono de éxito (check) tanto para mensajes de confirmación como para errores de red.
- **Corrección**: Se introdujo el estado `toastType` para dinamizar iconos (`check_circle` vs `error`) y colores (`primary` vs `error`) según el resultado de la operación.
- **Lección**: Nunca usar componentes estáticos para resultados dinámicos. La semántica visual (colores e iconos) debe coincidir estrictamente con el mensaje de texto para evitar desconfianza en el usuario.

#### Incidente 14: Fallo de Lectura en Backend (req.body vacío)
- **Causa**: Las peticiones de actualización de perfil fallaban porque faltaba el middleware `express.json()` en el servidor, impidiendo que el backend leyera los datos del frontend.
- **Corrección**: Se activaron `express.json()` y `express.urlencoded()` al inicio de `server/index.cjs`.
- **Lección**: El procesamiento de JSON es la base de la comunicación moderna entre cliente y servidor. Siempre verificar su presencia antes de depurar lógica de base de datos.
