import { Router } from "express";
import { logUser } from "../controllers/user.js";
import { getUser } from "../controllers/user.js";

const router = Router();

router.post("/", logUser);
router.get("/", getUser);

export default router;
