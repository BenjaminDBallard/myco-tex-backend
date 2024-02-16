import express from "express";
import cors from "cors";
import "dotenv/config";
import passUserRouter from "./routes/user.js";
import locationRouter from "./routes/location.js";
import roomRouter from "./routes/room.js";
// import controllerRouter from "./routes/controller.js";
// import probeRouter from "./routes/probe.js";
import probeCo2Router from "./routes/probeCo2.js";
import probeHumRouter from "./routes/probeHum.js";
import probePpmRouter from "./routes/probePpm.js";
import probeThermRouter from "./routes/probeTherm.js";
import apiRouter from "./routes/api.js";
import deviceRouter from "./routes/device.js";
import { verifyJWT } from "./middleware/verifyJwt.js";
import cookies from "cookie-parser";

const app = express();

const whitelist = ["http://localhost:3000", "http://localhost:3001"];
const corsOptions = {
  credentials: true, // This is important.
  origin: whitelist,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookies());

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated Congrats:");
});

// app.use("/secret-route", verifyJWT, (req, res) => {
//   return res.send("successfully accessed secret toure");
// });

app.use("/api", apiRouter);
app.use("/api/user", passUserRouter);
app.use("/api/location", locationRouter);
app.use("/api/room", roomRouter);
app.use("/api/device", deviceRouter);
// app.use("/api/controller", controllerRouter);
// app.use("/api/probe", probeRouter);
app.use("/api/co2", probeCo2Router);
app.use("/api/hum", probeHumRouter);
app.use("/api/ppm", probePpmRouter);
app.use("/api/temp", probeThermRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`);
});
