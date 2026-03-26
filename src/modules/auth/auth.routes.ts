import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import * as authController from "./auth.controller";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout,);
router.post("/register", authController.register);
router.get("/me", authMiddleware, authController.getMe);

export default router;
