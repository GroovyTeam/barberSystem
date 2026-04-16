const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')
const bcrypt = require('bcrypt')
require('dotenv').config()

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('💈 Iniciando carga de datos (Gemini Seed)...')

  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()
  await prisma.barber.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'admin@blackblade.com',
      password: adminPassword,
      phone: '+52 55 0000 0000',
      role: 'ADMIN'
    }
  })

  const clientPassword = await bcrypt.hash('Cliente123!', 12)
  const user = await prisma.user.create({
    data: {
      firstName: 'Carlos',
      lastName: 'Méndez',
      email: 'cliente@demo.com',
      password: clientPassword,
      phone: '+52 55 1234 5678',
      role: 'CLIENT'
    }
  })

  const barber1 = await prisma.barber.create({
    data: {
      name: 'Marco Silva',
      specialty: 'Master Barber',
      avatar: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=200&auto=format&fit=crop',
      rating: 4.9,
      reviews: 124
    }
  })

  const barber2 = await prisma.barber.create({
    data: {
      name: 'Roberto V.',
      specialty: 'Beard Specialist',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
      rating: 4.8,
      reviews: 89
    }
  })

  const service1 = await prisma.service.create({
    data: {
      name: 'Corte Black & Blade',
      description: 'Corte premium con lavado y asesoría',
      price: 350,
      duration: 45,
      category: 'hair',
      icon: 'content_cut'
    }
  })

  const service2 = await prisma.service.create({
    data: {
      name: 'Arreglo de Barba',
      description: 'Toalla caliente, aceite y perfilado fino',
      price: 250,
      duration: 30,
      category: 'beard',
      icon: 'face_retouching_natural'
    }
  })

  await prisma.appointment.create({
    data: {
      clientId: user.id,
      barberId: barber1.id,
      serviceId: service1.id,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '14:00',
      price: 350,
      status: 'PENDING'
    }
  })

  console.log('✅ Seed completado exitosamente.')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
