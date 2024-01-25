import { Router } from "express";
import { signUp, logIn, getUser, updateUser } from "../controllers/user.js";
import { verifyJWT } from "../middleware/verifyJwt.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/", verifyJWT, getUser);
router.put("/", verifyJWT, updateUser);

export default router;
