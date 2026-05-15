import { debtSchema } from "./debt.schema";
import * as debtService from "./debt.service";
const verifyUser = (req) => {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
        throw new Error('Unauthorized');
    }
    return req.user.userId.toString();
};
export const addDebt = async (req, res) => {
    try {
        const debtData = debtSchema.safeParse(req.body);
        if (!debtData.success) {
            return res.status(400).json({
                error: 'Invalid debt data',
                details: debtData.error
            });
        }
        const userId = verifyUser(req);
        const newDebt = await debtService.createDebt(debtData.data, userId);
        return res.status(201).json(newDebt);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create debt' });
    }
};
export const getDebts = async (req, res) => {
    try {
        const { accountId } = req.query;
        const userId = verifyUser(req);
        if (!accountId) {
            return res.status(400).json({ error: 'Account ID is required' });
        }
        if (typeof accountId !== 'string') {
            return res.status(400).json({ error: 'Account ID must be a string' });
        }
        const debts = await debtService.getDebtsByAccountId(accountId, userId);
        if (!debts) {
            return res.status(404).json({ error: 'No debts found for this account' });
        }
        return res.status(200).json(debts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch debts' });
    }
};
export const updateDebt = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = verifyUser(req);
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Debt ID is required and must be a string' });
        }
        const debtData = debtSchema.safeParse(req.body);
        if (!debtData.success) {
            return res.status(400).json({
                error: 'Invalid debt data',
                details: debtData.error
            });
        }
        const updatedDebt = await debtService.updateDebt(id, debtData.data, userId);
        return res.status(200).json(updatedDebt);
    }
    catch (error) {
        console.error(error);
        if (error.message === 'DEBT_NOT_FOUND') {
            return res.status(404).json({ error: 'Deuda no encontrada o sin permisos' });
        }
        return res.status(500).json({ error: 'Failed to update debt' });
    }
};
export const deleteDebt = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = verifyUser(req);
        if (!id)
            return res.status(400).json({ error: 'ID requerido' });
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Debt ID must be a string' });
        }
        const result = await debtService.deleteDebt(id, userId);
        return res.status(204).send();
    }
    catch (error) {
        console.error(`[DELETE_DEBT_ERROR]: ${error.message}`);
        if (error.message === 'DEBT_NOT_FOUND') {
            return res.status(404).json({ error: 'La deuda no existe o no tenés permiso' });
        }
        return res.status(500).json({ error: 'Error interno al eliminar' });
    }
};
export const getAllDebts = async (req, res) => {
    try {
        const userId = verifyUser(req);
        console.log(userId);
        const debts = await debtService.getAllDebtsByUserId(userId);
        return res.status(200).json(debts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch debts' });
    }
};
export const markDebtAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = verifyUser(req);
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Debt ID is required and must be a string' });
        }
        await debtService.markDebtAsPaid(id, userId);
        return res.status(200).json({ message: 'Debt marked as paid' });
    }
    catch (error) {
        console.error(error);
        if (error.message === 'DEBT_NOT_FOUND') {
            return res.status(404).json({ error: 'Deuda no encontrada o sin permisos' });
        }
        return res.status(500).json({ error: 'Failed to mark debt as paid' });
    }
};
