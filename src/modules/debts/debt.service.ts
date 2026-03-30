import type { Debt } from "./debt.schema";
import prisma from "@/config/prisma";

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

export const getDebtsByAccountId = async (accountId: string) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      include: { payments: true }
    });

    const enrichedDebts = debts.map(debt => {
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

    if (!enrichedDebts) {
      throw new Error('No debts found for this account');
    }

    return enrichedDebts;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch debts');
  }
}

export const updateDebt = async (debtId: string, debtData: Debt) => {
  try {
    const updatedDebt = await prisma.debt.update({
      where: { id: debtId },
      data: {
        title: debtData.title,
        category: debtData.category,
        totalAmount: debtData.totalAmount,
        totalInstallments: debtData.totalInstallments,
        amountPerMonth: debtData.amountPerMonth,
        isSubscription: debtData.isSubscription
      }
    });

    if (!updatedDebt) {
      throw new Error('Debt update failed');
    }

    return updatedDebt;
  } catch (error) {
    console.error(error);
    throw new Error('Debt update failed');
  }
}

export const deleteDebt = async (debtId: string, userId: string) => {
  const debt = await prisma.debt.findFirst({
    where: { id: debtId, userId: userId }
  });

  if (!debt) {
    throw new Error('DEBT_NOT_FOUND');
  }

  return await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { debtId: debtId }
    });

    await tx.debt.delete({
      where: { id: debtId }
    });

    return { success: true };
  });
};

export const markDebtAsPaid = async (debtId: string) => {
  try {
    await prisma.debt.update({
      where: { id: debtId },
      data: { status: 'PAID' }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to mark debt as paid');
  }
}