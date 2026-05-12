import express from "express";
import cors from 'cors';
import usuarioRoutes from "./routes/usuario.routes";
import recetaRoutes from "./routes/receta.routes";
import valoracionRoutes from "./routes/valoracion.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/usuarios", usuarioRoutes);
app.use("/recetas", recetaRoutes);
app.use("/valoraciones", valoracionRoutes);

export default app;