import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Limpiar base de datos
  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()
  await prisma.barber.deleteMany()
  await prisma.user.deleteMany()

  // Seed Users
  const user = await prisma.user.create({
    data: {
      name: 'Carlos Méndez',
      email: 'carlos.mendez@email.com',
      password: 'hashed-password-123',
      phone: '+52 55 1234 5678',
      role: 'CLIENT'
    }
  })

  // Seed Barbers
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

  // Seed Services
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

  // Seed Appts
  await prisma.appointment.create({
    data: {
      clientId: user.id,
      barberId: barber1.id,
      serviceId: service1.id,
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Mañana
      time: '14:00',
      price: 350,
      status: 'CONFIRMED'
    }
  })

  console.log('Seed completado.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
