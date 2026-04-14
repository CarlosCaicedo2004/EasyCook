import { Schema, model, Types } from "mongoose";

const recetaSchema = new Schema({
  nombre: String,
  tipo: String,
  tiempo_preparacion: Number,
  ingredientes: [String],
  autor_id: { type: Types.ObjectId, ref: "Usuario" }
});

export default model("Receta", recetaSchema);