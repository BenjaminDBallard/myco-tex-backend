import { Router } from "express";
import {
  getLocation,
  logLocation,
  updateLocation,
} from "../controllers/location.js";

const router = Router();

router.get("/:user_id", getLocation);
router.post("/:user_id", logLocation);
router.put("/:location_id", updateLocation);

export default router;
