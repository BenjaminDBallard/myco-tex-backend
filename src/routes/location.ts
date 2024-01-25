import { Router } from "express";
import {
  // getLocation,
  logLocation,
  updateLocation,
} from "../controllers/location.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

// router.get("/", verifyJWT, getLocation);
router.post("/new", verifyJWT, logLocation);
router.put("/update/:location_id", verifyJWT, updateLocation);

export default router;
