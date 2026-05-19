import type { Account } from "./account.schema";
import prisma from "../../config/prisma";

export const createAccount = async (accountData: Account, userId: string) => {
  const newAccount = await prisma.account.create({
    data: {
      name: accountData.name,
      brand: accountData.brand,
      color: accountData.color,
      type: accountData.type,
      dueDay: accountData.dueDay,
      closingDay: accountData.closingDay,
      userId
    }
  });

  if (!newAccount) {
    throw new Error('Account creation failed');
  }

  return newAccount;
};

export const getAccountsByUserId = async (userId: string) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      include: {
        debts: {
          where: {
            status: 'PENDING', 
            userId // Doble verificación de seguridad
          },
          include: {
            payments: {
              where: { userId } // Aseguramos que los pagos cargados sean del usuario
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = accounts.map((account: any) => {
      let totalThisMonth = 0;

      account.debts.forEach((debt: any) => {
        totalThisMonth += debt.amountPerMonth;
      });

      return {
        ...account,
        totalToPayThisMonth: totalThisMonth,
        pendingDebtsCount: account.debts.length
      };
    });

    return summary;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el resumen de cuentas');
  }
}

export const getAccountById = async (accountId: string, userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  } catch (error) {
    throw new Error('Failed to fetch account');
  }
}

export const updateAccount = async (accountId: string, accountData: Account, userId: string) => {
  try {
    const updatedAccount = await prisma.account.updateMany({
      where: { id: accountId, userId },
      data: {
        name: accountData.name,
        brand: accountData.brand,
        color: accountData.color,
        dueDay: accountData.dueDay,
        closingDay: accountData.closingDay,
      },
    });

    if (updatedAccount.count === 0) {
      throw new Error('Account not found or user unauthorized');
    }

    return await prisma.account.findFirst({
      where: { id: accountId, userId }
    });
  } catch (error) {
    throw new Error('Failed to update account');
  }
}

export const deleteAccount = async (accountId: string, userId: string) => {
  try {
    // El borrado masivo asegura que solo se borre si pertenece al usuario
    const deletedAccount = await prisma.account.deleteMany({
      where: { id: accountId, userId },
    });

    if (deletedAccount.count === 0) {
      throw new Error('Account not found or user unauthorized');
    }

    return deletedAccount;
  } catch (error) {
    throw new Error('Failed to delete account');
  }
}

export const markAccountAsPaid = async (accountId: string, userId: string, debtIds?: string[], paymentDate?: Date) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
    include: {
      debts: {
        where: { status: 'PENDING', userId },
        include: { payments: { where: { userId } } }
      }
    }
  });

  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  return await prisma.$transaction(async (tx: any) => {
    let targetDebts = account.debts;
    if (debtIds && Array.isArray(debtIds) && debtIds.length > 0) {
      targetDebts = account.debts.filter(d => debtIds.includes(d.id));
    }

    // 1. Guardar el Snapshot del Resumen Histórico
    const totalAmount = targetDebts.reduce((sum, d) => sum + d.amountPerMonth, 0);
    const currentDate = paymentDate || new Date();
    
    await tx.cardStatement.create({
      data: {
        accountId,
        userId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        totalAmount,
        isPaid: true,
        snapshot: JSON.stringify(targetDebts.map(d => ({ id: d.id, title: d.title, amount: d.amountPerMonth })))
      }
    });

    // 2. Cobrar las cuotas solo de las deudas del resumen actual
    for (const debt of targetDebts) {
      const paidInstallments = debt.initialPaidInstallments + (debt.payments?.length || 0);
      
      await tx.payment.create({
        data: {
          amount: debt.amountPerMonth,
          installmentNumber: paidInstallments + 1,
          debtId: debt.id,
          userId: userId,
          date: currentDate,
          createdAt: currentDate
        }
      });

      if (!debt.isSubscription && (paidInstallments + 1) >= debt.totalInstallments) {
        await tx.debt.updateMany({
          where: { id: debt.id, userId }, 
          data: { status: 'PAID' }
        });
      }
    }

    return { success: true, debtsProcessed: account.debts.length };
  });
};