import { Router } from "express";
import { getController, logController } from "../controllers/controller.js";
const router = Router();
router.get("/:room_id/controller", getController);
router.post("/:room_id/controller", logController);
export default router;
