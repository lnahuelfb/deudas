import { Router } from "express";
import * as debtController from "./debt.controller";

const router = Router();

router.post("/", debtController.addDebt);
router.get("/", debtController.getDebts);
router.get("/all", debtController.getAllDebts);
router.put("/:id", debtController.updateDebt);
router.delete("/:id", debtController.deleteDebt);
router.post("/:id/pay", debtController.markDebtAsPaid);

export default router;
