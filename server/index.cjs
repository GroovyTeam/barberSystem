const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const { body, param, validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

dotenv.config()

const app = express()

// Prisma v7: Driver adapter directo a PostgreSQL (Neon DB via Prisma Postgres)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const port = process.env.PORT || 3000

// ═══════════════════════════════════════════════════════════════
// OWASP A05 — Security Misconfiguration: Helmet + CORS
// ═══════════════════════════════════════════════════════════════
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10kb' })) // Limitar tamaño de body
app.use(cookieParser())

// ═══════════════════════════════════════════════════════════════
// OWASP A07 — Auth Failures: Rate Limiting
// ═══════════════════════════════════════════════════════════════
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de login. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/', generalLimiter)
app.use('/api/auth/', authLimiter)

// ═══════════════════════════════════════════════════════════════
// OWASP A03 — Injection: Validation helper
// ═══════════════════════════════════════════════════════════════
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Datos inválidos', details: errors.array().map(e => e.msg) })
  }
  next()
}

// ═══════════════════════════════════════════════════════════════
// OWASP A01 — Broken Access Control: JWT Middleware
// ═══════════════════════════════════════════════════════════════
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Token requerido.' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' })
  }
}

// Middleware opcional: verifica token si existe, pero no bloquea
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch { /* Token inválido, continuar sin user */ }
  }
  next()
}

const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' })
  }
  next()
}

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK (público)
// ═══════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de Black & Blade operando correctamente' })
})

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES — OWASP A02 (Cryptographic) + A07 (Auth Failures)
// ═══════════════════════════════════════════════════════════════

// REGISTRO
app.post('/api/auth/register', [
  body('firstName').trim().escape().notEmpty().withMessage('Nombre requerido'),
  body('lastName').trim().escape().notEmpty().withMessage('Apellidos requeridos'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
  body('phone').optional().trim().escape()
], validate, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Este correo ya está registrado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    // OWASP A07: Cookie httpOnly + secure
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })

    res.status(201).json({
      success: true,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// LOGIN
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
], validate, async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// SOCIAL LOGIN (Google / Apple)
app.post('/api/auth/social-login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('provider').isIn(['google', 'apple']).withMessage('Proveedor no soportado')
], validate, async (req, res) => {
  try {
    const { email, firstName, lastName, provider } = req.body

    // Buscar si ya existe
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Crear usuario nuevo si no existe (Password aleatorio ya que es social)
      const randomPass = await bcrypt.hash(Math.random().toString(36), 12)
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: randomPass,
          role: 'CLIENT'
        }
      })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Social Login error:', error)
    res.status(500).json({ error: 'Error en inicio de sesión social' })
  }
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
  res.json({ success: true, message: 'Sesión cerrada.' })
})

// GET CURRENT USER (desde token)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, createdAt: true }
    })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    console.error('GetMe error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ═══════════════════════════════════════════════════════════════
// BARBEROS — Público para lectura, Admin para escritura
// ═══════════════════════════════════════════════════════════════
app.get('/api/barbers', async (req, res) => {
  try {
    const { all } = req.query
    const barbers = await prisma.barber.findMany({
      where: all === 'true' ? {} : { isAvailable: true }
    })
    res.json(barbers)
  } catch (error) {
    console.error('Barbers error:', error)
    res.status(500).json({ error: 'Error obteniendo barberos' })
  }
})

// Alternar disponibilidad (solo Admin)
app.patch('/api/barbers/:id/availability',
  authenticateToken,
  authorizeRole('ADMIN'),
  [
    param('id').isUUID().withMessage('ID inválido'),
    body('isAvailable').isBoolean().withMessage('isAvailable debe ser booleano')
  ],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params
      const { isAvailable } = req.body
      const updated = await prisma.barber.update({
        where: { id },
        data: { isAvailable }
      })
      res.json(updated)
    } catch (error) {
      console.error('Barber availability error:', error)
      res.status(500).json({ error: 'Error actualizando disponibilidad' })
    }
  }
)

// ═══════════════════════════════════════════════════════════════
// SERVICIOS — Público para lectura
// ═══════════════════════════════════════════════════════════════
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany()
    res.json(services)
  } catch (error) {
    console.error('Services error:', error)
    res.status(500).json({ error: 'Error obteniendo servicios' })
  }
})

// ═══════════════════════════════════════════════════════════════
// CITAS (Appointments) — Autenticado
// ═══════════════════════════════════════════════════════════════

// Crear cita (autenticado o walk-in con nombre)
app.post('/api/appointments',
  optionalAuth,
  [
    body('barberId').notEmpty().withMessage('Barbero requerido'),
    body('serviceId').notEmpty().withMessage('Servicio requerido'),
    body('date').isISO8601().withMessage('Fecha inválida'),
    body('time').matches(/^\d{2}:\d{2}$/).withMessage('Hora inválida (formato HH:MM)'),
    body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('clientName').optional().trim().escape()
  ],
  validate,
  async (req, res) => {
    try {
      const { clientName, barberId, serviceId, date, time, price, paymentMethod } = req.body

      let finalClientId = req.user?.id || null

      // Walk-in: crear usuario temporal si no hay auth
      if (!finalClientId && clientName) {
        const newUser = await prisma.user.create({
          data: {
            name: clientName,
            email: `walkin_${Date.now()}@blackblade.com`,
            password: await bcrypt.hash(`walkin_${Date.now()}`, 12), // OWASP A02: hash incluso para walk-ins
            role: 'CLIENT'
          }
        })
        finalClientId = newUser.id
      }

      if (!finalClientId) {
        return res.status(400).json({ error: 'Faltan datos del cliente. Inicia sesión o proporciona un nombre.' })
      }

      const appointment = await prisma.appointment.create({
        data: {
          clientId: finalClientId,
          barberId,
          serviceId,
          date: new Date(date),
          time,
          price,
          paymentMethod: paymentMethod || 'PRESENCIAL',
          status: 'PENDING'
        }
      })

      res.status(201).json({ success: true, appointment })
    } catch (error) {
      console.error('Create appointment error:', error)
      res.status(500).json({ error: 'Error creando cita' })
    }
  }
)

// Obtener todas las citas (solo Admin)
app.get('/api/appointments',
  authenticateToken,
  authorizeRole('ADMIN'),
  async (req, res) => {
    try {
      const appointments = await prisma.appointment.findMany({
        include: { client: { select: { id: true, name: true, email: true } }, barber: true, service: true },
        orderBy: { date: 'asc' }
      })
      res.json(appointments)
    } catch (error) {
      console.error('Get appointments error:', error)
      res.status(500).json({ error: 'Error obteniendo citas' })
    }
  }
)

// Obtener citas del usuario autenticado
app.get('/api/appointments/mine',
  authenticateToken,
  async (req, res) => {
    try {
      const appointments = await prisma.appointment.findMany({
        where: { clientId: req.user.id },
        include: { barber: true, service: true },
        orderBy: { date: 'asc' }
      })
      res.json(appointments)
    } catch (error) {
      console.error('My appointments error:', error)
      res.status(500).json({ error: 'Error obteniendo citas' })
    }
  }
)

// Obtener citas de un cliente específico (solo Admin)
app.get('/api/appointments/client/:clientId',
  authenticateToken,
  authorizeRole('ADMIN'),
  [param('clientId').isUUID().withMessage('ID de cliente inválido')],
  validate,
  async (req, res) => {
    try {
      const { clientId } = req.params
      const appointments = await prisma.appointment.findMany({
        where: { clientId },
        include: { barber: true, service: true },
        orderBy: { date: 'asc' }
      })
      res.json(appointments)
    } catch (error) {
      console.error('Client appointments error:', error)
      res.status(500).json({ error: 'Error obteniendo citas' })
    }
  }
)

// Cancelar cita
app.put('/api/appointments/:id/cancel',
  authenticateToken,
  [param('id').isUUID().withMessage('ID de cita inválido')],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params

      // OWASP A01: Verificar que la cita pertenece al usuario (o es admin)
      const appointment = await prisma.appointment.findUnique({ where: { id } })
      if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' })

      if (appointment.clientId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'No puedes cancelar citas de otro usuario.' })
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })
      res.json({ success: true, updated })
    } catch (err) {
      console.error('Cancel appointment error:', err)
      res.status(500).json({ error: 'Error cancelando cita' })
    }
  }
)

// ═══════════════════════════════════════════════════════════════
// DASHBOARD STATS — Solo Admin
// ═══════════════════════════════════════════════════════════════
app.get('/api/dashboard/stats',
  authenticateToken,
  authorizeRole('ADMIN'),
  async (req, res) => {
    try {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const [
        appointmentsToday,
        activeBarbers,
        newClientsToday,
        revenueTodayResult,
        recentAppointments,
        performanceData
      ] = await Promise.all([
        prisma.appointment.count({
          where: {
            date: { gte: startOfDay, lte: endOfDay },
            status: { not: 'CANCELLED' }
          }
        }),
        prisma.barber.count({
          where: { isAvailable: true }
        }),
        prisma.user.count({
          where: {
            role: 'CLIENT',
            createdAt: { gte: startOfDay, lte: endOfDay }
          }
        }),
        prisma.appointment.aggregate({
          where: {
            date: { gte: startOfDay, lte: endOfDay },
            status: { not: 'CANCELLED' }
          },
          _sum: { price: true }
        }),
        prisma.appointment.findMany({
          where: {
            date: { gte: startOfDay, lte: endOfDay },
            status: 'PENDING'
          },
          take: 5,
          orderBy: [{ date: 'asc' }, { time: 'asc' }],
          include: {
            client: { select: { name: true } },
            service: true,
            barber: true
          }
        }),
        prisma.appointment.groupBy({
          by: ['barberId'],
          _count: { id: true },
          _sum: { price: true },
          orderBy: { _count: { id: 'desc' } },
          take: 3
        })
      ])

      // Enriquecer datos de desempeño
      const enrichedPerformance = await Promise.all(performanceData.map(async (p) => {
        const barber = await prisma.barber.findUnique({ where: { id: p.barberId } })
        return {
          name: barber?.name || 'Unknown',
          appointments: p._count.id,
          revenue: p._sum.price || 0
        }
      }))

      res.json({
        appointmentsToday,
        activeBarbers,
        newClientsToday,
        revenueToday: revenueTodayResult._sum.price || 0,
        recentAppointments: recentAppointments.map(a => ({
          id: a.id,
          client: a.client.name,
          initials: a.client.name.split(' ').map(n => n[0]).join(''),
          clientType: 'Cliente Regular',
          service: a.service.name,
          barber: a.barber.name,
          time: a.time,
          status: a.status
        })),
        performance: enrichedPerformance
      })
    } catch (error) {
      console.error('Dashboard stats error:', error)
      res.status(500).json({ error: 'Error calculando estadísticas' })
    }
  }
)

// ═══════════════════════════════════════════════════════════════
// USUARIOS — Autenticado
// ═══════════════════════════════════════════════════════════════

// Actualizar perfil propio
app.put('/api/users/profile',
  authenticateToken,
  [
    body('name').optional().trim().escape().notEmpty().withMessage('Nombre no puede estar vacío'),
    body('phone').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido')
  ],
  validate,
  async (req, res) => {
    try {
      const { firstName, lastName, phone, email } = req.body

      // OWASP A01: Solo puede actualizar su propio perfil
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone !== undefined && { phone }),
          ...(email && { email })
        },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true }
      })

      res.json({ success: true, data: updated })
    } catch (err) {
      console.error('Update profile error:', err)
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Este correo ya está en uso.' })
      }
      res.status(500).json({ error: 'Error actualizando perfil' })
    }
  }
)

// Obtener usuario actual (legacy support)
app.get('/api/users/current', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    })
    res.json(user)
  } catch (err) {
    console.error('Current user error:', err)
    res.status(500).json({ error: 'Error obteniendo usuario' })
  }
})

// ═══════════════════════════════════════════════════════════════
// OWASP A05 — Seed route solo en desarrollo
// ═══════════════════════════════════════════════════════════════
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/seed', async (req, res) => {
    try {
      const count = await prisma.service.count()
      if (count > 0) return res.json({ message: 'DB ya tiene datos.' })

      // Crear Admin por defecto
      await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'Demo',
          email: 'admin@blackblade.com',
          phone: '12345678',
          password: await bcrypt.hash('Admin123!', 12),
          role: 'ADMIN'
        }
      })

      // Crear Cliente por defecto
      await prisma.user.create({
        data: {
          firstName: 'Cliente',
          lastName: 'Demo',
          email: 'cliente@demo.com',
          phone: '87654321',
          password: await bcrypt.hash('Cliente123!', 12),
          role: 'CLIENT'
        }
      })

      await prisma.barber.create({ data: { name: 'Marco Silva', specialty: 'Master Barber', rating: 4.9, reviews: 124, avatar: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=200&auto=format&fit=crop' } })
      await prisma.barber.create({ data: { name: 'Roberto V.', specialty: 'Bleach & Fade', rating: 4.8, reviews: 89, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' } })

      await prisma.service.create({ data: { name: 'Corte de cabello Clásico', description: 'Corte con tijera o máquina', price: 250, duration: 30, category: 'Hair', icon: 'content_cut' } })
      await prisma.service.create({ data: { name: 'Corte Premium & Fade', description: 'Degradado perfecto', price: 350, duration: 45, category: 'Hair', icon: 'content_cut' } })
      await prisma.service.create({ data: { name: 'Base Permanente', description: 'Ondulado permanente', price: 800, duration: 120, category: 'Hair', icon: 'waves' } })
      await prisma.service.create({ data: { name: 'Pintado de Cabello', description: 'Tinte completo o luces', price: 650, duration: 90, category: 'Hair', icon: 'format_color_fill' } })
      await prisma.service.create({ data: { name: 'Arreglo de Barba', description: 'Toalla caliente', price: 200, duration: 30, category: 'Beard', icon: 'face_retouching_natural' } })

      res.json({ message: 'Seed exitoso! Admin: admin@blackblade.com / Admin123!' })
    } catch (err) {
      console.error('Seed error:', err)
      res.status(500).json({ error: 'Error en seed' })
    }
  })
}

// ═══════════════════════════════════════════════════════════════
// OWASP A10 — Error Handler Centralizado
// Nunca exponer stack traces ni detalles internos al cliente
// ═══════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Start server
app.listen(port, () => {
  console.log(`💈 Servidor backend corriendo en http://localhost:${port}`)
  console.log(`🔒 Seguridad OWASP activa: Helmet, Rate Limiting, JWT, Bcrypt`)
  console.log(`🗄️  Base de datos: Neon DB (PostgreSQL) via Prisma v7`)
})
