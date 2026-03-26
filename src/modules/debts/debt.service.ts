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
      orderBy: { createdAt: 'desc' }
    });

    if (!debts) {
      throw new Error('No debts found for this account');
    }

    return debts;
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

export const deleteDebt = async (debtId: string) => {
  try {
    await prisma.debt.delete({
      where: { id: debtId }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Debt deletion failed');
  }
}

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