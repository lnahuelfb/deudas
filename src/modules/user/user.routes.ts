import {Router} from 'express'
import * as userController from './user.controller'

const router = Router()

router.get('/:id', userController.getUserById)
router.put('/edit', userController.updateUser)

export default router