// prisma/seed.ts
import { PrismaClient, Role, AccountType, DebtStatus } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando el sembrado de datos (Seeding)...')

  // 1. Limpieza previa (Opcional, pero recomendada para evitar duplicados)
  await prisma.payment.deleteMany()
  await prisma.debt.deleteMany()
  await prisma.account.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

  // 2. Crear Usuario Admin (Vos)
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'nahuel@admin.com',
      password: hashedPassword,
      name: 'Nahuel Admin',
      role: Role.ADMIN,
    },
  })

  // 3. Crear Usuario Demo (Para pruebas rápidas)

  const hashedPasswordDemo = await bcrypt.hash('demo123', 10)

  const demo = await prisma.user.create({
    data: {
      email: 'demo@test.com',
      password: hashedPasswordDemo,
      name: 'Usuario Demo',
    },
  })

  // 4. Crear Cuentas para el Usuario Demo
  const visaSantander = await prisma.account.create({
    data: {
      name: 'Visa Santander',
      brand: 'Visa',
      color: '#ec1c24',
      type: AccountType.CREDIT_CARD,
      closingDay: 25,
      dueDay: 5,
      monthlyLimit: 500000,
      userId: demo.id,
    },
  })

  const kioscoPepe = await prisma.account.create({
    data: {
      name: 'Kiosco El Flaco',
      color: '#fbbf24',
      type: AccountType.PERSONAL,
      userId: demo.id,
    },
  })

  // 5. Crear Deudas de ejemplo
  // Una deuda en cuotas (La clásica compra de tecnología)
  const debtCuotas = await prisma.debt.create({
    data: {
      title: 'Monitor 144hz',
      category: 'Tecnología',
      totalAmount: 300000,
      amountPerMonth: 100000,
      totalInstallments: 3,
      purchaseDate: new Date('2026-02-15'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: visaSantander.id,
    },
  })

  // Una suscripción (Netflix)
  await prisma.debt.create({
    data: {
      title: 'Netflix',
      category: 'Entretenimiento',
      totalAmount: 8000,
      amountPerMonth: 8000,
      isSubscription: true,
      totalInstallments: 1,
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: visaSantander.id,
    },
  })

  // Una deuda personal (Lo que le debés al kiosquero)
  await prisma.debt.create({
    data: {
      title: 'Cerveza y puchos',
      category: 'Varios',
      totalAmount: 1500,
      amountPerMonth: 1500,
      totalInstallments: 1,
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: kioscoPepe.id,
    },
  })

  // 6. Registrar un pago para la primera cuota del monitor
  await prisma.payment.create({
    data: {
      amount: 100000,
      installmentNumber: 1,
      debtId: debtCuotas.id,
      userId: demo.id,
      date: new Date('2026-03-05'),
    },
  })

  console.log('✅ Seeding completado con éxito.')
}

main()
  .catch((e) => {
    console.error('❌ Error en el Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })