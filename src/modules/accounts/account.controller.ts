import { accountSchema } from "./account.schema";
import { Request, Response } from "express";
import * as accountService from "./account.service";

export const addAccount = async (req: Request, res: Response) => {
  try {
    const accountData = accountSchema.safeParse(req.body);

    if (!accountData.success) {
      return res.status(400).json({
        error: 'Invalid account data',
        details: accountData.error
      });
    }

    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newaccount = await accountService.createAccount(accountData.data, req.user.userId.toString());

    return res.status(201).json(newaccount);
  } catch (err) {
    console.error('Error occurred while creating account:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { userId } = req.user;

    const accounts = await accountService.getAccountsByUserId(userId);
    return res.status(200).json(accounts);
  } catch (err) {
    console.error('Error occurred while fetching accounts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getAccountById = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'account ID is required' });
    }

    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'account ID must be a string' });
    }

    const { id } = req.params;
    const { userId } = req.user;

    const account = await accountService.getAccountById(id, userId);

    if (!account) {
      return res.status(404).json({ error: 'account not found' });
    }

    return res.status(200).json(account);
  } catch (err) {
    console.error('Error occurred while fetching account by ID:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'account ID is required' });
    }

    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'account ID must be a string' });
    }

    const { id } = req.params;
    const { userId } = req.user;

    const account = await accountService.updateAccount(id, req.body, userId);

    if (!account) {
      return res.status(404).json({ error: 'account not found' });
    }

    return res.status(200).json(account);
  } catch (err) {
    console.error('Error occurred while updating account:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'account ID is required' });
    }

    if (typeof req.params.id !== 'string') {
      return res.status(400).json({ error: 'account ID must be a string' });
    }

    const { id } = req.params;
    const { userId } = req.user;

    const account = await accountService.deleteAccount(id, userId);

    if (!account) {
      return res.status(404).json({ error: 'account not found' });
    }

    return res.status(200).json({ message: 'account deleted successfully' });

  } catch (err) {
    console.error('Error occurred while deleting account:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}