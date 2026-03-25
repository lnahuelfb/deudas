import { Router } from 'express';
import userRouter from './modules/user/user.routes';
import authRouter from './modules/auth/auth.routes';
import cardRouter from './modules/cards/card.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;