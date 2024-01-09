import { Router } from "express";
import { logUser } from "../controllers/user.js";
import { getUser } from "../controllers/user.js";

const router = Router();

router.post("/user", logUser);
router.get("/user", getUser);

export default router;
