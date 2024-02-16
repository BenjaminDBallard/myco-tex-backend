import { Router } from 'express'
import {
  // getRoom,
  logRoom,
  updateRoom
} from '../controllers/room'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

// router.get("/:location_id", verifyJWT, getRoom);
router.post('/new/:location_id', verifyJWT, logRoom)
router.put('/update/:room_id', verifyJWT, updateRoom)

export default router
