import express from "express";
import cors from "cors";
import "dotenv/config";
import passUuidRouter from "./routes/passUuid.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/uuid", passUuidRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server started on http://localhost:${PORT}`);
});
