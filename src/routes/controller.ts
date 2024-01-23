import { Router } from "express";
import {
  getController,
  logController,
  updateController,
} from "../controllers/controller.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:room_id", verifyJWT, getController);
router.post("/:room_id", verifyJWT, logController);
router.put("/:controller_id", verifyJWT, updateController);

export default router;
