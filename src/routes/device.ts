import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJwt.js";
import { postDevice, updateDevice } from "../controllers/device.js";

const router = Router();

router.post("/new/:room_id", verifyJWT, postDevice);
router.put("/update/:controller_id", verifyJWT, updateDevice);

export default router;
