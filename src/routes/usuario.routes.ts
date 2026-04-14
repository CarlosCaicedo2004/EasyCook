import { Router } from "express";
import * as ctrl from "../controllers/usuario.controller";

const router = Router();

router.post("/", ctrl.createUsuario);
router.get("/", ctrl.getUsuarios);
router.get("/:id", ctrl.getUsuario);
router.put("/:id", ctrl.updateUsuario);
router.delete("/:id", ctrl.deleteUsuario);
router.post("/login", ctrl.login);

export default router;