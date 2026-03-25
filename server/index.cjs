const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { PrismaClient } = require('../prisma/generated/client2')

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// RUTAS BÁSICAS DE PRUEBA Y FUNCIONADLIDAD
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de Black & Blade operando correctamente' })
})

// === BARBEROS ===
app.get('/api/barbers', async (req, res) => {
  try {
    const { all } = req.query
    const barbers = await prisma.barber.findMany({
      where: all === 'true' ? {} : { isAvailable: true }
    })
    res.json(barbers)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching barbers' })
  }
})

// Alternar disponibilidad
app.patch('/api/barbers/:id/availability', async (req, res) => {
  try {
    const { id } = req.params
    const { isAvailable } = req.body
    const updated = await prisma.barber.update({
      where: { id },
      data: { isAvailable }
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error updating availability' })
  }
})

// === SERVICIOS ===
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' })
  }
})

// === CITAS (Appointments) ===
// Crear una nueva cita
app.post('/api/appointments', async (req, res) => {
  try {
    const { clientId, barberId, serviceId, date, time, price } = req.body
    
    // Aquí podrías agregar validaciones de disponibilidad del barbero en esa hora.
    
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        barberId,
        serviceId,
        date: new Date(date), // Formato ISO completo
        time,
        price,
        status: 'PENDING'
      }
    })
    
    res.status(201).json({ success: true, appointment })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creating appointment' })
  }
})

// Obtener citas de un cliente
app.get('/api/appointments/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params
    const appointments = await prisma.appointment.findMany({
      where: { clientId },
      include: { barber: true, service: true },
      orderBy: { date: 'asc' }
    })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' })
  }
})

// === SEED ROUTE PARA DATOS INICIALES ===
app.get('/api/seed', async (req, res) => {
  try {
    const count = await prisma.service.count()
    if (count > 0) return res.json({ message: 'DB ya tiene datos.' })

    const b1 = await prisma.barber.create({ data: { name: 'Marco Silva', specialty: 'Master Barber', rating: 4.9, reviews: 124, avatar: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=200&auto=format&fit=crop' } })
    const b2 = await prisma.barber.create({ data: { name: 'Roberto V.', specialty: 'Bleach & Fade', rating: 4.8, reviews: 89, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' } })
    
    await prisma.service.create({ data: { name: 'Corte de cabello Clásico', description: 'Corte con tijera o máquina', price: 250, duration: 30, category: 'Hair', icon: 'content_cut' } })
    await prisma.service.create({ data: { name: 'Corte Premium & Fade', description: 'Degradado perfecto', price: 350, duration: 45, category: 'Hair', icon: 'content_cut' } })
    await prisma.service.create({ data: { name: 'Base Permanente', description: 'Ondulado permanente', price: 800, duration: 120, category: 'Hair', icon: 'waves' } })
    await prisma.service.create({ data: { name: 'Pintado de Cabello', description: 'Tinte completo o luces', price: 650, duration: 90, category: 'Hair', icon: 'format_color_fill' } })
    await prisma.service.create({ data: { name: 'Arreglo de Barba', description: 'Toalla caliente', price: 200, duration: 30, category: 'Beard', icon: 'face_retouching_natural' } })

    res.json({ message: 'Seed exitoso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error en seed' })
  }
})

// === Citas: Cancelar ===
app.put('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })
    res.json({ success: true, updated })
  } catch (err) {
    res.status(500).json({ error: 'Error cancelando cita' })
  }
})

// === Usuarios: Actualizar Perfil ===
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, email } = req.body
    
    // Si usas UUIDs reales puedes actualizar por ID, 
    // pero como el mock usa "user-id-123" que no existe en DB, 
    // para esta fase actualizaremos el primer usuario que haya.
    const userToUpdate = await prisma.user.findFirst()
    if (!userToUpdate) return res.status(404).json({ error: 'No users' })

    const updated = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { name, phone, email }
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error DB Update' })
  }
})

app.get('/api/users/current', async (req, res) => {
  const user = await prisma.user.findFirst()
  res.json(user)
})

// Start server
app.listen(port, () => {
  console.log(`💈 Servidor backend corriendo en http://localhost:${port}`)
})
