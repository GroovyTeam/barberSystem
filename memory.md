# Memory Log - Barberia Shop

Este archivo es una bitácora de aprendizaje autoescrita por Gemini para documentar errores, correcciones y lecciones aprendidas durante el desarrollo del proyecto.

## 📓 Registro de Aprendizaje

### 2026-04-16
- **Incidente**: Error `Cannot find module '.prisma/client/default'`.
- **Causa**: El archivo `schema.prisma` tiene una ruta de salida personalizada (`output = "./generated/client3"`) que puede causar que los paquetes que esperan al cliente en la ubicación por defecto no lo encuentren si no se importa correctamente. Además, se detectó que el provider actual es `sqlite` mientras que el stack mandatorio es `Neon DB (PostgreSQL)`.
- **Corrección**: Se recomienda normalizar el `output` del generador Prisma o asegurar que los imports apunten a la ruta correcta. Pendiente migrar el datasource a PostgreSQL para cumplir con la Constitución.
- **Lección**: Siempre revisar la configuración del generador Prisma y el datasource antes de realizar operaciones de base de datos.

---
*Este log debe actualizarse después de cada sesión de corrección importante.*
