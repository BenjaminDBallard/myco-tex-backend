import { Router } from "express";
import { getRoom, logRoom, updateRoom } from "../controllers/room.js";

const router = Router();

router.get("/:location_id", getRoom);
router.post("/:location_id", logRoom);
router.put("/:room_id", updateRoom);

export default router;
