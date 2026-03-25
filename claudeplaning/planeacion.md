# Planeación del Proyecto: Sistema de Reserva de Citas para Barbería

## Descripción General del Proyecto

El sistema es una **plataforma web multi-barbería de reservas de citas online**, que permite a los clientes agendar servicios de forma sencilla y a los administradores gestionar su negocio de manera eficiente.

El sistema contempla dos tipos de acceso principales:

- **Cliente**: Reserva citas, realiza pagos, consulta historial y gestiona su perfil.
- **Administrador / Barbero**: Gestiona citas, clientes, servicios y reportes financieros.

---

## 🎯 Objetivos del Proyecto

1. Digitalizar el proceso de reserva de citas en barberías.
2. Ofrecer una experiencia intuitiva para el cliente sin necesidad de llamar o ir en persona.
3. Proveer al administrador herramientas de gestión y análisis del rendimiento del negocio.
4. Permitir la incorporación de nuevas barberías al sistema de forma ordenada.
5. Procesar pagos de forma segura mediante Stripe.
6. Soportar múltiples barberías desde una sola plataforma (multi-tenant).

---

## 👤 Vista del Cliente

### 1. Página de Inicio / Selección de Servicio
- Presentación de los servicios disponibles (corte, barba, combo, etc.) con imagen, nombre y precio.
- Botón de acción para iniciar la reserva.
- Acceso al login/registro desde el encabezado.

### 2. Flujo de Reserva de Cita
- **Paso 1**: Selección de servicio.
- **Paso 2**: Selección de barbero con disponibilidad visible (foto, nombre, calificación).
- **Paso 3**: Selección de fecha y hora mediante un calendario interactivo que muestra únicamente los horarios disponibles.
- **Paso 4**: Pago del servicio mediante **Stripe** (tarjeta de crédito/débito).
- **Paso 5**: Confirmación de la cita con resumen detallado (servicio, barbero, fecha, hora, precio, comprobante de pago).
- **Paso 6**: Notificación de confirmación vía correo electrónico.

### 3. Mis Citas
- Lista de citas **próximas** y **pasadas**.
- Estado de cada cita: *Confirmada*, *Completada*, *Cancelada*.
- Comprobante de pago por cita.
- Opción para cancelar o reagendar una cita (con límite de tiempo configurable).

### 4. Mi Perfil
- Visualización y edición de datos personales (nombre, teléfono, correo, foto).
- Historial completo de servicios tomados.
- Historial de pagos realizados.
- Cambio de contraseña.

---

## 🛠️ Vista del Administrador / Barbero

> Los barberos tienen acceso al panel de administrador con permisos enfocados en la gestión de citas, evitando confusiones en la agenda.

### 5. Dashboard Principal
- Resumen del día: total de citas, citas completadas, citas canceladas, ingresos del día.
- Citas por barbero en tiempo real (tarjetas individuales por barbero con su agenda del día).
- **Switch de activación/desactivación del sistema de reservas**: El administrador puede activar o desactivar el sistema de citas en cualquier momento (por ejemplo, en días festivos, vacaciones o cierre temporal del negocio).
- Cuando está **desactivado**, los clientes verán un mensaje personalizable indicando que las reservas no están disponibles temporalmente.
- El administrador puede programar una fecha de reactivación automática (opcional).
- Acceso rápido a las secciones del sistema.

### 6. Gestión de Barberos
- Alta, baja y edición de barberos (nombre, foto, especialidad, horario de trabajo).
- Visualización de carga de trabajo de cada barbero.
- Asignación de rol: *Administrador* o *Barbero*.

### 7. Vista de Calendario
- Calendario mensual con todas las citas reservadas.
- Filtros por barbero, servicio o estado de cita.
- Vista diaria, semanal y mensual.
- Indicadores de color por estado (confirmada, completada, cancelada).

### 8. Registro de Clientes
- Listado completo de clientes registrados.
- Búsqueda por nombre, teléfono o correo.
- Detalle de cada cliente: historial de citas, gasto total, frecuencia de visitas.

### 9. Reportes Financieros
- **Vista mensual**: Ingresos del mes en curso, comparativa con mes anterior.
- **Vista semestral**: Resumen de ingresos por los últimos 6 meses con gráfica de barras.
- **Vista anual**: Ingresos totales del año con desglose por mes y por barbero.
- **Métricas adicionales**:
  - Servicio más solicitado.
  - Barbero con más ingresos generados.
  - Tasa de cancelaciones.
  - Horas pico de reservas.
- Exportación de reportes a PDF o Excel.

### 10. Gestión de Servicios
- Alta, baja y edición de servicios (nombre, descripción, precio, duración estimada).

---

## 💳 Pagos con Stripe

- Integración oficial con **Stripe** para procesamiento de pagos.
- El cliente paga al momento de confirmar la cita (pago por adelantado).
- Soporte para tarjeta de crédito y débito.
- Generación automática de comprobante/recibo por cada transacción.
- Panel de pagos en el administrador vinculado a Stripe Dashboard.
- Política de reembolsos configurable en caso de cancelación.

---

## 🏢 Registro de Nueva Barbería (Onboarding Multi-Barbería)

Para barberías que no están en el sistema:

1. Formulario de registro con: nombre del negocio, dirección, teléfono, correo de contacto.
2. Registro del dueño/administrador principal.
3. Configuración inicial: servicios ofrecidos, horario de atención, número de sillas/barberos.
4. Conexión de cuenta Stripe del negocio para recibir pagos.
5. Aprobación del registro (manual o automática según configuración del sistema).
6. Acceso al panel de administración una vez aprobado.

Cada barbería opera de forma **aislada** dentro de la plataforma: sus clientes, citas, barberos y reportes son independientes de las demás.

---

## 🔐 Autenticación y Roles

| Rol | Acceso |
|---|---|
| **Cliente** | Reserva citas, realiza pagos, ve historial y edita perfil |
| **Barbero** | Acceso al panel de administrador: ve citas del día, calendario y agenda propia |
| **Administrador** | Acceso completo: citas, clientes, barberos, servicios, reportes y pagos |
| **Super Admin** | Gestión de todas las barberías registradas en la plataforma |

- Inicio de sesión con correo y contraseña.
- Recuperación de contraseña por correo.
- JWT para manejo de sesiones seguras.

---

## 📊 Módulo de Gráficas y Rendimiento

- Gráfica de línea: evolución de citas a lo largo del mes/año.
- Gráfica de barras: comparativa de ingresos por barbero.
- Gráfica de pastel: distribución de servicios más solicitados.
- Indicadores KPI con variación respecto al periodo anterior (↑ ↓).

---

## 📱 Consideraciones de UX/UI

- Diseño **responsive** (móvil, tablet y escritorio).
- Interfaz limpia e intuitiva orientada a usuarios sin experiencia técnica.
- Paleta de colores y branding adaptable por barbería.
- Accesibilidad básica (contraste, tamaño de fuente, navegación por teclado).

---

## 🚀 Fases de Desarrollo

### Fase 1 — MVP
- [ ] Registro e inicio de sesión de clientes.
- [ ] Flujo de reserva de cita (servicio → barbero → fecha/hora → pago Stripe).
- [ ] Vista "Mis Citas" para el cliente.
- [ ] Dashboard básico del administrador (citas del día por barbero).
- [ ] Registro manual de barbería (onboarding).

### Fase 2 — Gestión Avanzada
- [ ] Vista de calendario mensual con filtros.
- [ ] Módulo de gestión de clientes.
- [ ] Gestión de barberos y servicios.
- [ ] Perfil del cliente completo con historial de pagos.
- [ ] Roles diferenciados: Barbero vs. Administrador.

### Fase 3 — Reportes y Analíticas
- [ ] Módulo completo de reportes financieros (mensual, semestral, anual).
- [ ] Gráficas de rendimiento y KPIs.
- [ ] Exportación de reportes a PDF o Excel.

### Fase 4 — Escalabilidad Multi-Barbería
- [ ] Soporte completo multi-tenant (barberías aisladas).
- [ ] Super Admin con panel de gestión de todas las barberías.
- [ ] Notificaciones por correo al confirmar/cancelar cita.
- [ ] Conexión individual de Stripe por barbería.
