import { Router } from "express";
import { logUser, getUser, updateUser } from "../controllers/user.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.post("/", logUser);
router.get("/", verifyJWT, getUser);
router.put("/", verifyJWT, updateUser);

export default router;
