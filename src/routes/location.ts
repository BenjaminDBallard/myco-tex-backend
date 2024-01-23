import { Router } from "express";
import {
  getLocation,
  logLocation,
  updateLocation,
} from "../controllers/location.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.get("/", verifyJWT, getLocation);
router.post("/", verifyJWT, logLocation);
router.put("/:location_id", verifyJWT, updateLocation);

export default router;
