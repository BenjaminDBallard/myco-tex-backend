import { Router } from "express";
import { getRoom, logRoom } from "../controllers/room.js";

const router = Router();

router.get("/:location_id", getRoom);
router.post("/:location_id", logRoom);

export default router;
