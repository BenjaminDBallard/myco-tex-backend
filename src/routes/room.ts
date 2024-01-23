import { Router } from "express";
import { getRoom, logRoom, updateRoom } from "../controllers/room.js";
import { verifyJWT } from "../controllers/user.js";

const router = Router();

router.get("/:location_id", verifyJWT, getRoom);
router.post("/:location_id", logRoom);
router.put("/:room_id", updateRoom);

export default router;
