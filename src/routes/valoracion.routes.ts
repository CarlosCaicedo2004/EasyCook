import { Router } from "express";
import * as ctrl from "../controllers/valoracion.controller";

const router = Router();

router.post("/", ctrl.createValoracion);
router.put("/:id", ctrl.updateValoracion);
router.get("/", ctrl.getValoraciones);
router.delete("/:id", ctrl.deleteValoracion);

export default router;