import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import passUserRouter from './routes/user'
import locationRouter from './routes/location'
import roomRouter from './routes/room'
// import controllerRouter from "./routes/controller";
// import probeRouter from "./routes/probe";
import probeCo2Router from './routes/probeCo2'
import probeHumRouter from './routes/probeHum'
import probePpmRouter from './routes/probePpm'
import probeThermRouter from './routes/probeTherm'
import apiRouter from './routes/api'
import deviceRouter from './routes/device'
import { verifyJWT } from './middleware/verifyJwt'
import cookies from 'cookie-parser'

const app = express()

const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://mycology.perenne.com/',
  'https://myco-tex.web.app/'
]
const corsOptions = {
  credentials: true, // This is important.
  origin: whitelist
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookies())

app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send('You are authenticated Congrats:')
})

// app.use("/secret-route", verifyJWT, (req, res) => {
//   return res.send("successfully accessed secret toure");
// });

app.use('/api', apiRouter)
app.use('/api/user', passUserRouter)
app.use('/api/location', locationRouter)
app.use('/api/room', roomRouter)
app.use('/api/device', deviceRouter)
// app.use("/api/controller", controllerRouter);
// app.use("/api/probe", probeRouter);
app.use('/api/co2', probeCo2Router)
app.use('/api/hum', probeHumRouter)
app.use('/api/ppm', probePpmRouter)
app.use('/api/temp', probeThermRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`)
})
