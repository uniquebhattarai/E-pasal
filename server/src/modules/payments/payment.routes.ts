import express, { Router } from "express";
import { initEsewa, statusEsewa } from "./payment.controller";

const router: Router = express.Router();

router.post("/init", initEsewa as any);
router.get("/status", statusEsewa as any);

export default router;
