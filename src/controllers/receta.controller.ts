import { Request, Response } from "express";
import Receta from "../models/receta.model";
import Usuario from '../models/usuario.model';


export const createReceta = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const receta = await Receta.create({
      ...req.body,
      autor_id: user.id // viene del token
    });

    res.json(receta);
  } catch (error) {
    res.status(500).json({ message: "Error creando receta", error });
  }
};

export const getRecetas = async (_: Request, res: Response) => {
  const recetas = await Receta.find();
  res.json(recetas);
};

export const getReceta = async (req: Request, res: Response) => {
  const receta = await Receta.findById(req.params.id);

  // registrar historial si mandas userId
  const userId = req.query.userId as string;

  if (userId) {
    await Usuario.findByIdAndUpdate(userId, {
      $push: {
        historial_recetas: {
          receta_id: receta?._id,
          fecha_vista: new Date()
        }
      }
    });
  }

  res.json(receta);
};

export const updateReceta = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const receta = await Receta.findById(req.params.id);

    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    // validar dueño o admin
    if (receta.autor_id!.toString() !== user.id && user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await Receta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Error actualizando", error });
  }
};

export const deleteReceta = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const receta = await Receta.findById(req.params.id);

    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    if (receta.autor_id!.toString() !== user.id && user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Receta.findByIdAndDelete(req.params.id);

    res.json({ message: "Receta eliminada" });

  } catch (error) {
    res.status(500).json({ message: "Error eliminando", error });
  }
};

export const buscarPorIngrediente = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ ingredientes: req.params.ing });
  res.json(recetas);
};

export const buscarPorTiempo = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ tiempo_preparacion: { $lte: Number(req.params.time) } });
  res.json(recetas);
};

export const buscarPorTipo = async (req: Request, res: Response) => {
  const recetas = await Receta.find({ tipo: req.params.tipo });
  res.json(recetas);
};

export const getRecomendadas = async (req: Request, res: Response) => {
  const tipo = req.query.tipo as string;
  const ingrediente = (req.query.ingrediente as string).split(',');
  const recetaIdActual = req.query.id as string;

  const recetas = await Receta.find({
    _id: { $ne: recetaIdActual },
    tipo: tipo,
    ingredientes: { $in: [ingrediente] }
  }).limit(5);

  res.json(recetas);
};