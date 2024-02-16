import { Router } from 'express'
import { getProbePpm, logProbePpm } from '../controllers/probePpm'
import { verifyJWT } from '../middleware/verifyJwt'

const router = Router()

router.get('/:probe_id/:hist/:from?/:to?', verifyJWT, getProbePpm)
router.post('/new/:probe_id', logProbePpm)

export default router
