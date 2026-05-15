import prisma from "@/config/prisma";
export const createAccount = async (accountData, userId) => {
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
export const getAccountsByUserId = async (userId) => {
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
        const summary = accounts.map((account) => {
            let totalThisMonth = 0;
            account.debts.forEach((debt) => {
                totalThisMonth += debt.amountPerMonth;
            });
            return {
                ...account,
                totalToPayThisMonth: totalThisMonth,
                pendingDebtsCount: account.debts.length
            };
        });
        return summary;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error al obtener el resumen de cuentas');
    }
};
export const getAccountById = async (accountId, userId) => {
    try {
        const account = await prisma.account.findFirst({
            where: { id: accountId, userId },
        });
        if (!account) {
            throw new Error('Account not found');
        }
        return account;
    }
    catch (error) {
        throw new Error('Failed to fetch account');
    }
};
export const updateAccount = async (accountId, accountData, userId) => {
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
    }
    catch (error) {
        throw new Error('Failed to update account');
    }
};
export const deleteAccount = async (accountId, userId) => {
    try {
        // El borrado masivo asegura que solo se borre si pertenece al usuario
        const deletedAccount = await prisma.account.deleteMany({
            where: { id: accountId, userId },
        });
        if (deletedAccount.count === 0) {
            throw new Error('Account not found or user unauthorized');
        }
        return deletedAccount;
    }
    catch (error) {
        throw new Error('Failed to delete account');
    }
};
export const markAccountAsPaid = async (accountId, userId) => {
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
    return await prisma.$transaction(async (tx) => {
        for (const debt of account.debts) {
            const paidInstallments = debt.initialPaidInstallments + (debt.payments?.length || 0);
            await tx.payment.create({
                data: {
                    amount: debt.amountPerMonth,
                    installmentNumber: paidInstallments + 1,
                    debtId: debt.id,
                    userId: userId
                }
            });
            if (!debt.isSubscription && (paidInstallments + 1) >= debt.totalInstallments) {
                await tx.debt.updateMany({
                    where: { id: debt.id, userId }, // Usamos updateMany para mayor seguridad IDOR
                    data: { status: 'PAID' }
                });
            }
        }
        return { success: true, debtsProcessed: account.debts.length };
    });
};
