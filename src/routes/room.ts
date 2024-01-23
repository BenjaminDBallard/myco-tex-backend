import { Router } from "express";
import { getRoom, logRoom, updateRoom } from "../controllers/room.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/:location_id", verifyJWT, getRoom);
router.post("/:location_id", verifyJWT, logRoom);
router.put("/:room_id", verifyJWT, updateRoom);

export default router;
