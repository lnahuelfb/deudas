import Router from "express";
import { authMiddleware } from "@/middlewares/auth";
import { createCard, getCards, getCardById, updateCard, deleteCard } from "./card.controller";

const router = Router();

router.post("/", authMiddleware, createCard);
router.get("/", authMiddleware, getCards);
router.get("/:id", authMiddleware, getCardById);
router.put("/:id", authMiddleware, updateCard);
router.delete("/:id", authMiddleware, deleteCard);

export default router;