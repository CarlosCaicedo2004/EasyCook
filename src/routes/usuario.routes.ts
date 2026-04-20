import { Router } from "express";
import * as ctrl from "../controllers/usuario.controller";
import { verificarToken } from "../middlleware/auth.middlewares";

const router = Router();

router.post("/", ctrl.createUsuario);
router.get("/", ctrl.getUsuarios);
router.delete("/:id", ctrl.deleteUsuario);

router.post("/login", ctrl.login);
router.put("/change-password", verificarToken, ctrl.changePassword);
router.post("/refresh", ctrl.refreshToken);
router.post("/logout", ctrl.logout);

router.get("/:id/historial", ctrl.getHistorialReciente);
router.get("/:id", ctrl.getUsuario);
router.put("/:id", ctrl.updateUsuario);

export default router;