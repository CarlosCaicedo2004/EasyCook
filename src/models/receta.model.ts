import { Schema, model, Types, Document } from "mongoose";

interface IReceta extends Document {
  nombre: string;
  tipo: string;
  instrucciones: string;
  tiempo_preparacion: number;
  ingredientes: string[];
  autor_id: Types.ObjectId;
}

const recetaSchema = new Schema<IReceta>({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  instrucciones: { type: String, required: true },
  tiempo_preparacion: { type: Number, required: true },
  ingredientes: { type: [String], required: true },
  autor_id: { type: Types.ObjectId, ref: "Usuario", required: true }
}, {
  timestamps: true
});

const Receta = model<IReceta>("Receta", recetaSchema);

export default Receta;