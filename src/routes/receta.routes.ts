import { Router } from "express";
import * as ctrl from "../controllers/receta.controller";

const router = Router();

router.post("/", ctrl.createReceta);
router.get("/", ctrl.getRecetas);
router.get("/:id", ctrl.getReceta);
router.put("/:id", ctrl.updateReceta);
router.delete("/:id", ctrl.deleteReceta);

router.get("/ingrediente/:ing", ctrl.buscarPorIngrediente);
router.get("/tiempo/:time", ctrl.buscarPorTiempo);
router.get("/tipo/:tipo", ctrl.buscarPorTipo);

export default router;