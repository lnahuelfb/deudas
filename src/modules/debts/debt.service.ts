import type { Debt } from "./debt.schema";
import prisma from "../../config/prisma";

export const createDebt = async (debtData: Debt, userId: string) => {
  try {
    const newDebt = await prisma.debt.create({
      data: {
        title: debtData.title,
        category: debtData.category,
        totalAmount: debtData.totalAmount,
        totalInstallments: debtData.totalInstallments,
        amountPerMonth: debtData.amountPerMonth,
        isSubscription: debtData.isSubscription,
        initialPaidInstallments: debtData.initialPaidInstallments,
        accountId: debtData.accountId,
        userId
      }
    });

    if (!newDebt) {
      throw new Error('Debt creation failed');
    }

    return newDebt;
  } catch (error) {
    console.error(error);
    throw new Error('Debt creation failed');
  }
}

export const getDebtsByAccountId = async (accountId: string, userId: string) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { accountId, userId },
      orderBy: { createdAt: 'desc' },
      include: { payments: true }
    });

    const enrichedDebts = debts.map((debt: any) => {
      const paidInstallments = debt.initialPaidInstallments + (debt.payments?.length || 0);
      const remainingAmount = debt.totalAmount
        ? debt.totalAmount - (debt.amountPerMonth * (paidInstallments))
        : undefined;

      return {
        ...debt,
        paidInstallments,
        remainingAmount
      };
    });

    return enrichedDebts;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch debts');
  }
}

export const updateDebt = async (debtId: string, debtData: Debt, userId: string) => {
  try {
    const updatedDebt = await prisma.debt.updateMany({
      where: { id: debtId, userId },
      data: {
        title: debtData.title,
        category: debtData.category,
        totalAmount: debtData.totalAmount,
        totalInstallments: debtData.totalInstallments,
        amountPerMonth: debtData.amountPerMonth,
        isSubscription: debtData.isSubscription
      }
    });

    if (updatedDebt.count === 0) {
      throw new Error('DEBT_NOT_FOUND');
    }

    // Retornamos el objeto verificado por userId
    return await prisma.debt.findFirst({ 
      where: { id: debtId, userId } 
    });

  } catch (error) {
    console.error(error);
    throw new Error('Debt update failed');
  }
}

export const deleteDebt = async (debtId: string, userId: string) => {
  // Verificamos propiedad antes de iniciar la transacción
  const debt = await prisma.debt.findFirst({
    where: { id: debtId, userId: userId }
  });

  if (!debt) {
    throw new Error('DEBT_NOT_FOUND');
  }

  return await prisma.$transaction(async (tx: any) => {
    // Borramos pagos asociados asegurando que sean del usuario
    await tx.payment.deleteMany({
      where: { debtId: debtId, userId: userId }
    });

    // Borramos la deuda asegurando propiedad
    await tx.debt.deleteMany({
      where: { id: debtId, userId: userId }
    });

    return { success: true };
  });
};

export const getAllDebtsByUserId = async (userId: string) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { payments: true }
    });

    const totalToPayThisMonth = debts.reduce((total: number, debt: any) => {
      if(debt.status === 'PAID') return total;
      if(debt.isSubscription) return total + debt.amountPerMonth;
      if(!debt.totalAmount) return total + debt.amountPerMonth;

      const paidInstallments = debt.initialPaidInstallments + (debt.payments?.length || 0);
      const remainingAmount = debt.totalAmount
        ? debt.totalAmount - (debt.amountPerMonth * (paidInstallments))
        : 0;

      const inThisMonth = total + (remainingAmount > 0 ? debt.amountPerMonth : 0);

      return inThisMonth;
    }, 0);


    const totalToPay = debts.reduce((total: number, debt: any) => {
      if(debt.status === 'PAID') return total;
      if(debt.isSubscription) return total;

      const paidInstallments = debt.initialPaidInstallments + (debt.payments?.length || 0);
      const remainingAmount = debt.totalAmount
        ? debt.totalAmount - (debt.amountPerMonth * (paidInstallments))
        : 0;

      return total + remainingAmount;
    }, 0);

    const totalSubscriptions = debts.reduce((total: number, debt: any) => {
      if(debt.status === 'PAID') return total;
      if(debt.isSubscription) return total + debt.amountPerMonth;
      return total;
    }, 0);
  
    return { debts, totalToPayThisMonth, totalToPay, totalSubscriptions };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch debts');
  }
}

export const markDebtAsPaid = async (debtId: string, userId: string) => {
  try {
    const result = await prisma.debt.updateMany({
      where: { id: debtId, userId },
      data: { status: 'PAID' }
    });

    if (result.count === 0) {
      throw new Error('DEBT_NOT_FOUND');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to mark debt as paid');
  }
}