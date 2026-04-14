import express from "express";
import usuarioRoutes from "./routes/usuario.routes";
import recetaRoutes from "./routes/receta.routes";
import valoracionRoutes from "./routes/valoracion.routes";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/recetas", recetaRoutes);
app.use("/valoraciones", valoracionRoutes);

export default app;