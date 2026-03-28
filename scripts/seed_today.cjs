const { PrismaClient } = require('../prisma/generated/client3')
const prisma = new PrismaClient()

async function main() {
  const barber = await prisma.barber.findFirst()
  const service = await prisma.service.findFirst()
  const user = await prisma.user.findFirst()

  if (!barber || !service || !user) {
    console.log('Error: Asegúrate de correr /api/seed primero.')
    return
  }

  const today = new Date()
  
  // Crear 3 citas para hoy
  const times = ['10:00', '11:00', '14:30']
  for (const time of times) {
    await prisma.appointment.create({
      data: {
        clientId: user.id,
        barberId: barber.id,
        serviceId: service.id,
        date: today,
        time: time,
        price: service.price,
        paymentMethod: 'PRESENCIAL',
        status: 'PENDING'
      }
    })
  }

  console.log('✅ 3 citas creadas para hoy!')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
