import { Router } from "express";
import * as ctrl from "../controllers/receta.controller";
import { verificarToken } from "../middlleware/auth.middlewares";
import { GetDataFromToken } from "../middlleware/receta.middlewares";

const router = Router();

router.post("/", verificarToken, ctrl.createReceta);
router.get("/", ctrl.getRecetas);
router.get("/:id", GetDataFromToken, ctrl.getReceta);
router.put("/:id", verificarToken, ctrl.updateReceta);
router.delete("/:id", verificarToken, ctrl.deleteReceta);

router.get("/ingrediente/:ing", ctrl.buscarPorIngrediente);
router.get("/tiempo/:time", ctrl.buscarPorTiempo);
router.get("/tipo/:tipo", ctrl.buscarPorTipo);

router.get("/recomendadas/filtro", ctrl.getRecomendadas);

export default router;