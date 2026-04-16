# Gemini Constitution & Project Guidelines

Este documento establece la "Constitución" para el agente de IA (Gemini) en el proyecto **Barberia Shop**. Define los estándares, flujos y objetivos que deben seguirse en cada interacción.

## 🎯 Objetivos del Proyecto
1. **Digitalización**: Automatizar la reserva de citas online para barberías.
2. **Multi-tenant**: Permitir que múltiples barberías operen de forma aislada en la misma plataforma.
3. **Experiencia Premium**: Mantener un diseño visual de alta calidad con una paleta de colores sofisticada (ej. Dorado #D4AF77).
4. **Seguridad**: Procesamiento de pagos seguro mediante Stripe y autenticación robusta.

## 🛠️ Stack Tecnológico Mandatorio
- **Frontend**: React (Vite)
- **Base de Datos**: Neon DB (PostgreSQL)
- **ORM**: Prisma
- **Estilos**: Tailwind CSS / Vanilla CSS (Rich Aesthetics)
- **Backend**: Node.js (Express)

## 📋 Reglas de Desarrollo
- **Consistencia**: Seguir siempre el stack tecnológico definido. No introducir nuevas librerías de base de datos o frameworks sin aprobación.
- **Aesthetics First**: Cada componente de UI debe sentirse premium. Usar gradientes, micro-animaciones y tipografía moderna (Google Fonts).
- **Control de Errores**: Cada error detectado debe ser documentado en `memory.md` para evitar su recurrencia.
- **SEO**: Implementar etiquetas meta, estructura de encabezados correcta y performance optimizada en cada página.

## 🚀 Flujo de Trabajo
- **Planificación**: Siempre realizar un análisis previo antes de cambios mayores.
- **Verificación**: Validar cambios mediante pruebas en el navegador o scripts de prueba.
- **Memoria**: Consultar `memory.md` antes de comenzar cualquier tarea para revisar lecciones pasadas.

---
*Este documento es la ley del proyecto para Gemini. Cualquier desviación debe ser justificada.*
