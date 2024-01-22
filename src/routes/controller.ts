import { Router } from "express";
import {
  getController,
  logController,
  updateController,
} from "../controllers/controller.js";

const router = Router();

router.get("/:room_id", getController);
router.post("/:room_id", logController);
router.put("/:controller_id", updateController);

export default router;
