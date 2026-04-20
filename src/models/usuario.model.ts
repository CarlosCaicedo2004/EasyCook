import { Schema, model, Types } from "mongoose";

const historialSchema = new Schema({
  receta_id: { type: Types.ObjectId, ref: "Receta" },
  fecha_vista: { type: Date }
});

const usuarioSchema = new Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  refreshToken: String,
  recetas_favoritas: [{ type: Types.ObjectId, ref: "Receta" }],
  historial_recetas: [historialSchema]
});

export default model("Usuario", usuarioSchema);