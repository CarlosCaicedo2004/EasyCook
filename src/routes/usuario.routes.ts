import { Router } from "express";
import * as ctrl from "../controllers/usuario.controller";

const router = Router();

router.post("/", ctrl.createUsuario);
router.get("/", ctrl.getUsuarios);
router.get("/:id", ctrl.getUsuario);
router.put("/:id", ctrl.updateUsuario);
router.delete("/:id", ctrl.deleteUsuario);
router.get("/:id/historial", ctrl.getHistorialReciente);
router.post("/login", ctrl.login);
router.put("/change-password", ctrl.changePassword);
router.post("/refresh", ctrl.refreshToken);
router.post("/logout", ctrl.logout);

export default router;