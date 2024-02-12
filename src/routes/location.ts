import { Router } from 'express'
import {
  // getLocation,
  logLocation,
  updateLocation
} from '../controllers/location'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

// router.get("/", verifyJWT, getLocation);
router.post('/new', verifyJWT, logLocation)
router.put('/update/:location_id', verifyJWT, updateLocation)

export default router
