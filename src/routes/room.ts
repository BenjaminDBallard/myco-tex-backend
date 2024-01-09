import { Router } from "express";
import { getRoom, logRoom } from "../controllers/room.js";

const router = Router();

router.get("/:location_id/room", getRoom);
router.post("/:location_id/room", logRoom);

export default router;
