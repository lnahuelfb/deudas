import { debtSchema } from "./debt.schema";
import { Request, Response } from "express";
import * as debtService from "./debt.service";

const verifyUser = (req: Request) => {
  if (!req.user || typeof req.user === 'string' || !req.user.userId) {
    throw new Error('Unauthorized');
  }
  return req.user.userId.toString();
}

export const addDebt = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create debt' });
  }
}

export const getDebts = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

    if (typeof accountId !== 'string') {
      return res.status(400).json({ error: 'Account ID must be a string' });
    }

    const debts = await debtService.getDebtsByAccountId(accountId);

    if (!debts) {
      return res.status(404).json({ error: 'No debts found for this account' });
    }

    return res.status(200).json(debts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch debts' });
  }
}

export const updateDebt = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Debt ID is required' });
    }

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Debt ID must be a string' });
    }

    const debtData = debtSchema.safeParse(req.body);

    if (!debtData.success) {
      return res.status(400).json({
        error: 'Invalid debt data',
        details: debtData.error
      });
    }

    const updatedDebt = await debtService.updateDebt(id, debtData.data);

    if (!updatedDebt) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    return res.status(200).json(updatedDebt);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update debt' });
  }
}

export const deleteDebt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = verifyUser(req);

    if (!id) return res.status(400).json({ error: 'ID requerido' });

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Debt ID must be a string' });
    }

    const result = await debtService.deleteDebt(id, userId);

    return res.status(204).send();
  } catch (error: any) {
    console.error(`[DELETE_DEBT_ERROR]: ${error.message}`);

    if (error.message === 'DEBT_NOT_FOUND') {
      return res.status(404).json({ error: 'La deuda no existe o no tenés permiso' });
    }

    return res.status(500).json({ error: 'Error interno al eliminar' });
  }
};

export const markDebtAsPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Debt ID is required' });
    }

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Debt ID must be a string' });
    }

    await debtService.markDebtAsPaid(id);

    return res.status(200).json({ message: 'Debt marked as paid' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to mark debt as paid' });
  }
}