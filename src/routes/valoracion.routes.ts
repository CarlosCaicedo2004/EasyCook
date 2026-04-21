import { Router } from "express";
import * as ctrl from "../controllers/valoracion.controller";
import { verificarToken } from "../middlleware/auth.middlewares";

const router = Router();

router.post("/", verificarToken, ctrl.createValoracion);
router.put("/:id", verificarToken, ctrl.updateValoracion);
router.get("/", ctrl.getValoraciones);
router.get("/:recetaId", ctrl.getValoracionesPorReceta);
router.delete("/:id", verificarToken, ctrl.deleteValoracion);

export default router;