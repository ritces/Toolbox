import express from "express";
import cors from "cors";
import logger from "morgan";

// Routes
import processRoutes from "./routes/processRoutes.js";

import { verifyToken, notFoundHandler } from "./middleware.js"

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.use(logger("dev"));

app.use(verifyToken);
app.use("/files", processRoutes);
app.use(notFoundHandler);

export default app;