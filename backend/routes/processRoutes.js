
import express from "express";
import { getFilesInfo } from "../controllers/processController.js";

const router = express.Router();
router.get("/data", getFilesInfo);

export default router;