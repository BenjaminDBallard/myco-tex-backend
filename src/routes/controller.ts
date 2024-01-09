import { Router } from "express";
import { getController, logController } from "../controllers/controller.js";

const router = Router();

router.get("/:room_id", getController);
router.post("/:room_id", logController);

export default router;
