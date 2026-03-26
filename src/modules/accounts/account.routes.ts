import Router from "express";
import * as accountController from "./account.controller";

const router = Router();

router.post("/", accountController.addAccount);
router.get("/", accountController.getAccount);
router.get("/:id", accountController.getAccountById);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

export default router;