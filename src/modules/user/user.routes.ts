import {Router} from 'express'
import * as userController from './user.controller'
import { authMiddleware } from '@/middlewares/auth'

const router = Router()

router.get('/me', authMiddleware, userController.getUserById)
router.put('/me', authMiddleware, userController.updateUser)

export default router