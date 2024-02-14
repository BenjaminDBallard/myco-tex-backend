import { Router } from 'express'
import { getReport, getMeasure } from '../controllers/api'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

router.get('/report', verifyJWT, getReport)
router.get('/measure/:room_id/:hist/:from?/:to?', verifyJWT, getMeasure)

export default router
