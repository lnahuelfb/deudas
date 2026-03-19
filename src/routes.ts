import { Router } from 'express';
import userRouter from './modules/user/user.routes';
import authRouter from './modules/auth/auth.routes';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;