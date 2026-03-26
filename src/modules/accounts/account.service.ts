import type { Account } from "./account.schema";
import prisma from "@/config/prisma";

export const createAccount = async (accountData: Account, userId: string) => {
  const newAccount = await prisma.account.create({
    data: {
      name: accountData.name,
      brand: accountData.brand,
      color: accountData.color,
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
          },
          include: {
            payments: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = accounts.map(account => {
      let totalThisMonth = 0;

      account.debts.forEach(debt => {
        if (debt.isSubscription) {
          totalThisMonth += debt.amountPerMonth;
        } else {
          totalThisMonth += debt.amountPerMonth;
        }
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

    return updatedAccount;
  } catch (error) {
    throw new Error('Failed to update account');
  }
}

export const deleteAccount = async (accountId: string, userId: string) => {
  try {
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