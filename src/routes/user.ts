import { Router } from 'express'
import {
  signUp,
  logIn,
  // getUser,
  updateUser,
  refreshJWT
} from '../controllers/user'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/refresh', refreshJWT)
// router.get("/", verifyJWT, getUser);
router.put('/update', verifyJWT, updateUser)

export default router
