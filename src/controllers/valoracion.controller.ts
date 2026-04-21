import { Request, Response } from "express";
import Valoracion from "../models/valoracion.model";
import Receta from "../models/receta.model";


export const createValoracion = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // viene del middleware
    const { receta_id, puntuacion, comentario } = req.body;

    if (!receta_id || !puntuacion) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const receta = await Receta.findById(receta_id);
    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    const existe = await Valoracion.findOne({
      receta_id,
      usuario_id: user.id
    });

    if (existe) {
      return res.status(400).json({
        message: "Ya valoraste esta receta"
      });
    }

    const val = await Valoracion.create({
      receta_id,
      usuario_id: user.id,
      puntuacion,
      comentario
    });

    res.json(val);

  } catch (error) {
    res.status(500).json({ message: "Error al crear valoración", error });
  }
};

export const getValoraciones = async (_: Request, res: Response) => {
  try {
    const vals = await Valoracion.find()
      .populate("usuario_id", "nombre")
      .populate("receta_id", "nombre");

    res.json(vals);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo valoraciones", error });
  }
};

export const getValoracionesPorReceta = async (req: Request, res: Response) => {
  try {
    console.log("Receta ID:", req.params.recetaId); // Debug: Verificar el ID recibido
    const vals = await Valoracion.find({
      receta_id: req.params.recetaId
    }).populate("usuario_id", "nombre");

    res.json(vals);

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};


// 🔒 Actualizar valoración (solo dueño o admin)
export const updateValoracion = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const val = await Valoracion.findById(req.params.id);

    if (!val) {
      return res.status(404).json({ message: "Valoración no encontrada" });
    }

    if (val.usuario_id!.toString() !== user.id && user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await Valoracion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Error actualizando", error });
  }
};


export const deleteValoracion = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const val = await Valoracion.findById(req.params.id);

    if (!val) {
      return res.status(404).json({ message: "Valoración no encontrada" });
    }

    if (val.usuario_id!.toString() !== user.id && user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Valoracion.findByIdAndDelete(req.params.id);

    res.json({ message: "Valoración eliminada" });

  } catch (error) {
    res.status(500).json({ message: "Error eliminando", error });
  }
};