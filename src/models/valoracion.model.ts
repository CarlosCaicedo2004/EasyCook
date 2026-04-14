import { Schema, model, Types } from "mongoose";

const valoracionSchema = new Schema({
  receta_id: { type: Types.ObjectId, ref: "Receta" },
  usuario_id: { type: Types.ObjectId, ref: "Usuario" },
  puntuacion: Number,
  comentario: String
});

export default model("Valoracion", valoracionSchema);