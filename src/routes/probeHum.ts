import { Router } from 'express'
import { getProbeHum, logProbeHum } from '../controllers/probeHum'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

router.get('/:probe_id/:hist/:from?/:to?', verifyJWT, getProbeHum)
router.post('/new/:probe_id', logProbeHum)

export default router
