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
      color: '#7c3aed',
      type: AccountType.CREDIT_CARD,
      closingDay: 25,
      dueDay: 5,
      monthlyLimit: 800000,
      userId: demo.id,
    },
  })

  const mastercardGalicia = await prisma.account.create({
    data: {
      name: 'Mastercard Galicia',
      brand: 'Mastercard',
      color: '#db2777',
      type: AccountType.CREDIT_CARD,
      closingDay: 18,
      dueDay: 28,
      monthlyLimit: 600000,
      userId: demo.id,
    },
  })

  const amexMacro = await prisma.account.create({
    data: {
      name: 'Amex Macro',
      brand: 'American Express',
      color: '#1e293b',
      type: AccountType.CREDIT_CARD,
      closingDay: 20,
      dueDay: 2,
      monthlyLimit: 750000,
      userId: demo.id,
    },
  })

  const naranjaX = await prisma.account.create({
    data: {
      name: 'Naranja X',
      brand: 'Naranja',
      color: '#d97706',
      type: AccountType.CREDIT_CARD,
      closingDay: 24,
      dueDay: 10,
      monthlyLimit: 400000,
      userId: demo.id,
    },
  })

  const mercadoPago = await prisma.account.create({
    data: {
      name: 'Mercado Pago Prepaga',
      brand: 'Mercado Pago',
      color: '#2563eb',
      type: AccountType.CREDIT_CARD,
      closingDay: 30,
      dueDay: 5,
      monthlyLimit: 300000,
      userId: demo.id,
    },
  })

  const expensasCompartidas = await prisma.account.create({
    data: {
      name: 'Gastos Compartidos (Mati)',
      color: '#059669',
      type: AccountType.PERSONAL,
      userId: demo.id,
    },
  })

  // 5. Crear Deudas de ejemplo
  // Visa Santander: Un monitor en cuotas
  const debtCuotas = await prisma.debt.create({
    data: {
      title: 'Monitor Gamer 144hz',
      category: 'Tecnología',
      totalAmount: 300000,
      amountPerMonth: 100000,
      totalInstallments: 3,
      startDate: new Date('2026-04-10'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: visaSantander.id,
    },
  })

  // Visa Santander: Netflix
  await prisma.debt.create({
    data: {
      title: 'Netflix Standard',
      category: 'Suscripción',
      totalAmount: 9500,
      amountPerMonth: 9500,
      isSubscription: true,
      totalInstallments: 1,
      startDate: new Date('2026-05-01'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: visaSantander.id,
    },
  })

  // Visa Santander: Compra Supermercado
  await prisma.debt.create({
    data: {
      title: 'Compra Mensual Coto',
      category: 'Supermercado',
      totalAmount: 78000,
      amountPerMonth: 78000,
      totalInstallments: 1,
      startDate: new Date('2026-05-15'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: visaSantander.id,
    },
  })

  // Mastercard Galicia: Zapatillas en cuotas
  await prisma.debt.create({
    data: {
      title: 'Zapatillas Deportivas',
      category: 'Ropa',
      totalAmount: 120000,
      amountPerMonth: 40000,
      totalInstallments: 3,
      startDate: new Date('2026-05-02'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: mastercardGalicia.id,
    },
  })

  // Mastercard Galicia: Spotify
  await prisma.debt.create({
    data: {
      title: 'Spotify Familiar',
      category: 'Suscripción',
      totalAmount: 3400,
      amountPerMonth: 3400,
      isSubscription: true,
      totalInstallments: 1,
      startDate: new Date('2026-05-05'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: mastercardGalicia.id,
    },
  })

  // Expensas Compartidas (Deuda Personal): Expensas departamento
  await prisma.debt.create({
    data: {
      title: 'Expensas Mayo (Mitad)',
      category: 'Varios',
      totalAmount: 45000,
      amountPerMonth: 45000,
      totalInstallments: 1,
      startDate: new Date('2026-05-10'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: expensasCompartidas.id,
    },
  })

  // Expensas Compartidas (Deuda Personal): Cuentas de luz/gas
  await prisma.debt.create({
    data: {
      title: 'Mitad Factura Edesur',
      category: 'Varios',
      totalAmount: 12500,
      amountPerMonth: 12500,
      totalInstallments: 1,
      startDate: new Date('2026-05-12'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: expensasCompartidas.id,
    },
  })

  // Amex Macro: Pasajes a Bariloche
  await prisma.debt.create({
    data: {
      title: 'Pasajes a Bariloche',
      category: 'Ocio',
      totalAmount: 240000,
      amountPerMonth: 80000,
      totalInstallments: 3,
      startDate: new Date('2026-05-01'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: amexMacro.id,
    },
  })

  // Naranja X: Celular Nuevo
  await prisma.debt.create({
    data: {
      title: 'Samsung Galaxy A54',
      category: 'Tecnología',
      totalAmount: 180000,
      amountPerMonth: 30000,
      totalInstallments: 6,
      startDate: new Date('2026-03-05'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: naranjaX.id,
    },
  })

  // Mercado Pago Prepaga: Suscripción Disney+
  await prisma.debt.create({
    data: {
      title: 'Combo Disney+ & Star+',
      category: 'Suscripción',
      totalAmount: 4500,
      amountPerMonth: 4500,
      isSubscription: true,
      totalInstallments: 1,
      startDate: new Date('2026-05-01'),
      status: DebtStatus.PENDING,
      userId: demo.id,
      accountId: mercadoPago.id,
    },
  })

  // 6. Registrar un pago para la primera cuota del monitor
  await prisma.payment.create({
    data: {
      amount: 100000,
      installmentNumber: 1,
      debtId: debtCuotas.id,
      userId: demo.id,
      date: new Date('2026-05-05'),
      createdAt: new Date('2026-05-05'),
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