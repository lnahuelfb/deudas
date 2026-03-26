import { Router } from 'express';
import userRouter from './modules/user/user.routes';
import authRouter from './modules/auth/auth.routes';
import accountRouter from './modules/accounts/account.routes';
import debtRouter from './modules/debts/debt.routes';
import { authMiddleware } from './middlewares/auth';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/accounts', authMiddleware, accountRouter);
router.use('/debts', authMiddleware, debtRouter);

export default router;