import express from "express";
import cors from "cors";
import "dotenv/config";
import passUuidRouter from "./routes/passUuid.js";
import locationRouter from "./routes/location.js";
import roomRouter from "./routes/room.js";
import controllerRouter from "./routes/controller.js";
import probeRouter from "./routes/probe.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/uuid", passUuidRouter);
app.use("/api/locations", locationRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/controllers", controllerRouter);
app.use("/api/probes", probeRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server started on http://localhost:${PORT}`);
});
